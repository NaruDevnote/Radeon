/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Permissions, MessageEmbed } = require('discord.js');
const { humanize } = require('../../dist/functions');

module.exports = {
    name: 'permissions',
    aliases: ['perms'],
    tag: 'Permissions Tools: subcommands for permissions',
    description: 'Permissions Tools: can send the permissions of a specified user or triggering user, and permissions in a specified channel.',
    usage:'permissions [User:Mention/ID]\npermissions <User:Mention/ID> in <Channel:Mention/ID>\npermissions in <Channel:Mention/ID>\npermissions create <Permission:Name>; ...;\npermissions resolve <Bitfield:Number>',
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) {
            const embed = new MessageEmbed()
            .setAuthor(`Permissions of ${message.author.tag}`, message.author.displayAvatarURL())
            .setDescription(`\`\`\`\n${checkAdmin(message.member.permissions)}\n\`\`\`\n**Bitfield:** ${message.member.permissions.bitfield}`)
            .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        }
        
        const sub = args[0].toLowerCase();
        if (sub == 'create') {
            if (!args[1]) return client.errEmb('No Permissions Specified.\nMake sure each permission is separated by **;**.\n```\npermissions create <Permission:Name>; ...;\n```', message);
                let perms = args.slice(1).join(' ').toUpperCase();
                perms = perms.includes(';')
                    ? perms.split(';')
                    : [perms];
                let invalid = false;
                perms.forEach(p => { if (Permissions.FLAGS[p.trim().replace(/ /g, '')]) invalid = true});
                if (invalid) return client.errEmb('Arguments Contains Invalid Flags.', message);
                let newPerms = new Permissions();
                perms.forEach(p => newPerms.add(p.trim().replace(/ /g, '_')));
                const embed = new MessageEmbed()
                .setTitle('Permissions').setDescription(`Generated Permission Bitfield: **${newPerms.bitfield}**`)
                .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);
        
        } else if (sub == 'resolve') {
            if (!args[1]) return client.errEmb('No Permission Bitfield Provided.\n```\npermissions resolve <Bitfield:Number>\n```', message);
            if (/[^0-9]+n?/gm.test(args[1])) return client.errEmb('Invalid Bitfield Provided.', message);
            const bit = BigInt(args[1]);
            const res = new Permissions(bit);
            const embed = new MessageEmbed()
            .setTitle('Permissions')
            .setDescription(`Resovled from Bitfield **\`${bit}\`**\n\`\`\`\n${checkAdmin(res)}\n\`\`\``)
            .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        
        } else if (sub == 'in') {
            if (!args[1]) return client.errEmb('No Channel Specified.\n```\npermissions in <Channel:Mention/ID>\n```', message);
            const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
            if (!chan) return client.errEmb('Unknown Channel Specified.', message);
            const embed = new MessageEmbed()
            .setTitle(`Permissions in ${chan.name}`)
            .setDescription(`\`\`\`\n${checkAdmin(chan.permissionsFor(message.author))}\n\`\`\`\n**Bitfield:** \`${chan.permissionsFor(message.author).bitfield}\``)
            .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        
        } else {
            const target = message.mentions.members.first() || await message.guild.members.fetch(args[0]);
            if (!target) return client.errEmb('Invalid Member Specified.', message);
            if (args[1] && args[1].toLowerCase() == 'in') {
                if (!args[2]) return client.errEmb('No Channel Specified.\n```\npermissions <User:Mention/ID> in <Channel:Mention/ID>\n```', message);
                const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]);
                if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                const embed = new MessageEmbed()
                .setAuthor(`Permissions for ${target.user.tag} in ${chan.name}`, target.user.displayAvatarURL())
                .setDescription(`\`\`\`\n${checkAdmin(chan.permissionsFor(message.author))}\n\`\`\`\n**Bitfield:** \`${chan.permissionsFor(target).bitfield}\``)
                .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);
            } else {
                const embed = new MessageEmbed()
                .setAuthor(`Permissions of ${target.user.tag}`, target.user.displayAvatarURL())
                .setDescription(`\`\`\`\n${checkAdmin(target.permissions)}\n\`\`\`\n**Bitfield:** \`${target.permissions.bitfield}\``)
                .setColor(0x1e143b).setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                return message.channel.send(embed);
            }
        }
    }
}

function checkAdmin(p) {
    if (p.bitfield === 8n || p.bitfield === Permissions.ALL) return 'Administrator';
    return humanize(p).join(', ');
}
