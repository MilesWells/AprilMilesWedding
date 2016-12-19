// app/routes.js
module.exports = function(app, passport) {
	//index route
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

	// logout route
	app.post('/logout', function(req, res){
		req.logout();
		res.send(200);
	});
};