/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


module.exports = {
    name: 'jsonembed',
    aliases: ['jsonemb','jsemb', 'jse'],
    tag: 'Creates an embed using JSON string.',
    description: 'Creates an embed using JSON string.',
    usage: 'jsonembed <JSON:Text>\n\njsonembed { "title":"hi", "description":"hello" }',
    cooldown: 2,
    guildOnly: true,
    async run(client, message, args) {
        if (!args.length) return client.errEmb('No JSON Provided.\n```\njsonembed <JSON:Text>\n```', message);
        try {
            const embed = JSON.parse(args.join(' '));
            if (embed.title == undefined && embed.url != undefined) {
                throw new Error('Title is required for URL field.');
            }
            if (embed.author) {
                if (embed.author.name == undefined && embed.author.icon_url != undefined) embed.author.name = '\u200b';
            }
            if (embed.footer) {
                if (embed.footer.text == undefined && embed.footer.icon_url != undefined) embed.footer.text = '\u200b';
            }
            return await message.channel.send({ embeds: [embed] });
        } catch (err) {
            return client.errEmb(err.message, message);
        }
    }
}
