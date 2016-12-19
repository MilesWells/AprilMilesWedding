var dynogels = require('dynogels');

//set up AWS credentials
dynogels.AWS.config.loadFromPath('./public/server/config/credentials.json');

//require models for dynogels
var User = require('../models/User');
var InvitationCode = require('../models/InvitationCode');
var SongRequest = require('../models/SongRequest');

//create tables for dynogels
dynogels.createTables(function(error) {
    if(error) {
        console.log(error);
        throw error;
    }
});

module.exports = {
    User: User,
    InvitationCode: InvitationCode,
    SongRequest: SongRequest
};