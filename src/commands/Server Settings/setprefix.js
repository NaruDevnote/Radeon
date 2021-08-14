/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

module.exports = {
    name: 'setprefix',
    aliases: ['set-prefix'],
    description: 'Changes Radeon\s prefix to the one specified. If you want to reset to the default prefix use `reset`. The list of charaters below are what can be used as the new prefix. You can use letters but not numbers. The prefix cannot be more than 5 characters in length.\n\n``! ? + - ~ \' \^ * ` ; , : . < > @ & % \ / $ ( ) £ #``',
    usage: 'setprefix <new-prefix>\nsetprefix reset',
    userPerms: 32n,
    guildOnly: true,
    modBypass: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No Prefix Specified.\n```\nsetprefix <new-prefix>\n```', message);
        let newPrefix = args.join(' ').toLowerCase();
        const blocked = new RegExp(/[^a-zA-Z!\?+-~'\^*`;,:.<>@&%\\/$()£#]+/gi);
        if (blocked.test(newPrefix)) return client.errEmb('The new prefix contains an invalid charater(s).\n(see `help setprefix` for more info).', message);
        if (newPrefix.length > 5) return client.errEmb('The new prefix must be 5 characters or less in length.', message);
        if (newPrefix === 'reset') newPrefix = client.config.prefix;
        await client.db('guild').update(message.guild.id, { prefix: newPrefix });
        return client.checkEmb(`Prefix for this server was updated to \`${newPrefix}\``, message);
    }
}
