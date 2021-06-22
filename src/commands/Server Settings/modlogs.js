/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../../schemas/guild-schema');

const ENABLED = '<:checkgreen:796925441771438080> enabled';
const DISABLED = '<:crossred:796925441490681889> disabled';

module.exports = {
    name: 'modlogs',
    description: 'Shows the current modlogs settings and allows for editing using the specified settings/options below (in usage). "log-kicks" and "log-bans" will update the logging to the opposite of what it was. "reset" will reset all modlogs settings.',
    usage: 'modlogs logchannel <Channel:Mention/ID>\nmodlogs logchannel remove\nmodlogs kicks\nmodlogs bans\nmodlogs reasons <kicks|bans>\nmodlogs banmessage [Message]\nmodlogs banmessage remove\nmodlogs reset',
    userPerms: 32n,
    guildOnly: true,
    async run(client, message, args) {
        const data = await Guild.findOne({ guildID: message.guild.id });
        const { modLogs } = data;
        if (!args.length) {
            let modlogChan = 'None Set', actionlogChan = 'None Set';
            if (message.guild.channels.cache.has(modLogs.channel)) modlogChan = `<#${modLogs.channel}>`;
            if (message.guild.channels.cache.has(data.actionLog)) actionlogChan = `<#${data.actionLog}>`;
            switch (modLogs.kicks) {
                case true: kicks = ENABLED; break;
                case false: kicks = DISABLED; break;
                default: kicks = '⚠'; break;
            }
            switch (modLogs.bans) {
                case true: bans = ENABLED; break;
                case false: bans = DISABLED; break;
                default: bans = '⚠'; break;
            }
            switch (data.requireKickReason) {
                case true: kickrs = ENABLED; break;
                case false: kickrs = DISABLED; break;
                default: kickrs = '⚠'; break;
            }
            switch (data.requireBanReason) {
                case true: banrs = ENABLED; break;
                case false: banrs = DISABLED; break;
                default: banrs = '⚠'; break;
            }
            let reasons = 'Kicks: '+ data.requireKickReason ? ENABLED : DISABLED;
            reasons += '\nBans: '+ data.requireBanReason ? ENABLED : DISABLED;
            const embed = new MessageEmbed()
            .setTitle('Server Modlogs')
            .setDescription('You can edit the modlogs settings by using `modlogs <setting> [option]`.\nSee `help modlogs` for information on the options.')
            .addFields(
                {name: 'Modlogs Channel', value: modlogChan, inline: true},
                {name: 'Actionlog Channel', value: actionlogChan, inline: true},
                {name: 'Log Kicks', value: kicks, inline: true},
                {name: 'Log Bans', value: bans, inline: true},
                {name: 'Reasons', value: reasons, inline: true},
                {name: 'Ban Messge', value: data.banMessage ? ENABLED : DISABLED, inline: true}
            )
            .setColor(0x1e143b)
            .setFooter(`Triggered By ${message.author.tag}`, message.author.displayAvatarURL());
            return message.channel.send(embed);
        } else {
            const sub = args[0].toLowerCase();
            if (sub === 'logchannel') {
                if (!args[1]) return client.errEmb('Insufficient Arguments.\n```\nmoglogs logchannel <Channel:Mention/ID>\nmodlogs logchannel remove\n```', message);
                if (args[1].toLowerCase() === 'remove') {
                    if (!modLogs.channel) return client.infoEmb('There is no modlogs channel set.', message);
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ modLogs:{ channel: '', kicks: modLogs.kicks, bans: modLogs.bans }}},
                            { new: true }
                        );
                        return client.checkEmb('Successfully Removed Modlogs Channel!', message);
                    } catch {
                        return client.errEmb('Unknown: Failed Updating `ModLogs:Channel`. Try contacting support.', message);
                    }
                }
                const chan = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
                if (!chan) return client.errEmb('Invalid Channel Specified', message);
                if (chan.type != 'text') return client.errEmb('Channel is not a Default Text Channel', message);
                if (!chan.permissionsFor(message.guild.me).has(2048n)) return client.errEmb('Missing Send Message and Embed Links Permissions For That Channel.', message);
                try {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ modLogs:{ channel: chan.id, kicks: modLogs.kicks, bans: modLogs.bans }}},
                        { new: true }
                    );
                    return client.checkEmb(`Successfully Updated Modlogs Channel to ${chan}!`, message);
                } catch {
                    return client.errEmb('Unknown: Failed Updating `ModLogs:Channel`. Try contacting support.', message);
                }
            
            } else if (sub === 'kicks') {
                try {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ modLogs:{ channel: modLogs.channel, kicks: !modLogs.kicks, bans: modLogs.bans }}},
                        { new: true }
                    );
                    return client.checkEmb(`Successfully ${modLogs.kicks ? 'Disabled' : 'Enabled'} Kick Logs!`, message);
                } catch {
                    return client.errEmb('Unknown: Failed Updating `ModLogs:Kicks`. Try contacting support.', message);
                }
            
            } else if (sub === 'bans') {
                try {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ modLogs:{ channel: modLogs.channel, kicks: modLogs.kicks, bans: !modLogs.bans }}},
                        { new: true }
                    );
                    return client.checkEmb(`Successfully ${modLogs.bans ? 'Disabled' : 'Enabled'} Ban Logs!`, message);
                } catch {
                    return client.errEmb('Unknown: Failed Updating `ModLogs:Bans`. Try contacting support.', message);
                }
            
            } else if (sub === 'reasons') {
                if (!args[1]) return client.errEmb('Insufficient Arguments\n```\nmodlogs reasons <kicks|bans>\n```', message);
                if (args[1].toLowerCase() === 'kicks') {
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ requireKickReason: !data.requireKickReason }},
                            { new: true }
                        );
                        return client.checkEmb(`Successfully ${data.requireKickReason ? 'Disabled' : 'Enabled'} Kick Command Reasons!`, message);
                    } catch {
                        return client.errEmb('Unknown: Failed Updating ``. Try contacting support.', message);
                    }
                } else if (args[1].toLowerCase() === 'bans') {
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ requireBanReason: !data.requireBanReason }},
                            { new: true }
                        );
                        return client.checkEmb(`Successfully ${data.requireBanReason ? 'Disabled' : 'Enabled'} Ban Command Reasons!`, message);
                    } catch {
                        return client.errEmb('Unknown: Failed Updating ``. Try contacting support.', message);
                    }
                } else {
                    return client.errEmb('Unknown Reasons Option. See `help modlogs` for more information.', message);
                }
            
            } else if (sub === 'banmessage') {
                if (!args[1]) {
                    if (!data.banMessage) return client.infoEmb('No ban message has been set. You can set one with the `modlogs banmessage <Message>` command.', message);
                    return message.channel.send(`**Server Ban Message:**\n\n${data.banMessage}`);
                } else if (args[1].toLowerCase() === 'remove') {
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ banMessage: '' }},
                            { new: true }
                        );
                        return client.checkEmb('Successfully Removed Ban Message!', message);
                    } catch {
                        return client.errEmb('Unknown: Failed Updating ``. Try contacting support.', message);
                    }
                } else {
                    const msg = args.slice(2).join(' ');
                    if (!msg || msg.length < 20) return client.errEmb('Ban Message is Too Short (must be 20+ characters).', message);
                    try {
                        await Guild.findOneAndUpdate(
                            { guildID: message.guild.id },
                            { $set:{ banMessage: msg }},
                            { new: true }
                        );
                        return client.checkEmb('Successfully Set Ban Message! You can view it with the `modlogs banmessage` command.', message);
                    } catch {
                        return client.errEmb('Unknown: Failed Updating `BanMessage`. Try contacting support.', message);
                    }
                }
            
            } else if (sub === 'reset') {
                try {
                    await Guild.findOneAndUpdate(
                        { guildID: message.guild.id },
                        { $set:{ modLogs:{ channel: '', kicks: false, bans: false }}},
                        { new: true }
                    );
                    return client.checkEmb('Successfully Reset Modlogs Settings!', message);
                } catch {
                    return client.errEmb('Unknown: Failed Updating `ModLogs`. Try contacting support.', message);
                }
            } else {
                return client.errEmb('Unknown Subcommand. See `help modlogs` for more information.', message);
            }
        }
    }
}
