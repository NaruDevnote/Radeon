/**
 * @author Tryharddeveloper <https://github.com/tryharddeveloper>
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


const { Schema, model } = require('mongoose');

const guildSchema = Schema({
    guildID: {
        type:               String,
        required:           true
    },
    prefix:                 String,
    actionLog:              String,
    deleteAfterExec:        Boolean,
    requireKickReason:      Boolean,
    requireBanReason:       Boolean,
    banMessage:             String,
    cmdRoleBypass:{
        type:               Map,
        default:            new Map()
    },
    modLogs:{
        channel:            String,
        kicks:{
            type:           Boolean,
            default:        false
        },
        bans:{
            type:           Boolean,
            default:        false
        }
    },
    muteRole:               String,
    everyoneRole:           String,
    ignoredCommands:{
        type:               [String],
        default:            []
    },
    ignoredChannels:{
        type:               [String],
        default:            []
    },
    automod:{
        active:             Boolean,
        channel:            String,
        invites:            Boolean,
        rateLimit:          Boolean,
        massMention:{
            active:         Boolean,
            threshold:{
                type:       Number,
                default:    5
            }
        },
        filter:{
            active:         Boolean,
            list:{
                type:       [String],
                default:    []
            }
        }
    }
});

module.exports = model('Guild', guildSchema, 'Guilds');
