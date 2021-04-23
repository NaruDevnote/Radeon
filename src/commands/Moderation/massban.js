require('discord.js');
const re2 = require('re2');
const { parseFlags } = require('../../functions/stringParser');

module.exports = {
    name: 'massban',
    tag: 'Mass-bans multiple users',
    description: 'Mass-bans multiple users (message optional). Reason must be in quotations, otherwise default is used.',
    usage: 'massban <...User:Mention/ID> [-m Reason:Text]',
    cooldown: 10,
    userPerms: 8,
    botPerms: 4,
    guildOnly: true,
    run: async (client, message, args) => {
        if (!args.length) return client.errEmb('Insufficient Arguments.\n```\nmassban <...User:Mention/ID> [-m Reason:Text]\n```', message);
        let users = [];
        let reason = '(No Reason Specified)';
        const flags = parseFlags(args.join(' '), [
            {name: 'm', type: 'string'}
        ]);
        if (flags[0] && flags[0].value != null && flags[0].value.length) reason = flags[0].value;

        if (message.mentions.users.size) message.mentions.users.forEach(u => users.push(u.id));
        const reg = new re2(/\b(\d{17,19})+\b/, 'gm').compile().exec(args.join(' '));
        if (reg.length) {
            reg.forEach(id => {
                if (!users.includes(id)) users.push(id);
            });
        }
        if (users.length < 2) return client.errEmb('Massban Must Have Minimum 2 Users.', message);

        const total = users.length;
        let count = 0, res = 0;
        users.forEach(async id => {
            if (count == 4) {
                count = 0;
                setTimeout(() => {}, 3000);
            }
            try {
                await message.guild.members.ban(id, {days: 0, reason: message.author.tag +': '+ reason});
                res++;
            } catch {}
            users.splice(users.indexOf(id));
            count++;
        });
        if (!users.length) {
            return client.checkEmb(`Successfully Banned ${res} out of ${total} Users!`, message);
        }
    }
}