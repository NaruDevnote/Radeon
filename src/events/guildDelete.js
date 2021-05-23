/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */

const { MessageEmbed } = require('discord.js');
const Guild = require('../schemas/guild-schema');
const Muted = require('../schemas/muted-schema');

exports.run = async (client, guild) => {
    const e = new MessageEmbed()
    .setDescription(`<:crossred:796925441490681889> Left **${guild.name}** - Active in ${client.guilds.cache.size} Servers!`)
    .setColor(0xd10000)
    .setTimestamp();
    client.channels.cache.get(client.config.logs.joins).send(e).catch(()=>{});
    await Guild.findOneAndDelete({ guildID: guild.id });
    await Muted.findOneAndDelete({ guildID: guild.id });
    console.log(`MONGO | Guild Removed: ${guild.name}`);
}
