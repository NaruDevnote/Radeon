/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { token } = require('../config.json');
const { ShardingManager } = require('discord.js');
const { logShardSpawn } = require('./dist/console');
const manager = new ShardingManager('./src/Radeon.js', {
    totalShards: 'auto',
    respawn: true,
    token
});

manager.on('shardCreate', shard => logShardSpawn(shard));
manager.spawn();
