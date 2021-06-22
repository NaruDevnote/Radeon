/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const advanceClean = require('../../functions/advanceClean');
const { parseFlags } = require('../../dist/stringParser');
const flags = '`-users` - Only user messages\n`-bots` - Only bot messages\n`-nopin` - Messages that aren\'t pinned\n`-has <Word>` - Messages that contain a specific word/char\n`-to <Message:ID>` - Messages before that message\n`-em` - Only messages with embeds';

module.exports = {
    name: 'clean',
    aliases: ['cl','clear','purge'],
    tag: 'Deletes a number of messages in a chat',
    description: 'Deletes a number of messages in a channel (min 1, max 100).\n\n**Flags:**\n'+ flags,
    usage: 'clean <Amount:Number>\nclean <Amount:Number> <User:Mention/ID>\nclean <Amount:Number> <...Flags>',
    cooldown: 6,
    userPerms: 8192n,
    botPerms: 8192n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Amount Specified.\n```\nclean <Amount:Number>\nclean <Amount:Number> [User:Mention/ID]\nclean <Amount:Number> [...Flags]\n```\n**Flags:**\n'+ flags, message);
        let amount = parseInt(args[0]);
        if (isNaN(amount) || amount < 1 || amount > 100) return client.errEmb('Invalid Amount Specified. Amount must be a number between 1 and 100.', message);
        if (args.length > 1) {
            let target = '', flagUsers = false, flagBots = false, flagNopin = false, flagHas = '', flagTo = '', flagEmbeds = false;
            const parsed = parseFlags(args.slice(1).join(' '), [
                {name: 'users', type: 'bool'},
                {name: 'bots', type: 'bool'},
                {name: 'nopin', type: 'bool'},
                {name: 'has', type: 'string'},
                {name: 'to', type: 'int'},
                {name: 'em', type: 'bool'}
            ]);
            parsed.forEach(flag => {
                if (!flag.value) return;
                if (flag.name === 'users') flagUsers = true;
                if (flag.name === 'bots') flagBots = true;
                if (flag.name === 'nopin') flagNopin = true;
                if (flag.name === 'has') flagHas = flag.value;
                if (flag.name === 'to') flagTo = flag.value;
                if (flag.name === 'em') flagEmbeds = true;
            });
            if (flagUsers && flagBots) return client.errEmb('Both Users & Bots Flags Specified, pick one.', message);
            if (flagTo && /\D+/g.test(flagTo)) return client.errEmb('Invalid Message ID for To Flag.', message);
            try {
                await message.delete().catch(()=>{});
                const res = await advanceClean(message, amount, { target, flagUsers, flagBots, flagNopin, flagHas, flagTo, flagEmbeds });
                return client.checkEmb(`Deleted ${res} Messages!`, message).then(m => setTimeout(() => m.delete(), 2000));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        } else {
            try {
                await message.delete().catch(()=>{});
                const res = await message.channel.bulkDelete(amount, true);
                return client.checkEmb(`Deleted ${res.size} Messages!`, message).then(m => setTimeout(() => m.delete(), 2000));
            } catch (err) {
                return client.errEmb(err.message, message);
            }
        }
    }
}
