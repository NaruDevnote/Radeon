/**
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { prefix } = require('../../config.json');

exports.guildPreset = guildID => { return {
    guildID,
    prefix,
    actionLog: '',
    deleteAfterExec: false,
    requireKickReason: false,
    requireBanReason: true,
    banMessage: '',
    modLogs:{ channel: '' },
    muteRole: '',
    everyoneRole: '',
    automod:{
        active: false,
        channel: '',
        invites: false,
        rateLimit: false,
        massMention:{ active: false },
        filter:{ active: false }
    }
}}
