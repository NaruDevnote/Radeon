/**
 * Automod Main: Message Filter v2
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');

function amodEmbed(message, ctx) {
    return new MessageEmbed()
    .setTitle('Automod Triggered')
    .addFields(
        {name: 'Rule', value: message, inline: false},
        {name: 'User', value: `• ${ctx.author.tag}\n• ${ctx.author.id}`, inline: true},
        {name: 'Channel', value: `• ${ctx.channel}\n• ${ctx.channel.id}`, inline: true}
    )
    .setColor('ORANGE')
    .setTimestamp();
}

module.exports = async (message, automod) => {
    let channel;
    if (automod.channel) channel = message.guild.channels.cache.get(automod.channel);

    if (automod.invites) {
        const re = /(?:https?)?di?sc(?:ord)?\.(?:gg|com|invite)\/([\/\w-]+)/gmi;
        const matches = re.exec(message.content);
        if (matches && matches.length) {
            const invites = await message.guild.fetchInvites();
            if (!invites.some(i => i.code === matches[1])) {
                try {
                    await message.delete().catch(()=>{});
                    if (channel) {
                        channel.send(amodEmbed(`Invite Code Sent: \`${matches[1]}\``, message));
                    }
                    return message.channel.send(`${message.author} Invites are not allowed here.`);
                } catch {}
            }
        }
    }

    if (automod.massMention.active) {
        if (message.mentions.users.size) {
            if (message.mentions.users.size >= automod.massMention.thres) {
                await message.delete().catch(()=>{});
                if (channel) {
                    channel.send(amodEmbed(`${message.mentions.users.size} Mentioned Users`, message));
                }
                return message.reply(`${message.author} Avoid mass-mentioning users.`);
            }
        }
    }
}
