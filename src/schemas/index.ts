/**
 * index.ts for database because TypeScript
 * *cue pain expression*
 * @author Devonte <https://github.com/devnote-dev>
 * @copyright Radeon Development 2021
 */


import { Document, Model } from 'mongoose';

export const AR:       Model<Document> = require('./antiraid-schema');
export const Bans:     Model<Document> = require('./ban-schema');
export const Guild:    Model<Document> = require('./guild-schema');
export const Muted:    Model<Document> = require('./muted-schema');
export const Settings: Model<Document> = require('./settings-schema');
export const Warns:    Model<Document> = require('./warn-schema');
export const Presets:  object          = require('./presets');
