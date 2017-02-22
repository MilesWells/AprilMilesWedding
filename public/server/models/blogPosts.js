const dynogels = require('dynogels');
const joi = require('joi');

module.exports = dynogels.define('BlogPost', {
    hashKey: 'BlogPostId',

    timestamps: true,

    schema: {
        BlogPostId: joi.string(),
        UserId: joi.string(),
        BlogTitle: joi.string(),
        BlogHtml: joi.string()
    },

    indexes: [{
        hashKey: 'UserId',
        name: 'UserId-index',
        type: 'global'
    }]
});