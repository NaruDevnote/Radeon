/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { logError } = require('../../dist/console');
const Guild = require('../../schemas/guild-schema');
const Muted = require('../../schemas/muted-schema');

module.exports = {
    name: 'unmute',
    tag: 'Unmutes a muted user',
    description: 'Unmutes a muted user.',
    usage: 'unmute <User:Mention/ID> [Reason:Text]',
    userPerms: 8192n,
    botPerms: 268435456n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        const { muteRole, modLogs } = await Guild.findOne({ guildID: message.guild.id });
        if (!muteRole) return client.errEmb('Mute role not found/set. You can set one using the `muterole` command.', message);
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nunmute <User:Mention/ID> [Reason:Text]\n```', message);
        const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (!target) return client.errEmb('User is not a member of this server.', message);
        if (!target.roles.cache.has(muteRole)) return client.errEmb(`\`${target.user.tag}\` is not muted.`, message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            const mData = await Muted.findOne({ guildID: message.guild.id });
            if (mData.mutedList.has(target.user.id)) {
                mData.mutedList.delete(target.user.id);
                await Muted.findOneAndUpdate(
                    { guildID: message.guild.id },
                    { $set:{ mutedList: mData }},
                    { new: true }
                );
            }
            await target.roles.remove(muteRole);
            const dmEmb = new MessageEmbed()
            .setTitle('You have been Unmuted!')
            .addField('Reason', reason, false)
            .setColor(0x1e143b).setFooter(`Sent from ${message.guild.name}`, message.guild.iconURL({ dynamic: true }))
            .setTimestamp();
            target.user.send(dmEmb).catch(()=>{});
            client.checkEmb(`\`${target.user.tag}\` was unmuted!`, message);
            if (modLogs.channel && message.guild.channels.cache.has(modLogs.channel)) {
                const embed = new MessageEmbed()
                .setTitle('Member Unmuted')
                .setThumbnail(target.user.displayAvatarURL({ dynamic: true }))
                .addFields(
                    {name: 'User', value: `• ${target.user.tag}\n• ${target.user.id}`, inline: true},
                    {name: 'Moderator', value: `• ${message.author.tag}\n• ${message.author.id}`, inline: true},
                    {name: 'Reason', value: reason, inline: false}
                )
                .setColor('BLUE').setTimestamp();
                return message.guild.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
            }
        } catch (err) {
            logError(err, `${message.guild.id}/${message.channel.id}`, message.author.id);
            return client.errEmb(`Unknown: Failed Unmuting Member \`${target.user.tag}\``, message);
        }
    }
}

module.exports._selfexec = async (client, guild, user) => {
    const GS = client.guilds.cache.get(guild);
    const MS = await GS.members.fetch(user);
    if (!MS) return;
    try {
        const { muteRole, modLogs } = await Guild.findOne({ guildID: GS.id });
        await MS.roles.remove(muteRole);
        if (modLogs.channel && GS.channels.cache.has(modLogs.channel)) {
            const embed = new MessageEmbed()
            .setTitle('Member Unmuted')
            .setThumbnail(MS.user.displayAvatarURL({ dynamic: true }))
            .addFields(
                {name: 'User', value: `• ${MS.user.tag}\n• ${MS.user.id}`, inline: true},
                {name: 'Moderator', value: `• ${client.user.tag}\n• ${client.user.id}`, inline: true},
                {name: 'Reason', value: 'Auto: Mute Expired', inline: false}
            )
            .setColor('BLUE').setTimestamp();
            return GS.channels.cache.get(modLogs.channel).send(embed).catch(()=>{});
        }
    } catch (err) {
        logError(err, __filename);
    }
}
