var nohm = require('nohm').Nohm
  , crypto = require('crypto');

module.exports = nohm.model('User', {
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
    login : function (email, password, callback) {
      var self = this;
      if (!email || email === '' || !password || password === '') {
        callback(false);
        return;
      }

      //Now this is getting a buffer back instead of a string?
      this.find({email : email}, function (err, ids) {
        if (ids.length === 0) {
          callback(false);
        } else {
          self.load(ids[0], function (err) {
            //Seems as if its hashing the hashed password on load ??
            if (!err && self.p('password') === hashPassword(hashPassword(password))) {
              callback(true);
            } else {
              callback(false);
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
