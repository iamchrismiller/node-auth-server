var nohm = require('nohm').Nohm
  , uuid = require('node-uuid')
  , crypto = require('crypto');


var hashPassword = function (password) {
  var hash = crypto.createHash('sha256')
    , salt = 'SALT';
  hash.update(password);
  hash.update(salt);
  return hash.digest('base64');
};

var generateUUID = function () {
  var uuid = uuid.v4();
};

module.exports = nohm.model('User', {
  idGenerator : 'increment',
  properties  : {
    email    : {
      type        : 'string',
      unique      : true,
      validations: [
        ['notEmpty'],
        ['length', {
          min: 6
        }]
      ]
    },
    password : {
      type        : function (value) {
        return hashPassword(value);
      },
      validations: [
        ['notEmpty'],
        ['length', {
          min: 6
        }]
      ]
    }
  },
  methods     : {

    //Custom Methods

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
