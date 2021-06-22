/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');

exports.run = async (_, member) => {
    const db = await Guild.findOne({ guildID: member.guild.id });
    const { modLogs } = db;
    if (!modLogs.channel || !modLogs.kicks) return;
    const c = member.guild.channels.cache.get(modLogs.channel);
    if (!c) return;
    let count = 0, audit;
    do {
        audit = await member.guild.fetchAuditLogs({ type: 20, limit: 2 }).catch(()=>{});
        count++;
        if (!audit) {
            await new Promise(res => setTimeout(res, 3000));
        } else {
            audit = audit.entries.first();
            if (audit.target?.id === member.user.id) break;
            continue;
        }
    } while (!audit && count < 4)
    if (audit) {
        if (audit.target.id !== member.user.id) return;
        const { reason, executor } = audit;
        const embed = new MessageEmbed()
        .setTitle('Member Kicked')
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
        .addFields(
            {name: 'User', value: `• ${member.user.tag}\n• ${member.user.id}`, inline: true},
            {name: 'Moderator', value: `• ${executor.tag}\n• ${executor.id}`, inline: true},
            {name: 'Reason', value: reason || '(No Reason Specified)', inline: false}
        )
        .setColor('GREY')
        .setTimestamp();
        c.send(embed).catch(()=>{});
    }
}
