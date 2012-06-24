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
  req.logOut();
  res.redirect('/');
};

exports.register = {
  get : function (req, res) {
    res.render('register', {
      title : 'Register'
    });
  },

  post : function (req, res, next) {
    var user = Nohm.factory('User');

    user.p('email', req.param('email'));
    user.p('password', req.param('password'));

    user.save(function (err) {
      if (err) {
        console.log('Error registering : %s', user.errors);
        res.render('register', {
          title : 'Register',
          err   : user.errors
        });
      } else {
          //Authenticate the current session if registration succeeds
          passport.authenticate('newUser', function(err, user, info) {
            if (err) return next(err);
            if (!user) return res.redirect('/login');
            req.logIn(user, function(err) {
              if (err) return next(err);
              return res.redirect('/home');
            });
          })(req, res, next);
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
