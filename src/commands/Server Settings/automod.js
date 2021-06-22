/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'automod',
    description: 'Shows the current automod config and allows for them to be edited using the subcommands below.',
    usage: 'automod <enable|disable> <all|invites|anti-spam|mass-mention|badwords>\nautomod logchannel <Channel:Mention/ID>\nautomod logchannel remove\nautomod mentions <Number>\nautomod mentions reset\nautomod filter list\nautomod filter <add|remove> [...words]',
    cooldown: 3,
    userPerms: 32n,
    guildOnly: true,
    modBypass: true,
    async run(client, message, args) {
        const data = await Guild.findOne({ guildID: message.guild.id }).catch(console.error);
        if (!data) return client.errEmb('Unknown: Failed Connecting to `Automod`. Try contacting support.', message);
        const { automod } = data;

        if (!args.length) {
            let logchannel = 'None Set';
            if (message.guild.channels.cache.has(automod.channel)) logchannel = `<#${automod.channel}>`;
            switch (automod.invites) {
                case true: invites = '<:checkgreen:796925441771438080> enabled'; break;
                case false: invites = '<:crossred:796925441490681889> disabled'; break;
                default: invites = '⚠'; break;
            }
            switch (automod.rateLimit) {
                case true: rateLimit = '<:checkgreen:796925441771438080> enabled'; break;
                case false: rateLimit = '<:crossred:796925441490681889> disabled'; break;
                default: rateLimit = '⚠'; break;
            }
            switch (automod.massMention.active) {
                case true: mentions = '<:checkgreen:796925441771438080> enabled'; break;
                case false: mentions = '<:crossred:796925441490681889> disabled'; break;
                default: mentions = '⚠'; break;
            }
            switch (automod.filter.active) {
                case true: filter = '<:checkgreen:796925441771438080> enabled'; break;
                case false: filter = '<:crossred:796925441490681889> disabled'; break;
                default: filter = '⚠'; break;
            }
            const embed = new MessageEmbed()
            .setTitle('Automod Settings')
            .setDescription(`The automod for this server is currently ${automod.active ? 'enabled' : 'disabled'}. You can toggle it using the \`automod <enable|disable>\` command.`)
            .addFields(
                {name: 'Log Channel', value: logchannel, inline: true},
                {name: 'Anti-Invites', value: invites, inline: true},
                {name: 'Anti-Spam', value: rateLimit, inline: true},
                {name: 'Mass-Mentions', value: `${mentions}\nThreshold: ${automod.massMention.threshold}`, inline: true},
                {name: 'Word Filter', value: `${filter}\nType \`automod filter list\` to view current ones.`, inline: true}
            )
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);

        } else {
            const sub = args[0].toLowerCase();
            let _active    = handleBool(automod.active),
                _channel   = automod.channel,
                _invites   = handleBool(automod.invites),
                _ratelimit = handleBool(automod.rateLimit),
                _mentions  = automod.massMention,
                _filter    = automod.filter;

            if (sub === 'enable') {
                if (!args[1]) return client.errEmb('No Plugin Specified.\n```\nautomod enable <plugin>\n```', message);
                const p = args[1].toLowerCase();
                if (p === 'all') {
                    _active = 'true';
                    _invites = 'true';
                    _ratelimit = 'true';
                    _mentions.active = true;
                    _filter.active = true;
                } else if (p === 'invites') {
                    _invites = 'true';
                } else if (p === 'antispam' || p === 'anti-spam') {
                    _ratelimit = 'true';
                } else if (p === 'massmention' || p === 'mass-mention') {
                    _mentions.active = true;
                } else if (p === 'filter') {
                    _filter.active = true;
                } else {
                    return client.errEmb('Unknown Plugin. See `help automod` for subcommands, plugins and options.', message);
                }

            } else if (sub === 'disable') {
                if (!args[1]) return client.errEmb('No Plugin Specified.\n```\nautomod enable <plugin>\n```', message);
                const p = args[1].toLowerCase();
                if (p === 'all') {
                    _active = 'false';
                    _invites = 'false';
                    _ratelimit = 'false';
                    _mentions.active = false;
                    _filter.active = false;
                } else if (p === 'invites') {
                    _invites = 'false';
                } else if (p === 'antispam' || p === 'anti-spam') {
                    _ratelimit = 'false';
                } else if (p === 'mass-mention') {
                    _mentions.active = false;
                } else if (p === 'filter') {
                    _filter.active = false;
                } else {
                    return client.errEmb('Unknown Plugin. See `help automod` for subcommands, plugins and options.', message);
                }

            } else if (sub === 'logchannel') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod logchannel <Channel:Mention/ID>\nautomod logchannel remove\n```', message);
                if (args[1].toLowerCase() === 'remove') {
                    if (!automod.channel) return client.infoEmb('There is no Automod log channel setup.', message);
                    _channel = '';
                } else {
                    const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                    if (!chan) return client.errEmb('Unknown Channel Specified.', message);
                    if (chan.type != 'text') return client.errEmb('Specified Channel is not a default Text Channel.', message);
                    if (!chan.permissionsFor(message.guild.me).has(2048n)) return client.errEmb('I am missing `Send Messages` permissions for that channel.', message);
                    _channel = chan.id;
                }

            } else if (sub === 'mentions') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod mentions <Number>\nautomod mentions reset\n```', message);
                if (args[1].toLowerCase() === 'reset') {
                    _mentions.threshold = 5;
                } else {
                    const num = parseInt(args[1]);
                    if (isNaN(num)) return client.errEmb('Invalid Integer Specified.', message);
                    _mentions.threshold = num;
                }

            } else if (sub === 'filter') {
                if (!args[1]) return client.errEmb('No Option Specified.\n```\nautomod filter list\nautomod filter add <...words>\nautomod filter remove <...words>\n```', message);
                const opt = args[1].toLowerCase();
                if (opt === 'list') {
                    if (!_filter.list.length) return client.infoEmb('There are no words saved.', message);
                    const embed = new MessageEmbed()
                    .setTitle('Autmod: Filter List')
                    .setDescription(`Please view this list with discression.\n\`\`\`\n${_filter.list.join('\n')}\n\`\`\``)
                    .setColor(0x1e143b)
                    .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
                    return message.channel.send(embed);
                } else if (opt === 'add') {
                    if (!args[2]) return client.errEmb('No Words Provided.\n```\nautomod filter add <...words>\n```', message);
                    let addwords = args.slice(2).join(' ').trim().toLowerCase().split(' ');
                    if (_filter.list.length) {
                        addwords.filter(w => !automod.filter.list.includes(w))
                        .forEach(w => _filter.list.push(w));
                    } else {
                        _filter.list = addwords;
                    }
                } else if (opt === 'remove') {
                    if (!args[2]) return client.errEmb('No Words Provided.\n```\nautomod filter remove <...words>\n```', message);
                    let remwords = args.slice(2).join(' ').trim().toLowerCase().split(' ');
                    if (_filter.list.length) {
                        remwords.filter(w => automod.filter.list.includes(w))
                        .forEach(w => _filter.list.push(w));
                    } else {
                        _filter.list = remwords;
                    }
                } else {
                    return client.errEmb('Unknown Filter Option. See `help automod` for subcommands, plugins and options.', message);
                }

            } else {
                return client.errEmb('Unknown Subcommand. See `help automod` for subcommands, plugins and options.', message);
            }

            if (
                automod.active === handleBool(_active)
                && automod.channel === _channel
                && automod.invites === handleBool(_invites)
                && automod.rateLimit === handleBool(_ratelimit)
                && automod.massMention.active === _mentions.active
                && automod.massMention.threshold === _mentions.threshold
                && automod.filter.active === _filter.active
                && _filter.list.every(w => automod.filter.list.includes(w))
            ) {
                return client.infoEmb('No changes were made to Automod settings.', message);
            } else {
                try {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ automod:{
                            active: _active,
                            channel: _channel,
                            invites: _invites,
                            rateLimit: _ratelimit,
                            massMention: _mentions,
                            filter: _filter
                        }}},
                        { new: true }
                    );
                    return client.checkEmb('Successfully Updated Automod Settings!', message);
                } catch (err) {
                    console.error(err);
                    return client.errEmb('Unknown: Failed Updating Automod.\nTry contacting support if this error persists.', message);
                }
            }
        }
    }
}

function handleBool(o) {
    if (typeof o === 'boolean') return o.toString();
    if (o === 'true') return true;
    return false;
};
