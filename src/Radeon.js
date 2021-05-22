const { Client, Collection, Intents:{ FLAGS }} = require('discord.js');
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
        'MESSAGE',
        'USER'
    ],
    allowedMentions:{
        parse:['users']
    }
});

client.commands   = new Collection();
client.aliases    = new Collection();
client.slash      = new Collection();
client.ratelimits = new Collection();
client.cmdlogs    = new Set();
client.cooldowns  = new Map();
client.config     = require('../config.json');
client.mongoose   = require('./mongo');
client.rlcount    = 0;
client.stats      = {
    events:     0,
    commands:   0,
    messages:   0,
    background: 0,
    _events:    0,
    _failed:    []
};

readdirSync('./src/handlers/').forEach(handler => {
    if (!handler.endsWith('.handler.js')) return;
    require(`./handlers/${handler}`)(client);
});

// To be replaced soon:
// setInterval(() => { client.rlcount = 0 }, 600000);

client.mongoose.init();
client.login(client.config.token);
