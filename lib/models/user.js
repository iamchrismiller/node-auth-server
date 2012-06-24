var Nohm = require('nohm').Nohm
  , crypto = require('crypto')
  ;

module.exports = Nohm.model('User', {
  idGenerator : 'increment',
  properties  : {
    email    : {
      type        : 'string',
      unique      : true,
      validations : [
        ['notEmpty'],
        [ 'length', {
          min : 6
        }]
      ]
    },
    password : {
      type        : function (value) {
        return hashPassword(value);
      },
      validations : [
        ['notEmpty'],
        ['length', {
          min : 6
        }]
      ]
    },
    status : {
      type         : 'string',
      defaultValue : 'active',
      index        : true
    }
  },
  methods : {
    authenticate : function (email, password, callback) {
      var self = this;
      if (!email || email === '' || !password || password === '') {
        callback('invalid input');
        return;
      }

      this.find({email : email}, function (err, ids) {
        if (ids.length === 0) {
          callback('user not found');
        } else {
          self.load(ids[0], function (err) {
            //get rid of this stupid double hashing - @todo
            if (!err && self.p('password') === hashPassword(hashPassword(password))) {
              callback(null, self.allProperties());
            } else {
              callback('invalid password');
            }
          });
        }
      });
    }
  },

  /**
   * Overwrites nohms allProperties() to strip password
   */
  allProperties : function (stringify) {
    var props = this._super_allProperties.call(this);
    delete props.password;
    return stringify ? JSON.stringify(props) : props;
  }
});

var hashPassword = function (password) {
  var hash = crypto.createHash('sha256'),
    salt = 'SALT';
  hash.update(password);
  hash.update(salt);
  return hash.digest('base64');
};
