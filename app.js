/**
 * Module dependencies.
 */

var express = require('express')
  , SessionStore = require('connect-redis')(express)
  , routes = require('./routes')
  , Nohm = require('nohm').Nohm
  , lessMiddleware = require('less-middleware')
  , redis = require('redis')
  , passport = require('./lib/auth')
  ;

var app = module.exports = express.createServer()
  , redisClient = redis.createClient()
  ;

// Setup Nohm with our redis connection

redisClient.on("connect", function () {
  console.log("Connected to redis");
  Nohm.setClient(redisClient);
}).on("error", function (err) {
  console.log("RedisClient Error " + err);
});

// Configuration
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout : true });

  app.use(express.bodyParser());
  app.use(express.cookieParser('secret'));
  app.use(express.session({ secret : 'secret', store : new SessionStore() }));
  app.use(express.methodOverride());

  app.use(lessMiddleware({src: __dirname + '/public', force : true}));
  app.use(express.static(__dirname + '/public'));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(express.compress());
});

app.configure('development', function () {
  app.use(express.logger('dev'));
  app.use(express.errorHandler({
    dumpExceptions : true,
    showStack : true
  }));
});

app.configure('production', function () {
  app.use(express.logger());
  app.use(express.errorHandler());
});

app.dynamicHelpers({
  session: function (req, res) {
    return req.session;
  }
});

// Authentication handler

function auth(req,res,next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function noauth(req,res,next) {
  if (!req.isAuthenticated()) { return next(); }
  res.redirect('/home');
}

// Routes
app.get('/logout', routes.logout);

app.get('/', noauth, routes.index);

app.get('/login', noauth, routes.login.get);
app.post('/login', noauth, routes.login.post);

app.get(  '/register',  noauth, routes.register.get);
app.post( '/register',  noauth, routes.register.post);

app.get('/home',  auth, routes.home);

app.all('/*', routes.notFound);

app.listen(3000, '127.0.0.1', function () {
  console.log(
    "started in %s mode at %s:%d"
    , app.settings.env
    , app.address().address
    , app.address().port
  );
});

