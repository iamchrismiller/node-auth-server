var Nohm = require('nohm').Nohm,
  redisClient = require('node-redis').createClient(),
  UserModel = require('../lib/models/user.js');

redisClient.on("connect", function () {
  console.log("RedisClient Connected ");
  Nohm.setClient(redisClient);
});

redisClient.on("error", function (err) {
  console.log(arguments);
  console.log("RedisClient Error " + err);
});

exports.index = function (req, res) {
  res.render('index.jade', {
    title  : 'Hello World',
    layout : false
  });
};

exports.login = {
  get : function (req, res) {
    res.render('login.jade', {
      title  : 'Login',
      layout : false
    });
  },

  post : function (req, res) {
    var email = req.body.email,
      password = req.body.password;


    console.log(email);
    console.log(password);

  }
};

exports.register = {
  get : function (req, res) {
    res.render('register.jade', {
      title  : 'Register',
      layout : false
    });
  },

  post : function (req, res) {
    var user = Nohm.factory('User');
    user.p('email',req.param('email'));
    user.p('password',req.param('password'))

    user.save(function (err) {
      if (err === 'invalid') {
        console.log('user properties were invalid: ', user.errors);
      } else if (err) {
        console.log(err);
      } else {
        res.redirect('/home');
      }
    });
  }
};

exports.home = function (req, res) {
  if (typeof req.session.email === 'undefined') {
    res.redirect('/login');
  } else {
    res.render('home.jade', {
      title  : 'Home',
      layout : false
    });
  }
};
