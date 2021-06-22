/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */


module.exports = {
    name: 'unban',
    tag: 'Unbans a specified user',
    description: 'Unbans a specified user from the server.',
    usage: 'unban <User:ID> [Reason:Text]',
    cooldown: 3,
    userPerms: 4n,
    botPerms: 4n,
    guildOnly: true,
    roleBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No User Specified.\n```\nunban <User:ID> [Reason:Text]\n```', message);
        const target = args[0];
        if (!/^\d{17,19}$/g.test(target)) return client.errEmb('Invalid User ID Specified.', message);
        if (await message.guild.members.fetch(target) || !await message.guild.bans.fetch(target).catch(()=>{})) return client.errEmb('User is not banned from this server.', message);
        let reason = '(No Reason Specified)';
        if (args.length > 1) reason = args.slice(1).join(' ');
        try {
            const US = await message.guild.bans.remove(target, `${message.author.tag}: ${reason}`);
            return client.checkEmb(`Successfully Unbanned \`${US?.tag}\`!`, message);
        } catch {
            return client.errEmb(`Unknown: Failed Unbanning User \`${target}\``, message);
        }
    }
}
