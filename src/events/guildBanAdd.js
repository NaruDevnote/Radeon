/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (_, guild, user) => {
    const db = await Guild.findOne({ guildID: guild.id });
    if (!db) return;
    const { modLogs } = db;
    if (!modLogs.channel || !modLogs.bans) return;
    const c = guild.channels.cache.get(modLogs.channel);
    if (!c) return;
    if (user.partial) user = await user.fetch();
    let count = 0;
    let audit;
    while (!audit) {
        audit = await guild.fetchAuditLogs({ type: 22, limit: 2 }).catch(()=>{});
        if (!audit) {
            count++;
            if (count == 3) break;
            await new Promise(res => setTimeout(res, 3000));
        } else {
            audit = audit.entries.first();
            break;
        }
    }
    if (audit) {
        const { reason, executor } = audit;
        const embed = new MessageEmbed()
        .setTitle('Member Banned')
        .setThumbnail(user.displayAvatarURL({ dynamic: true }))
        .addFields(
            {name: 'User', value: `• ${user.tag}\n• ${user.id}`, inline: true},
            {name: 'Moderator', value: `• ${executor.tag}\n• ${executor.id}`, inline: true},
            {name: 'Reason', value: reason || '(No Reason Specified)', inline: false}
        )
        .setColor('RED')
        .setTimestamp();
        c.send(embed).catch(()=>{});
    }
}
