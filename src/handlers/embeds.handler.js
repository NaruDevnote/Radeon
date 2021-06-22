/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Guild, Message, MessageEmbed } = require('discord.js');

module.exports = async client => {
    client.checkEmb = (msg, ctx) => {
        const e = new MessageEmbed()
        .setDescription('<:checkgreen:796925441771438080> '+ msg)
        .setColor(0x00d134);
        if (ctx instanceof Message) {
            return ctx.channel.send(e);
        } else {
            return ctx.send(e);
        }
    }

    client.errEmb = (msg, ctx) => {
        const e = new MessageEmbed()
        .setDescription('<:crossred:796925441490681889> '+ msg)
        .setColor(0xd10000);
        if (ctx instanceof Message) {
            return ctx.channel.send(e);
        } else {
            return ctx.send(e);
        }
    }

    client.infoEmb = (msg, ctx) => {
        const e = new MessageEmbed()
        .setDescription('<:info:846179402773168159> '+ msg)
        .setColor(0x0054d1);
        if (ctx instanceof Message) {
            return ctx.channel.send(e);
        } else {
            return ctx.send(e);
        }
    }

    client.actionDM = (action, ctx, message) => {
        const e = new MessageEmbed()
        .setTitle(`You have been ${action}!`)
        .setDescription(message)
        .setColor(0x1e143b);
        if (ctx instanceof Guild) {
            e.setFooter(`Sent from ${ctx.name}`, ctx.iconURL({dynamic: true}));
        } else if (ctx instanceof Message) {
            e.setFooter(`Sent from ${ctx.guild.name}`, ctx.guild.iconURL({dynamic: true}));
        }
        return e;
    }
}
