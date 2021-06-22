/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const Guild = require('../../schemas/guild-schema');

module.exports = {
    name: 'kick',
    tag: 'Kicks a member from the server',
    description: 'Kicks a member from the server.',
    usage: 'kick <User:Mention/ID> <Reason:Text>',
    cooldown: 4,
    userPerms: 2n,
    botPerms: 2n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No User Specified.\n```\nkick <User:Mention/ID> <Reason:Text>\n```', message);
        const target = message.mentions.members.first() || message.guild.members.fetch(args[0]);
        if (!target) return client.errEmb('User is not a member of this server.', message);
        if (target.user.id === message.author.id) return client.errEmb('You can\'t kick yourself.', message);
        if (target.user.id === client.user.id) return client.errEmb('I can\'t kick myself.', message);
        const data = await Guild.findOne({ guildID: message.guild.id }).catch(()=>{});
        if (!data) return client.errEmb('Unkown: Failed Connecting To Server Database. Try contacting support.', message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        if (data.requireKickReason && reason === '(No Reason Specified)') {
            return client.errEmb('A Reason is Required for this Command.', message);
        }
        if (!target.kickable) return client.errEmb(`User \`${target.user.tag}\` cannot be Kicked (check role and bot perms).`, message);
        try {
            await target.send(client.actionDM('Kicked', message, reason)).catch(()=>{});
            await target.kick(`${message.author.tag}: ${reason}`);
            return client.checkEmb(`Successfully Kicked \`${target.user.tag}\`!`, message);
        } catch {
            return client.errEmb(`Unknown: Failed Kicking Member \`${target.user.tag}\``, message);
        }
    }
}
