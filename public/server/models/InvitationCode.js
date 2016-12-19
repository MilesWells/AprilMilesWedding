const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('InvitationCode', {
    hashKey: 'InvitationCode',

    timestamps: true,

    schema: {
        InvitationCode: joi.string(),
        Used: joi.boolean()
    }
});