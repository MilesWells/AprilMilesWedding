const dynogels = require('dynogels');

//set up AWS credentials
dynogels.AWS.config.loadFromPath('./public/server/config/credentials.json');

//require models for dynogels
const User = require('../models/User');
const InvitationCode = require('../models/InvitationCode');
const SongRequest = require('../models/SongRequest');
const BlogPost = require('../models/blogPosts');

//create tables for dynogels
dynogels.createTables((error) => {
    if(error) {
        console.log(error);
        throw error;
    }
});

module.exports = {
    User: User,
    InvitationCode: InvitationCode,
    SongRequest: SongRequest,
    BlogPost: BlogPost
};