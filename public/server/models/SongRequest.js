const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('SongRequest', {
    hashKey: 'SongRequestId',

    timestamps: true,

    schema: {
        SongRequestId: joi.string(),
        UserId: joi.string(),
        SongName: joi.string(),
        Artist: joi.string(),
        Album: joi.string()
    },

    indexes: [{
        hashKey: 'UserId',
        name: 'UserId-index',
        type: 'global'
    }]
});