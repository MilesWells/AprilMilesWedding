const Dynamo = require('../config/dynamoDB');
const uuid = require('uuid');
const bcrypt = require('bcrypt-nodejs');

module.exports = function(app, passport) {
    app.all('*', (req, res, next) => {
        if (req.get('x-forwarded-proto') == 'https') {
            return next();
        }

        res.set('x-forwarded-proto', 'https');
        res.redirect(`https://${req.host}${req.url}`);
    });

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
		res.send(req.isAuthenticated() ? req.user : '0');
	});

    // route to test if the user is an admin
    app.get('/isadmin', function(req, res) {
        res.send((req.isAuthenticated() && req.user.attrs.isAdmin) ? req.user : '0');
    });

	// register route
	app.post('/register', passport.authenticate('local-register'), (req, res) => {
		res.send(req.user);
	});

    // reset password route
    app.post('/resetpassword', (req, res) => {
        let email = req.body.username;
        let accessCode = req.body.accessCode;
        let password = req.body.password;
        let confirmPassword = req.body.confirmPassword;

        //check if passwords match
        if(confirmPassword != password) {
            return res.status(400).send('Passwords must match.');
        }

        new Promise((resolve, reject) => {
            Dynamo.User
                .scan()
                .loadAll()
                .exec((error, data) => {
                    if (error) {
                        return reject(error);
                    } else {
                        data = data.Items.filter(user => user.attrs.Email == email && user.attrs.InvitationCode == accessCode);
                        if (data.length === 1) {
                            return resolve(data[0].attrs);
                        }

                        return reject('Invalid email/access code combination.')
                    }
                });
        }).then((user) => {
        	user.Password = bcrypt.hashSync(password);
            Dynamo.User
                .update(user, (error, user) => {
                    if(error) {
                        return res.status(500).send(error);
                    }

                    res.status(200).send();
                });
		})
		.catch(message => res.status(500).send(message));
    });

	// forgot password route
	app.post('/forgotpassword', (req, res) => {
		let email = req.body.username;
		let accessCode = req.body.accessCode;
        Dynamo.User
            .scan()
            .loadAll()
            .exec((error, data) => {
                if(error) {
                    return res.status(500).send(error);
                } else {
                	data = data.Items.filter(user => user.attrs.Email == email && user.attrs.InvitationCode == accessCode);
                    if(data.length === 1) {
                    	return res.send(200);
                    }

                    return res.send(400);
                }
            });
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
	app.get('/logout', (req, res) => {
		req.session.destroy(err => {
            if (err) { return next(err); }

            req.logout();
            res.cookie("express.sid", "", { expires: new Date() });
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

	// Blog Post Endpoints
	app
		.post('/blogPosts', hasAdminAccess, (req, res) => {
            let blogPost = req.body.blogPost;
            blogPost.BlogPostId = uuid.v4();

            Dynamo.BlogPost
                .create(blogPost, (error, blogPost) => {
                    if(error) {
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
				});
		})
        .get('/blogPosts/:blogPostId', isAuthenticated, (req, res) => {
            Dynamo.BlogPost
                .query(req.params.blogPostId)
                .usingIndex('BlogPostId')
                .exec((error, data) => {
                    if(error) {
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
				});
		})
        .delete('/blogPosts/:blogPostId', hasAdminAccess, (req, res) => {
            Dynamo.BlogPost
                .destroy(req.params.blogPostId, function(error) {
                    if(error) {
                        res.status(500).send(error);
                    } else {
                        res.send('post deleted');
                    }
                });
        });

	// Admin Control Panel Endpoints
	app
		.post('/admin/accessCodes', hasAdminAccess, (req, res) => {
			let newCode = {
				Used: false,
				InvitationCode: uuid.v4().substr(0, 7)
			};

			Dynamo.InvitationCode
				.create(newCode, (error, code) => {
                if(error) {
                    res.status(500).send(error);
                } else {
                    res.send(code);
                }
            });
		})
		.get('/admin/users', hasAdminAccess, (req, res) => {
            Dynamo.User
                .scan()
                .loadAll()
                .exec((error, data) => {
                    if(error) {
                        res.status(500).send(error);
                    } else {
                        res.send(data);
                    }
                })
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