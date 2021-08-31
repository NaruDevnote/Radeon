/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { parseFlags } = require('../../dist/stringParser');
const { resolveMember } = require('../../functions');

module.exports = {
    name: 'ban',
    tag: 'Bans a member from the server',
    description: 'Bans a member from the server. `-dd <Number>` flag is for the number of days the user\'s messages should be deleted (max 7).',
    usage: 'ban <User:Mention/ID> <Reason:Text> [-dd <Number>]',
    cooldown: 4,
    userPerms: 4n,
    botPerms: 4n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('Insufficient arguments.\n```\nban <User:Mention/ID> <Reason:Text> [-dd <Number>]\n```', message);
        const target = message.mentions.users.first() || await resolveMember(message, args.raw);
        if (!target) return client.errEmb('User Not Found', message);
        if (target.id === message.author.id) return client.errEmb('You can\'t ban yourself.', message);
        if (target.id === client.user.id) return client.errEmb('I can\'t ban myself.', message);
        let data = await client.db('guild').get(message.guild.id);
        if (!data) return client.errEmb('Unknown: Failed connecting to server database. Try contacting support.', message);
        data = data.automod;
        let reason = '(No Reason Specified)', ddays = 0;
        if (args.length > 2) reason = args.slice(1).join(' ');
        if (data.BanReason) {
            if (args.length < 2 && reason === '(No Reason Specified)') return client.errEmb('A Reason is required for this command.', message);
        }
        const flag = parseFlags(args.raw.slice(1).join(' '), [{name: 'dd', type: 'int'}]);
        if (flag[0].value != null) {
            ddays = flag[0].value;
            if (ddays < 0 || ddays > 7) ddays = 0;
            reason = reason.replace(/\b-dd\s*\d\B/gi, '');
        }
        if (getMemberBannable(message.guild, target)) return client.errEmb('User cannot be banned.', message);
        const banned = await message.guild.bans.fetch(target.id).catch(()=>{});
        if (banned) return client.errEmb('User is already banned.', message);
        try {
            await target.send(client.actionDM('Banned', message, reason)).catch(()=>{});
            if (data.banMessage) await target.send(data.banMessage +`\n\nBan message sent from **${message.guild.name}**`).catch(()=>{});
            const MS = await message.guild.bans.create(target, {days: ddays, reason: `${message.author.tag}: ${reason}`});
            return client.checkEmb(`Successfully banned \`${MS}\``, message);
        } catch {
            return client.errEmb(`Unknown: Failed banning user \`${target.tag}\``, message);
        }
    }
}

async function getMemberBannable(GS, US) {
    try {
        return await client.guilds.cache
            .get(GS.id)
            .members.fetch(US.id)
            .then(m => m.bannable);
    } catch {
        return false;
    }
}
