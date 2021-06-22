/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { toDurationLong } = require('../../dist/functions');

module.exports = {
    name: 'serverinfo',
    tag: 'Sends information about the server.',
    aliases: ['si'],
    description: 'Sends information about the server.',
    cooldown: 12,
    guildOnly: true,
    async run(_, message) {
        message.channel.startTyping();
        const server = message.guild;
        if (server.members.cache.size < Math.round(server.memberCount / 2)) await server.members.fetch();
        const tc = server.channels.cache.filter(c => ['text','news','store'].includes(c.type));
        const vc = server.channels.cache.filter(c => c.type === 'voice');
        const roles = server.roles.cache.size;
        const bots = server.members.cache.filter(m => m.user.bot);
        const an = server.emojis.cache.filter(e => e.animated);
        let acc;
        if (server.partnered) acc += '<:partner:812003146787192903> Partnered\n';
        if (server.verified) acc += '<:Verified:812004278566649907> Verified\n';
        switch (server.explicitContentFilter) {
            case 'DISABLED': ecfl = 'Disabled'; break;
            case 'MEMBERS_WITHOUT_ROLES': ecfl = 'Members Without Roles'; break;
            case 'ALL_MEMBERS': ecfl = 'All Members'; break;
            default: ecfl = 'Unknown'; break;
        }
        switch (server.premiumTier) {
            case 0: tier = 'None'; break;
            case 1: tier = 'Tier 1'; break;
            case 2: tier = 'Tier 2'; break;
            case 3: tier = 'Tier 3 (Max)'; break;
            default: tier = 'Unknown'; break;
        }
        const embed = new MessageEmbed()
        .setTitle(`Server: ${server.name}`)
        .setThumbnail(server.iconURL({ dynamic: true }))
        .addField('Owner', `<@${server.ownerID}>`, true)
        .addField('Members', `${server.memberCount} Total Members\n${server.memberCount - bots.size} Users\n${bots.size} Bots`, true)
        .addField('Created At', `${toDurationLong(server.createdTimestamp)}`, true)
        .addField('Acknowledgements', `${acc || 'None'}`, true)
        .addField('Info', `Region: ${server.region}\nMFA: ${server.mfaLevel}\nContent Filter: ${ecfl}`, true)
        .addField('General', `${tc.size} Text Channels\n${vc.size} Voice Channels\n${roles} Roles`, true)
        .addField('Emojis', `${server.emojis.cache.size} Total Emojis\n${server.emojis.cache.size - an.size} Default\n ${an.size} Animated`, true)
        .addField('Premium (Boosts)', tier, true)
        .setColor(0x1e143b)
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping();
            return message.channel.send(embed)
        }, 2000);
    }
}
