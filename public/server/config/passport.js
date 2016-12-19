// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');
var dynogels = require('dynogels');

//set up AWS credentials
dynogels.AWS.config.loadFromPath('./public/server/config/credentials.json');

//require models for dynogels
var User = require('../models/User');
var InvitationCode = require('../models/InvitationCode');

//create tables for dynogels
dynogels.createTables(function(error) {
    if(error) {
        console.log(error);
        throw error;
    }
});

// expose this function to our app using module.exports
module.exports = function(passport) {

	// =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        User.get(user.UserId, function(error, data) {
            if(error) {
                console.log(error, data);
                throw error;
            }

            done(error, data);
        });
    });

 	// =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
	// by default, if there was no name, it would just be called 'local'

    passport.use('local-register', new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        //get parameters form request body
        var confirmPassword = req.body.confirmPassword;
        var accessCode = req.body.accessCode;

        //check if passwords match
        if(confirmPassword != password) {
            return done(null, 'Passwords must match.');
        }

        new Promise(function(resolve, reject) {
            //check if the access code is valid
            InvitationCode
                .get(accessCode, function (error, data) {
                    if (error) {
                        console.log(error);
                        reject('There was an error registering.');
                        return;
                    }

                    if (!data) {
                        reject('Invalid invitation code.');
                        return;
                    }

                    if (data.attrs.InvitationCode != accessCode) {
                        reject('Invalid invitation code.');
                        return;
                    }

                    if (data.attrs.Used) {
                        reject('Invitation code has already been used.');
                        return;
                    }

                    resolve();
                })
        })
        .then(function() {
            return new Promise(function(resolve, reject) {
                // check if user exists
                User
                    .query(email)
                    .usingIndex('Email-index')
                    .exec(function(error, data) {
                        if(error) {
                            console.log(error);
                            reject('There was an error registering.');
                            return;
                        }

                        console.log(JSON.stringify(data));
                        console.log(!!data && !!data.Items && data.Items.length > 0);

                        if(!!data && !!data.Items && data.Items.length > 0) {
                            reject('A user with that email already exists.');
                            return;
                        }

                        resolve();
                    });
            });
        })
        .then(function() {
            return new Promise(function(resolve, reject) {
                //user does not exist, add user to table
                User
                    .create({
                        UserId: uuid.v4(),
                        Email: email,
                        Password: bcrypt.hashSync(password)
                    }, function (error, user) {
                        if (error) {
                            console.log(error);
                            reject('There was an error registering.');
                            return;
                        }

                        resolve(user);
                    });
            });
        })
        .then(function(user) {
            return new Promise(function(resolve) {
                //successfully added user to table, mark the access code as used
                InvitationCode
                    .update({
                        InvitationCode: accessCode,
                        Used: true
                    }, function (error) {
                        if (error) {
                            console.log(error);
                        }

                        resolve(user);
                    });
            });
        })
        .then(function(user) {
            return done(null, user);
        })
        .catch(function(message) {
            return done(null, message);
        });
    }));

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for register
    // by default, if there was no name, it would just be called 'local'

    passport.use(new LocalStrategy({
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) { // callback with email and password from our form
        User
            .query(email)
            .usingIndex('Email-index')
            .exec(function(error, data) {

                if(error) {
                    console.log(error);
                    return done(null, 'There was an error logging in.');
                }

                if(!data || data.length == 0 || !bcrypt.compareSync(password, data.Items[0].attrs.Password)) {
                    return done(null, 'Invalid username or password');
                }

                return done(null, data.Items[0].attrs);
            });
    }));

};
