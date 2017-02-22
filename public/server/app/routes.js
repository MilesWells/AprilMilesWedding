let Dynamo = require('../config/dynamoDB');
let uuid = require('uuid');

module.exports = function(app, passport) {
	// index route
	app.get('/', (req, res) => {
		res.render('index.ejs');
	});

	// login route
	app.post('/login', passport.authenticate('local'), (req, res) => {
		res.send(req.user);
	});

	// route to test if the user is logged in or not
	app.get('/loggedin', function(req, res) {
		console.log(req.user);
		res.send(req.isAuthenticated() ? req.user : '0');
	});

	// register route
	app.post('/register', passport.authenticate('local-register'), (req, res) => {
		res.send(req.user);
	});

	// update user info
	app.put('/me', isAuthenticated, (req, res) => {
		Dynamo.User
			.update(req.body.user, (error, user) => {
				if(error) {
					res.status(500).send(error);
				} else {
					res.send(user);
				}
			});
	});

	// logout route
	app.post('/logout', (req, res) => {
		req.logout();
		req.session.destroy( err => {
            if (err) { return next(err); }
            res.send(200);
        });
	});

	// Song request endpoints
	app
		.post('/songRequests', isAuthenticated, (req, res) => {
			let songRequest = req.body.songRequest;
            songRequest.SongRequestId = uuid.v4();

			Dynamo.SongRequest
				.create(songRequest, (error, songRequest) => {
					if(error) {
						console.log(error);
						res.status(500).send(error);
					} else {
						res.send(songRequest);
					}
				});
		})
		.get('/songRequests', isAuthenticated, (req ,res) => {
            Dynamo.SongRequest
                .scan()
                .loadAll()
                .exec((error, data) => {
                	if(error) {
                		res.status(500).send(error);
					} else {
                		res.send(data);
					}
				});
		})
		.get('/songRequests/:userId', isAuthenticated, (req, res) => {
            Dynamo.SongRequest
                .query(req.params.userId)
                .usingIndex('UserId-index')
                .exec((error, data) => {
                    if(error) {
                    	console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.send(data);
                    }
                });
		})
		.delete('/songRequests/:songRequestId', isAuthenticated, (req, res) => {
			Dynamo.SongRequest
				.destroy(req.params.songRequestId, (error) => {
					if(error) {
						res.status(500).send(error);
					} else {
						res.send('request deleted');
					}
				});
		});

	app
		.post('/blogPosts', hasAdminAccess, (req, res) => {
            let blogPost = req.body.blogPost;
            blogPost.BlogPostId = uuid.v4();

            Dynamo.BlogPost
                .create(blogPost, (error, blogPost) => {
                    if(error) {
                        console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.send(blogPost);
                    }
                });
        })
		.get('/blogPosts', (req, res) => {
			Dynamo.BlogPost
				.scan()
				.loadAll()
				.exec((error, data) => {
					if(error) {
						res.status(500).send(error);
					} else {
						res.send(data);
					}
				})
		})
        .get('/blogPosts/:blogPostId', isAuthenticated, (req, res) => {
            Dynamo.BlogPost
                .query(req.params.blogPostId)
                .usingIndex('BlogPostId')
                .exec((error, data) => {
                    if(error) {
                        console.log(error);
                        res.status(500).send(error);
                    } else {
                        res.send(data);
                    }
                });
        })
		.put('/blogPosts/:blogPostId', hasAdminAccess, (req, res) => {
			Dynamo.BlogPost
				.update(blogPost, { expected: { BlogPostId: { Exists: true } } }, (error, blogPost) => {
                    if(error) {
                        res.status(500).send(error);
                    } else {
                        res.send(blogPost);
                    }
				})
		})
        .delete('/blogPosts/:blogPostId', hasAdminAccess, (req, res) => {
            Dynamo.SongRequest
                .destroy(req.params.blogPostId, function(error) {
                    if(error) {
                        res.status(500).send(error);
                    } else {
                        res.send('post deleted');
                    }
                });
        });

    function isAuthenticated(req, res, next) {

        // do any checks you want to in here

        // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
        // you can do this however you want with whatever variables you set up
        if(req.isAuthenticated()) {
            return next();
        }

        // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
        res.status(401).send('Unauthorized');
    }

    function hasAdminAccess(req, res, next) {
    	if(req.isAuthenticated() && req.user.attrs.isAdmin) {
    		return next();
		}

		res.status(401).send('Unauthorized');
	}
};