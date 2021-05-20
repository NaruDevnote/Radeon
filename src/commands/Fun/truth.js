const { choose } = require('../../functions/functions');
const request = require('node-superfetch')
const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'truth',
    tag: 'Returns a random truth.',
    description: 'Returns a random truth',
    usage: 'truth [pg|pg13|r]',
    cooldown: 5,
    run: async (client, message, args) => {
        // setting rating
        let rating = await choose(args, ["pg", "pg13", "r"], null);

        let truth = (await request.get(`https://api.truthordarebot.xyz/truth?rating=${rating}`).then(response => response.body)).question;

        if (!truth)return client.errEmb("No truth was returned, try again or get support", message);

        const embed = new MessageEmbed()
        .setTitle("Truth")
        .setColor(0x1e143b)
        .setFooter(`Rating: ${rating}`)
        .setDescription(truth);
        return message.reply(embed);
    }
}