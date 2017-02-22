let dynogels = require('dynogels');

//set up AWS credentials
dynogels.AWS.config.loadFromPath('./public/server/config/credentials.json');

//require models for dynogels
let User = require('../models/User');
let InvitationCode = require('../models/InvitationCode');
let SongRequest = require('../models/SongRequest');
let BlogPost = require('../models/blogPosts');

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