

const Dotenv = require('dotenv'); 

// https://gist.github.com/soplakanets/980737
var crypto = require('crypto');

var SaltLength = 9;

function createHash(password) {
  var salt = generateSalt(SaltLength);
  var hash = md5(password + salt);
  return salt + hash;
}

function validateHash(hash, password) {
  var salt = hash.substr(0, SaltLength);
  var validHash = salt + md5(password + salt);


//console.log('Calculado--->',validHash);
//console.log('H--->',hash);
//console.log('pas--->',password);

  return hash === validHash;
}

function generateSalt(len) {
  var set = ''   //'0123456789abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ',
      set=process.env.TRZ2_PWD_KEY,

      setLen = set.length,
      salt = '';
  for (var i = 0; i < len; i++) {
    var p = Math.floor(Math.random() * setLen);
    salt += set[p];
  }
  return salt;
}

function md5(string) {
  return crypto.createHash('md5').update(string).digest('hex');
}

module.exports = {
  'hash': createHash,
  'validate': validateHash,
  'crear': createHash
};