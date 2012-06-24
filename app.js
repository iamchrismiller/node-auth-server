/**
 * Module dependencies.
 */

var express = require('express')
  , SessionStore = require('connect-redis')(express)
  , passport = require('passport')
  , routes = require('./routes');

var app = module.exports = express.createServer();

// Configuration
app.configure(function () {
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', { layout : false });
  app.use(express.cookieParser('SALT'));
  app.use(express.static(__dirname + '/public'));
  app.use(express.session({ secret : 'SALT', store : new SessionStore() }));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.compiler({ src : __dirname + '/public', enable : ['less'] }));
  app.use(app.router);

  //The Start Of the Local Passport Authentication
  // - Would like to implement the oauth Strategy Here
  // http://passportjs.org/guide/oauth.html
  // app.use(passport.initialize());
  // app.use(passport.session());


});

app.configure('development', function () {
  app.use(express.logger({format : 'dev'}));
  app.use(express.errorHandler({
    dumpExceptions : true, showStack : true
  }));
});

app.configure('production', function () {
  app.use(express.errorHandler());
});

app.error(function (err, req, res, next) {
  if (err instanceof NotFound) {
    res.render('error/404.jade', { title : 'Not found 404' });
  } else {
    res.render('error/500.jade', { title : 'Error', error : err });
  }
});

// Routes

app.get('/', routes.index);
app.get('/home', routes.home);
app.get('/logout', routes.logout);
app.get('/users', routes.users.get);

app.get('/login', routes.login.get);
app.post('/login', routes.login.post);
app.get('/register', routes.register.get);
app.post('/register', routes.register.post);


app.listen(3000, '127.0.0.1', function () {
  console.log(
    "started in %s mode at %s:%d"
    , app.settings.env
    , app.address().address
    , app.address().port
  );
});

