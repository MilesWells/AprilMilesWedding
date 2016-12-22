var Dynamo = require('../config/dynamoDB');
var uuid = require('uuid');

module.exports = function(app, passport) {
	// index route
	app.get('/', function(req, res) {
		res.render('index.ejs');
	});

	// login route
	app.post('/login', passport.authenticate('local'), function(req, res) {
		res.send(req.user);
	});

	// route to test if the user is logged in or not
	app.get('/loggedin', function(req, res) {
		res.send(req.isAuthenticated() ? req.user : '0');
	});

	// register route
	app.post('/register', passport.authenticate('local-register'), function(req, res) {
		res.send(req.user);
	});

	// update user info
	app.put('/me', isAuthenticated, function(req, res) {
		Dynamo.User
			.update(req.body.user, function(error, user) {
				if(error) {
					res.status(500).send(error);
				} else {
					res.send(user);
				}
			});
	});

	// logout route
	app.post('/logout', function(req, res){
		req.logout();
		res.send(200);
	});

	// Song request endpoints
	app
		.post('/songRequests', isAuthenticated, function(req, res) {
			var songRequest = req.body.songRequest;
            songRequest.SongRequestId = uuid.v4();

			Dynamo.SongRequest
				.create(songRequest, function(error, songRequest) {
					if(error) {
						console.log(error);
						res.status(500).send(error);
					} else {
						res.send(songRequest);
					}
				});
		})
		.get('/songRequests', isAuthenticated, function(req ,res) {
            Dynamo.SongRequest
                .scan()
                .loadAll()
                .exec(function(error, data) {
                	if(error) {
                		res.status(500).send(error);
					} else {
                		res.send(data);
					}
				});
		})
		.get('/songRequests/:userId', isAuthenticated, function(req, res) {
            Dynamo.SongRequest
                .query(req.params.userId)
                .usingIndex('UserId-index')
                .exec(function(error, data) {
                    if(error) {
                    	console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.send(data);
                    }
                });
		})
		.delete('/songRequests/:songRequestId', isAuthenticated, function(req, res) {
			Dynamo.SongRequest
				.destroy(req.params.songRequestId, function(error) {
					if(error) {
						res.status(500).send(error);
					} else {
						res.send('request deleted');
					}
				});
		});

    function isAuthenticated(req, res, next) {

        // do any checks you want to in here

        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if (req.isAuthenticated())
            return next();

        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.status(401).send('Unauthorized');
    }
};