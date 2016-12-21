const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('User', {
    hashKey: 'UserId',

    timestamps: true,

    schema: {
        UserId: joi.string(),
        Email: joi.string().email(),
        Password: joi.string(),
        InvitationCode: joi.string(),
        Name: joi.string(),
        Rsvp: joi.boolean(),
        PlusOne: joi.boolean()
    },

    indexes: [{
        hashKey: 'Email',
        name: 'Email-index',
        type: 'global'
    }]
});