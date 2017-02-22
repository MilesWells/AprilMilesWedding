// server.js

// set up ======================================================================
// get all the tools we need
let express  = require('express');
let app      = express();
let port     = process.env.PORT || 8080;
let passport = require('passport');
let path     = require('path');

// configuration ===============================================================
require('./public/server/config/passport')(passport); // pass passport for configuration

app.configure(() => {

	// set up our express application
	app.use(express.logger('dev')); // log every request to the console
	app.use(express.cookieParser()); // read cookies (needed for auth)
	app.use(express.bodyParser()); // get information from html forms

	app.set('views', __dirname + '/public/client/views');
	app.set('view engine', 'ejs');

	// required for passport
	app.use(express.session({ secret: 'fuckindynamoyo' })); // session secret
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions

	app.use('/scripts', express.static(__dirname + '/public/client/scripts')); //point to scripts folder
    app.use('/components', express.static(__dirname + '/public/client/components')); //point to components folder
    app.use('/shared', express.static(__dirname + '/public/client/shared')); //point to shared folder
    app.use('/styles', express.static(__dirname + '/public/client/styles')); //point to styles folder
    app.use('/images', express.static(__dirname + '/public/client/images')); //point to images folder
});

// routes ======================================================================
require('./public/server/app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);
