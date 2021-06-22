/**
 * @author Devonte <https://github.com/devnote-dev>
 * @author Specky <https://github.com/SpeckyYT>
 * @copyright Radeon Development 2021
 */


const filehound = require('filehound');
const { parse, join } = require('path');
const { logError } = require('../dist/console');

module.exports = async client => {
    let loaded = 0;

    filehound.create()
    .path(join(process.cwd(),'src','events'))
    .ext('.js')
    .findSync()
    .forEach(e => {
        const event = require(e);
        loaded++;
        try {
            client.on(parse(e).base.split('.')[0], (...args) => {
                client.stats.events++;
                await event.run(client, ...args);
            });
        } catch (err) {
            logError(err, __filename);
        }
    });
    if (!loaded) {
        console.log(`\x1b[35mRadeon\x1b[0m | \x1b[31m0\x1b[0m Events Loaded.\nInsufficient Events To Run Radeon. Terminating...`);
        process.exit();
    } else {
        client.stats._events = loaded;
    }
}
