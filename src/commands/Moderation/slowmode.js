/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Piter <https://github.com/piterxyz>
 * @copyright Radeon Development 2021
 */


const ms = require('ms');

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    tag: 'Sets the slowmode for the channel',
    description: 'Sets the slowmode time for the triggering channel. To disable slowmode put `0` or `off`.',
    usage: 'slowmode <Time:Duration> [Reason:Text]\nslowmode off',
    cooldown: 2,
    userPerms: 8192n,
    botPerms: 16n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Duration Specified.\n```\nslowmode <Time:Duration> [Reason:Text]\nslowmode off\n```', message);
        let time, reason = '(No Reason Specified)';
        if (args[0] === 'off') time = 0; else time = ms(args[0]) / 1000;
        if (isNaN(time)) return client.errEmb(`Invalid Duration \`${time}\``, message);
        if (time < 0 || time > 216000) return client.errEmb('Time must be more than 0 and less than 6hours (21600 seconds).', message);
        if (args.length > 1) reason = args.slice(1).join(' ');
        if (!message.guild.me.permissionsIn(message.channel).has(16n)) client.errEmb('Unable to Edit: Missing Permission `MANAGE CHANNELS`', message);
        try {
            await message.channel.setRateLimitPerUser(time, `${message.author.tag}: ${reason}`);
            if (time == 0 || time == 'off') {
                return client.checkEmb('Slowmode Successfully Disabled!', message);
            } else {
                return client.checkEmb(`Slowmode Successfully Set to ${ms(time * 1000, { long: true })}!`, message);
            }
        } catch {
            return client.errEmb('Unknown: Failed Setting Slowmode.', message);
        }
    }
}
