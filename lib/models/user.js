var Nohm = require('nohm').Nohm
  , crypto = require('crypto')
  ;

module.exports = Nohm.model('User', {
  idGenerator : 'increment',
  properties  : {
    email    : {
      type        : 'string',
      unique      : true,
      index        : true,
      validations : [
        ['notEmpty'],
        ['email'],
        [ 'length', {
          min : 6
        }]
      ]
    },
    password : {
      load_pure: true, //load and do not typecast (hashPassword again)
      type        : function (value) {
        return hashPassword(value);
      },
      validations: [
        ['notEmpty']
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
      if (!email || !password) {
        callback(null,null,{err : 'invalid input'});
        return;
      }

      this.find({email : email}, function (err, ids) {
        if (ids.length === 0) {
          callback('The email was not found in our system');
        } else {
          self.load(ids[0], function (err) {
            if (!err && self.p('password') === hashPassword(password)) {
              callback(null, self.allProperties());
            } else {
              callback('Invalid Password, Try Again');
            }
          });
        }
      });
    },

    getByEmail : function(email, callback) {
      var self = this;
      this.find({email : email}, function (err, ids) {
        if (ids.length === 0) {
          callback('The email was not found in our system');
        } else {
          self.load(ids[0], function (err) {
            callback(null, self.allProperties());
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
