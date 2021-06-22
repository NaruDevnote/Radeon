/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const { toDurationDefault, toDurationLong } = require('../../dist/functions');

module.exports = {
    name: 'userinfo',
    aliases: ['whois'],
    tag: 'Info about you or a specified user',
    aliases: ['ui'],
    description: 'Sends information about a specified user, or the triggering user if none is specified.',
    usage: 'userinfo [User:Mention/ID]',
    cooldown: 8,
    guildOnly: true,
    async run(client, message, args) {
        let target = message.member;
        if (args.length) target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
        if (!target) return client.errEmb('Invalid Member Specified.', message);
        message.channel.startTyping();
        if (target.partial) target = await target.fetch();
        const member = target;
        target = target.user;

        let presence = 'None or not cached.';
        // Disabled as the bot doesn't have the intents so it doesn't run
        /*
        if (target.presence.activities.length) {
            presence = '';
            target.presence.activities.forEach(act => {
                if (act.type === 'CUSTOM_STATUS') presence += '📄 '+ act.state +'\n';
                if (act.type === 'PLAYING') presence += '🎮 playing '+ act.name +'\n';
                if (act.type === 'LISTENING') {
                    let em = '🎧';
                    if (act.name == 'Spotify') em = '<:Spotify:815659926637903883>';
                    if (act.details && act.state) {
                        presence += `${em} ${act.details} - ${act.state}\n`;
                    } else {
                        presence += `${em} ${act.name}\n`;
                    }
                }
                if (act.type === 'WATCHING') presence += '📺 watching '+ act.name +'\n';
                if (act.type === 'STREAMING') presence += `<:Twitch:815643584492994612> streaming [${act.name}](${act.url || 'https://twitch.tv/'})`;
                if (act.type === 'COMPETING') presence += '⚔️ competing in '+ act.name +'\n';
            });
            if (!presence.length) presence = 'Unknown Activity';
        }
        */

        let roles = [], rest = 0;
        if (member.roles.cache.size) {
            member.roles.cache
                .sort((a, b) => b.position - a.position)
                .forEach(r => { if (r.id !== message.guild.id) roles.push(r) });
            if (roles.length > 5) {
                roles = roles.slice(0, 5);
                rest = member.roles.cache.size - 6;
            }
            roles = roles.join(', ');
            if (rest) roles += `... +${rest} more`;
        }

        let totalf = '';
        const flags = {
            'HOUSE_BRAVERY': '<:hypesquad_bravery:815679606656204831>',
            'HOUSE_BRILLIANCE': '<:hypesquad_brilliance:815679606404546621>',
            'HOUSE_BALANCE': '<:hypesquad_balance:815679606702735420>',
            'HYPESQUAD_EVENTS': '<:hypesquad_events:815697633141981235>',
            'BUGHUNTER_LEVEL_1': '<:BugHunter:818818522506461205>',
            'PARTNERED_SERVER_OWNER': '<:Partner:818818053206835230>'
        }
        if (target.flags) target.flags.toArray().forEach(f => { if (flags[f]) totalf += flags[f] +' ' });
        if (member.premiumSince) totalf += ' <:boost_tier:789702536730509333>';

        const embed = new MessageEmbed()
        .setTitle(`${target.bot ? 'Bot' : 'User'}: ${target.tag}`)
        .setDescription(totalf)
        .addField('ID', `${target.id}`, true)
        .addField('Avatar', `[Download Link 📥](${target.displayAvatarURL({ dynamic: true })})`, true)
        .addField('\u200b', '\u200b', true)
        .addField('Account Age', `${target.createdAt.toDateString()}\n${toDurationLong(target.createdTimestamp)}`, true)
        .addField('Server Member Age', `${member.joinedAt.toDateString()}\n${toDurationDefault(member.joinedTimestamp)}`, true)
        .addField('Presence', presence, false)
        .addField('Roles', roles, false)
        .setColor(member.displayColor || 0x2f3136)
        .setThumbnail(target.displayAvatarURL({ dynamic: true }))
        .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping();
            return message.channel.send(embed);
        }, 2000);
    }
}
