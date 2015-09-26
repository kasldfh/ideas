var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//user auth stuff
//tutorial: http://mherman.org/blog/2015/01/31/local-authentication-with-
//passport-and-express-4/#.VgYPw98SqkA
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//user auth stuff...
//tutorial: https://orchestrate.io/blog/2014/06/26/build-user-authentication-
//with-node-js-express-passport-and-orchestrate/
//var methodOverride = require('method-override');
//var session = require('express-session');
//var passport = require('passport');
//var LocalStrategy = require('passport-local');
//var TwitterStrategy = require('passport-twitter');
//var GoogleStrategy = require('passport-google');
//var FacebookStrategy = require('passport-facebook');

// New Code
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/ideas');
//mongoose.connect('mongodb://localhost/ideas');
//var db = mongoose.connection;
//db = mongoose;

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
////===============PASSPORT===============
//
////This section will contain our work with Passport
//
////===============EXPRESS================
//// Configure Express
//app.use(logger('combined'));
//app.use(cookieParser());
//app.use(bodyParser.urlencoded({ extended: false }));
//app.use(bodyParser.json());
//app.use(methodOverride('X-HTTP-Method-Override'));
//app.use(session({secret: 'supernova', saveUninitialized: true, resave: true}));
//app.use(passport.initialize());
//app.use(passport.session());
//
//// Session-persisted message middleware
//app.use(function(req, res, next){
//  var err = req.session.error,
//      msg = req.session.notice,
//      success = req.session.success;
//
//  delete req.session.error;
//  delete req.session.success;
//  delete req.session.notice;
//
//  if (err) res.locals.error = err;
//  if (msg) res.locals.notice = msg;
//  if (success) res.locals.success = success;
//
//  next();
//});

//end config section

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/users', users);

// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

// mongoose
mongoose.connect('mongodb://localhost/passport_local_mongoose_express4');

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
