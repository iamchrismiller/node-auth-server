var Nohm = require('nohm').Nohm
  , userModel = require('../lib/models/user.js')
  , passport = require('passport')
  , auth = require('./../auth')
  ;

exports.index = function (req, res) {
  res.render('index', {
    title : 'Hello World'
  });
};

exports.login = {
  get : function (req, res) {
    res.render('login', {
      title : 'Login',
      message: req.flash('error')
    });
  }
};

exports.logout = function (req, res) {
  req.session.destroy();
  res.redirect('/');
};

exports.register = {
  get : function (req, res) {
    res.render('register', {
      title : 'Register'
    });
  },

  post : function (req, res) {
    var user = Nohm.factory('User'),
      email = req.param('email'),
      password = req.param('password');
    user.p('email', email);
    user.p('password', password);

    user.save(function (err) {
      if (err) {
        console.log('Error registering : %s', err);
        res.render('register', {
          title : 'Register',
          err   : 'Error registering'
        });
      } else {

        // Currently Redirecting to login, need to add another passport authentication method
        // Which will bypass the user lookup since we created the account. needing to store
        // the user data in the passport object

        res.redirect('/login');
      }
    });
  }
};

exports.home = function (req, res) {
  res.render('home', {
    title : 'Home'
  });
};

exports.users = {
  get : function (req, res) {
    res.render('users', {
      title : 'User List'
    });
  }
};

exports.notFound = function(req, res) {
  res.render('error/404', {
    title : 'Not found 404'
  });
};
