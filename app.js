/**
 * Created by KashiN (Allena Johann), Dravet jean-Baptiste,
 * for TowerDefenseOnline,
 * on 09/03/2016.
 */

/**
 * Library useful
 */
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var passport = require('passport');
var passportLocal = require('passport-local');
var passportHttp = require('passport-http');
var mysql = require('mysql');

/**
 * App express
 */
var app = express();

/**
 * View engine setup
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

/**
 * App use
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(expressSession({
    secret: process.env.SESSION_SECRET || 'secret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/*************************************************************************
 * Data Base *
 **************************************************************************/

var knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        user: 'root',
        password: '1234',
        database: 'TowerDefenseOnline',
        charset: 'utf8'
    }
});

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
    tableName: 'users',
    idAttribute: 'id'
});


/*************************************************************************
 * passport LocalStrategy *
 **************************************************************************/

passport.use(new passportLocal.Strategy(function (pseudo, password, done) {
    new User({pseudo: pseudo}).fetch().then(function (data) {
        var user = data;
        if (user === null) {
            return done(null, false, {dangerMessage: 'Invalid username or password'});
        } else {
            user = data.toJSON();
            if (!(password === user.password)) {
                return done(null, false, {dangerMessage: 'Invalid username or password'});
            } else {
                return done(null, user);
            }
        }
    });
}));

/*************************************************************************
 * passport use *
 **************************************************************************/

passport.serializeUser(function (user, done) {
    done(null, user.pseudo);
});

passport.deserializeUser(function (pseudo, done) {
    new User({pseudo: pseudo}).fetch().then(function (user) {
        done(null, user);
    });
});

app.use(logger('dev'));

app.use(require('node-sass-middleware')({
    src: path.join(__dirname, 'public'),
    dest: path.join(__dirname, 'public'),
    indentedSyntax: true,
    sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

/*************************************************************************
 * Route for this app
 *
 * --
 *
 * index -- Get ('/')
 * game -- Get ('/game')
 * signin -- Get ('/signin')
 * signin -- Post ('/signin')
 * signup -- Get ('/signup')
 * signup -- Post ('/signup')
 * signout -- Get ('/signout')
 *
 **************************************************************************/

/**
 * Index -- Get
 */
app.get('/', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {
        var user = req.user;
        user = user.toJSON();
        res.render('index', {title: 'TowerDefenseOnline -- Choose your game', user: user});
    }
});


/**
 * Game -- Get
 */
app.get('/game', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {
        var user = req.user;
        user = user.toJSON();
        res.render('game/game', {title: 'TowerDefenseOnline -- game', user: user});
    }
});


/**
 * Sign in -- Get
 */
app.get('/signin', function (req, res) {
    if (req.isAuthenticated()) {
        var user = req.user;
        user = user.toJSON();
        res.render('index', {title: 'TowerDefenseOnline -- Choose your game', user: user});
    } else {
        res.render('sign/signin', {title: 'TowerDefenseOnline -- Sign in with your account'});
    }
});

/**
 * Sign in -- Post
 */
app.post('/signin', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/signin'
}), function (req, res) {
    if (err) {
        return res.render('sign/signin', {title: 'Sign In err', dangerMessage: err.dangerMessage});
    } else if (!user) {
        return res.render('sign/signin', {title: 'Sign In user', dangerMessage: err.dangerMessage});
    }
    return req.logIn(user, function (err) {
        if (err) {
            return res.render('signin', {title: 'Sign In err 2', dangerMessage: err.dangerMessage});
        } else {
            return res.redirect('/');
        }
    });
});

/**
 * Signup -- Get
 */
app.get('/signup', function (req, res) {
    if (req.isAuthenticated()) {
        var user = req.user;
        user = user.toJSON();
        res.render('index', {title: 'TowerDefenseOnline -- Choose your game', user: user});
    } else {
        res.render('sign/signup', {title: 'TowerDefenseOnline -- Sign up '});
    }
});

/**
 * Signup -- Post
 */
app.post('/signup', function (req, res) {
    var user = req.body;
    var usernamePromise = null;
    usernamePromise = new User({pseudo: user.pseudo}).fetch();

    return usernamePromise.then(function (model) {
        if (model) {
            res.render('sign/signup', {
                title: 'TowerDefenseOnline -- Sign up',
                dangerMessage: 'username already exists'
            });
        } else {
            var password = user.password;
            var signUpUser = new User({pseudo: user.pseudo, password: password});
            signUpUser.save();
            res.render('sign/signin', {
                title: 'TowerDefenseOnline -- Sign in with your account',
                successMessage: 'Congratulation your account is created'
            });
        }
    });
});

/**
 * Sign out -- get
 */
app.get('/signout', function (req, res) {
    if (!req.isAuthenticated()) {
        res.redirect('/signin');
    } else {
        req.logout();
        res.redirect('/signin');
    }
});

module.exports = app;
