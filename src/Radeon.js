/**
 * @author Piter <https://github.com/piterxyz>
 * @author Devonte <https://github.com/devnote-dev>
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @copyright Radeon Development 2021
 */

const { Client, Collection, Intents:{ FLAGS }} = require('discord.js');
const { token } = require('../config.json');
const { readdirSync } = require('fs');

const client = new Client({
    intents:[
        FLAGS.GUILDS,
        FLAGS.GUILD_BANS,
        FLAGS.GUILD_MEMBERS,
        FLAGS.GUILD_MESSAGES,
        FLAGS.DIRECT_MESSAGES
    ],
    partials:[
        'GUILD_MEMBER',
        'CHANNEL',
        'MESSAGE',
        'USER'
    ],
    allowedMentions:{
        parse:['users'],
        repliedUser: true
    }
});

client.commands   = new Collection();
client.aliases    = new Collection();
client.slash      = new Collection();
client.ratelimits = new Collection();
client.cooldowns  = new Collection();
client.db         = require('./database/manager');
client.hooks      = {
    cache:          new Collection(),
    digest:         new Map()
};
client.stats      = {
    events:     0,
    commands:   new Set(),
    messages:   0,
    background: 0,
    _events:    0,
    _failed:    []
};

readdirSync('./src/handlers/').forEach(handler => {
    if (!handler.endsWith('.h.js')) return;
    require(`./handlers/${handler}`)(client);
});

require('./mongo')();
client.login(token);
