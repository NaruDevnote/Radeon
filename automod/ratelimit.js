/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright 2021 Radeon Development
 */

const { AmodEmbed } = require('.');

module.exports = async (client, message, automod) => {
    const { guild, channel, author } = message;
    const log = message.guild.channels.cache.get(automod.channel);

    const guildState = client.ratelimits.get(guild.id);
    if (guildState) {
        const channelState = guildState.get(channel.id);
        if (channelState) {
            const userState = channelState.get(author.id);
            if (userState) {
                userState.cache.push(message.id);
                if (userState.last < userState.limit) {
                    if (userState.cache.length > 5) {
                        try {
                            await channel.bulkDelete(userState.cache);
                            if (log) log.send({
                                embeds:[AmodEmbed(
                                    `Sent ${userState.cache.length} messages in ${(userState.limit - userState.last) / 1000} seconds`,
                                    author, channel
                                )]
                            });
                            channel.send(`${author}, avoid sending too many similar messages.`);
                        } catch {}
                    }
                } else {
                    userState.cache = [];
                }
                userState.last = Date.now();
                userState.limit = Date.now() + 6000;
                channelState.set(channel.id, userState);
                guildState.set(channel.id, channelState);
                client.ratelimits.set(guild.id, guildState);
            } else {
                channelState.set(author.id, {
                    cache: [message.id],
                    last: Date.now(),
                    limit: Date.now() + 6000
                });
                guildState.set(channel.id, channelState);
                client.ratelimits.set(guild.id, guildState);
            }
        } else {
            const channelState = new Map().set(author.id, {
                cache: [message.id],
                    last: Date.now(),
                    limit: Date.now() + 6000
            });
            guildState.set(channel.id, channelState);
            client.ratelimits.set(guild.id, guildState);
        }
    } else {
        const channelState = new Map().set(author.id, {
            cache: [message.id],
                last: Date.now(),
                limit: Date.now() + 6000
        });
        const guildState = new Map().set(channel.id, channelState);
        client.ratelimits.set(guild.id, guildState);
    }
}