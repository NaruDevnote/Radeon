/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'lock',
    tag: 'Locks a channel from members',
    description: 'Locks the triggering channel or a specified channel (denies the "everyone" role `Send Messages` permission).',
    usage: 'lock [Channel:Mention/ID] [Reason:Text]',
    userPerms: 16n,
    botPerms: 268435456n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        let chan = message.channel;
        let reason = '(No Reason Specified)';
        const data = await Guild.findOne({ guildID: message.guild.id }).catch(()=>{});
        if (!data) return client.errEmb('Unkown: Failed Connecting To Server Database. Try contacting support.', message);
        const role = message.guild.roles.resolve(data.everyoneRole) || message.guild.roles.everyone;
        if (args.length) {
            if (message.mentions.channels.size) {
                chan = message.mentions.channels.first();
                const i = args.indexOf(`<#${chan.id}>`);
                if (i == 0 && args.length > 1) reason = args.slice(1).join(' ');
            } else {
                reason = args.join(' ');
            }
        }
        if (!chan) return client.errEmb('Unknown Channel Specified.', message);
        if (!chan.viewable) return client.errEmb('I don\'t have permissions to view that channel.', message);
        if (!chan.isText) return client.errEmb('Channel is not a Text Channel.', message);
        if (!chan.manageable) return client.errEmb('I don\'t have permissions to manage that channel.', message);
        if (chan.permissionOverwrites.has(role.id)) {
            if (chan.permissionOverwrites.get(role.id).deny.has(2048n)) return client.infoEmb('That Channel is Already Locked. Maybe you meant `unlock`?', message);
        }

        try {
            const embed = new MessageEmbed()
            .setTitle('Channel Locked')
            .addFields(
                {name: 'Reason', value: reason, inline: true},
                {name: 'Moderator', value: message.author, inline: true}
            )
            .setColor(0x0054d1).setTimestamp();
            await chan.send(embed);
            await chan.updateOverwrite(role, { SEND_MESSAGES: false }, `Lock Requested By ${message.author.tag}`);
            return client.checkEmb(`Successfully Locked ${chan}!`, message);
        } catch {
            return client.errEmb('Unknown: Failed Locking Channel.', message);
        }
    }
}
