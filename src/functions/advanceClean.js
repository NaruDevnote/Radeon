/**
 * AdvanceClean Message Processor
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Collection } = require('discord.js');

module.exports = async (message, amount, options) => {
    const { target, flagUsers, flagBots, flagNopin, flagHas, flagTo, flagEmbeds } = options;
    let filtered = new Collection(), count = 0;
    const messages = await message.channel.messages.fetch({ limit: 100, after: flagTo || null });

    if (target || flagUsers || flagBots) {
        messages.forEach(msg => {
            if (count > amount) return;
            if (target) {
                if (msg.author.id === target) {
                    filtered.set(msg.id, msg);
                    count++;
                }
            } else if (flagUsers) {
                if (!msg.author.bot) {
                    filtered.set(msg.id, msg);
                    count++;
                }
            } else if (flagBots) {
                if (msg.author.bot) {
                    filtered.set(msg.id, msg);
                    count++;
                }
            }
        });
    } else {
        messages.forEach(msg => {
            if (count > amount) return;
            filtered.set(msg.id, msg);
            count++;
        });
    }

    if (flagNopin) {
        const temp = filtered.filter(msg => !msg.pinned);
        filtered = temp;
    }
    if (flagHas) {
        const temp = filtered.filter(msg => msg.content.includes(flagHas));
        filtered = temp;
    }
    if (flagEmbeds) {
        const temp = filtered.filter(msg => msg.embeds && msg.embeds.length);
        filtered = temp;
    }

    if (filtered.size) {
        if (filtered.size === 1) {
            await filtered.first().delete();
            return 1;
        } else {
            const num = await message.channel.bulkDelete(filtered, true);
            return num.size;
        }
    } else {
        return 0;
    }
}