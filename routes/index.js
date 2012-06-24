var Nohm = require('nohm').Nohm
  , userModel = require('../lib/models/user.js')
  ;

exports.index = function (req, res) {
  res.render('index', {
    title : 'Hello World'
  });
};

exports.login = {
  get : function (req, res) {
    res.render('login', {
      title : 'Login'
    });
  },

  post : function (req, res) {
    var email = req.body.email
      , password = req.body.password
      , user = Nohm.factory('User')
      ;

    user.login(email, password, function (success) {
      if (success) {
        req.session.authenticated = true;
        req.session.user = user.allProperties();
        res.redirect('/home');
      } else {
        console.log('Authentication failure');
        res.render('login', { title : 'Login', err : "Invalid Email Or Password" });
      }
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
    var user = Nohm.factory('User');
    user.p('email', req.param('email'));
    user.p('password', req.param('password'));

    user.save(function (err) {
      if (err) {
        console.log('Error registering : %s', err);
        res.render('register', {
          title : 'Register',
          err   : 'Error registering'
        });
      } else {
        req.session.authenticated = true;
        req.session.user = user.allProperties();
        res.redirect('/home');
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
}
