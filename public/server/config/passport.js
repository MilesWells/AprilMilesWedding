// config/passport.js

// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt-nodejs');
var uuid = require('uuid');
var Dynamo = require('./dynamoDB');


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
        Dynamo.User.get(user.UserId, function(error, data) {
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
        var name = req.body.name;
        var rsvp = req.body.rsvp;
        var plusOne = req.body.plusOne;

        if(!name || name.trim().length == 0) {
            return done('Name is required.');
        }

        //check if passwords match
        if(confirmPassword != password) {
            return done('Passwords must match.'); // 500 error
        }

        new Promise(function(resolve, reject) {
            //check if the access code is valid
            Dynamo.InvitationCode
                .get(accessCode, function (error, data) {
                    if (error) {
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
                Dynamo.User
                    .query(email)
                    .usingIndex('Email-index')
                    .exec(function(error, data) {
                        if(error) {
                            console.log(error);
                            reject('There was an error registering.');
                            return;
                        }

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
                Dynamo.User
                    .create({
                        UserId: uuid.v4(),
                        Email: email,
                        Password: bcrypt.hashSync(password),
                        InvitationCode: accessCode,
                        Name: name,
                        Rsvp: rsvp,
                        PlusOne: plusOne
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
                Dynamo.InvitationCode
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
            return done(message); // 500 error
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
        Dynamo.User
            .query(email)
            .usingIndex('Email-index')
            .exec(function(error, data) {
                if(error) {
                    return done('There was an error logging in.');
                }

                if(!data || data.length == 0 || !bcrypt.compareSync(password, data.Items[0].attrs.Password)) {
                    return done('Invalid username or password');
                }

                return done(null, data.Items[0].attrs);
            });
    }));

};
