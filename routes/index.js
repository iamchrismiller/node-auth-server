var nohm = require('nohm').Nohm,
  userModel = require('../lib/models/user.js'),
  redis = require('redis'),
  redisClient = redis.createClient();


redisClient.on("connect", function () {
  console.log("RedisClient Connected ");
  nohm.setClient(redisClient);
});

redisClient.on("error", function (err) {
  console.log("RedisClient Error " + err);
});

isLoggedIn = function (session) {
  return (session.auth) ? true : false;
};

exports.index = function (req, res) {
  if (isLoggedIn(req.session)) {
    res.redirect('/home');
  } else {
    res.render('index.jade', {
      title : 'Hello World'
    });
  }
};

exports.login = {
  get : function (req, res) {
    if (isLoggedIn(req.session)) {
      res.redirect('/home');
    } else {
      res.render('login.jade', {
        title : 'Login'
      });
    }
  },

  post : function (req, res) {
    var email = req.body.email,
      password = req.body.password,
      user = nohm.factory('User');

    user.login(email, password, function (success) {
      if (success) {
        req.session.auth = true;
        req.session.user = user.allProperties();
        res.redirect('/home');
      } else {
        //Need to get this working?
        res.render('login.jade', { title : 'Login', err : "Invalid Email Or Password" })
      }
    });
  }
};

exports.logout = function (req, res) {
  if (req.session.auth) req.session.destroy();
  res.redirect('/');
};

exports.register = {
  get : function (req, res) {
    if (isLoggedIn(req.session)) {
      res.redirect('/home');
    } else {
      res.render('register.jade', {
        title : 'Register'
      });
    }
  },

  post : function (req, res) {
    var user = nohm.factory('User');
    user.p('email', req.param('email'));
    user.p('password', req.param('password'));

    console.log("ABOUT TO SAVE");
    user.save(function (err) {
      if (err === 'invalid') {
        console.log('user properties were invalid: ', user.errors);
      } else if (err) {
        console.log("ENCOUNTERED ERROR "+ err );
      } else {
        req.session.auth = true;
        req.session.user = user.allProperties();
        res.redirect('/home');
      }
    });
  }
};

exports.home = function (req, res) {
  if (isLoggedIn(req.session)) {
    res.render('home.jade', {
      title : 'Home'
    });
  } else {
    res.redirect('/login');
  }
};

exports.users = {
  get : function (req, res) {
    if (isLoggedIn(req.session)) {
      res.render('users.jade', {
        title : 'User List'
      });
    } else {
      res.redirect('/login');
    }
  }
};
