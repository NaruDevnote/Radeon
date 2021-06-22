/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');
const Warns = require('../schemas/warn-schema');
const Presets = require('../schemas/presets');

exports.run = async (client, guild) => {
    if (!client.guilds.cache.has(guild.id)) {
        const e = new MessageEmbed()
        .setDescription(`<:checkgreen:796925441771438080> Joined **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
        .setColor(0x00d134)
        .setTimestamp();
        client.channels.cache.get(client.config.logs.joins)?.send(e).catch(()=>{});
    }
    console.log(`MONGO | Guild Added: ${guild.name}`);
    await new Guild(Presets.guildPreset(guild.id)).save();
    await new Muted({ guildID: guild.id }).save();
    await new Warns({ guildID: guild.id }).save();
}
