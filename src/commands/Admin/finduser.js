/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed, GuildMember, Collection } = require('discord.js');
const { toDurationDefault, resolveMember } = require('../../functions');
const { logError } = require('../../dist/console');

module.exports = {
    name: 'finduser',
    aliases: ['find-user'],
    description: 'Fetches a user globally.',
    usage: 'finduser <User:Name/Mention/ID>',
    guildOnly: false,
    modOnly: 4,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No User Specified\n```\nfinduser <User:Name/Mention/ID>\n```', message);
        let user = await resolveMember(message, args.raw);
        if (!user) {
            if (/\D+/g.test(args.raw.join(' '))) return client.errEmb('User Not Found. Try using user ID.', message);
            try {
                user = await client.users.fetch(args.raw.join(' '), true);
                if (!user) return client.errEmb('User is not available.', message);
            } catch (err) {
                logError(err.message, message.guild.id+'/'+message.channel.id, message.author.id);
                return client.errEmb('User is not available.', message);
            }
        }
        if (user instanceof Collection) user = user.first();
        if (user instanceof GuildMember) user = user.user;
        message.channel.startTyping();

        const mutuals = client.guilds.cache
            .filter(g => g.members.cache.has(user.id))
            .map(g => `${g.id} - ${g.name}`)
            .join('\n');

        const embed = new MessageEmbed()
            .setTitle(`Fetched: ${user.tag}`)
            .addField('ID', `${user.id}`, true)
            .addField('Avatar', `[Download Link 📥](${user.displayAvatarURL({ dynamic: true })})`, true)
            .addField('Account Age', toDurationDefault(user.createdTimestamp), false)
            .addField('Mutuals', `\`\`\`\n${mutuals || 'None'}\n\`\`\``, false)
            .setColor(0x1e143b)
            .setThumbnail(user.displayAvatarURL({ dynamic: true }))
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
        setTimeout(() => {
            message.channel.stopTyping()
            return message.channel.send({ embeds:[embed] })
        }, 2000);
    }
}