var sha256 = require('fast-sha256')
var scrypt = require('scrypt-async')
var nacl = require('tweetnacl')
var base64 = require('base64-js')

// Code inspired by:
// https://github.com/kaepora/miniLock/blob/master/src/js/miniLock.js
// https://github.com/jo/session25519

// Extracted from tweetnacl-util-js
// https://github.com/dchest/tweetnacl-util-js/blob/master/nacl-util.js#L16
function decodeUTF8 (s) {
  var i, d, b
  d = unescape(encodeURIComponent(s))
  b = new Uint8Array(d.length)

  for (i = 0; i < d.length; i++) b[i] = d.charCodeAt(i)
  return b
}

// Convert a decimal to hex with proper padding
// Input:
//   d                      // A decimal number between 0-255
//
// Result:
//   Returns a padded hex string representing the decimal arg
//
function decToHex (d) {
  var hex = Number(d).toString(16)
  while (hex.length < 2) {
    hex = '0' + hex
  }
  return hex
}

// Convert Uint8Array of bytes to hex
// Input:
//   arr                      // Uint8Array of bytes to convert to hex
//
// Result:
//   Returns a Base16 hex encoded version of arr
//
function byteArrayToHex (arr) {
  var hex, i
  hex = ''
  for (i = 0; i < arr.length; ++i) {
    hex += decToHex(arr[i])
  }
  return hex
}

// Input:
//   key                      // User key hash (Uint8Array)
//   salt                     // Salt (username or email) (Uint8Array)
//   callback function
//
// Result:
//   Returns 256 bytes of scrypt derived key material in a Uint8Array,
//   which is then passed to the callback.
//
function getScryptKey (key, salt, callback) {
  'use strict'

  scrypt(key, salt, {
    N: 16384,
    r: 8,
    p: 1,
    dkLen: 256,
    encoding: 'binary'
  }, function (derivedKey) {
    return callback(derivedKey)
  })
}

// Input:
//  id          // A UTF-8 username or email
//  password    // A UTF-8 passphrase
//  callback    // A callback function
//
// Result:
//   An object literal with all key material
//
exports.generate = function (id, password, callback) {
  'use strict'

  var idSha256Bbytes, idSha256Hex, scryptKey, scryptSalt, byteKeys,
    hexKeys, naclEncryptionKeyPairs, naclEncryptionKeyPairsBase64,
    naclSigningKeyPairs, naclSigningKeyPairsBase64, out

  idSha256Bbytes = sha256(decodeUTF8(id))
  idSha256Hex = byteArrayToHex(idSha256Bbytes)

  scryptKey = sha256(decodeUTF8(password))
  scryptSalt = sha256(decodeUTF8([idSha256Hex, idSha256Hex.length, 'session_keys'].join('')))

  getScryptKey(scryptKey, scryptSalt, function (scryptByteArray) {
    try {
      byteKeys = []
      hexKeys = []
      naclEncryptionKeyPairs = []
      naclEncryptionKeyPairsBase64 = []
      naclSigningKeyPairs = []
      naclSigningKeyPairsBase64 = []

      // Generate 8 pairs of all types of keys. The key types
      // at each Array index are all derived from the same key
      // bytes. Use different Array index values for each to ensure
      // they don't share common key bytes. For example:
      //
      // uuid : output.hexKeys[0]
      // encryption keypair : output.naclEncryptionKeyPairs[1]
      // signing keypair : output.naclSigningKeyPairs[2]
      //
      var b = 0
      for (var i = 0; i < 8; ++i) {
        var byteArr = scryptByteArray.subarray(b, b + 32)
        byteKeys.push(byteArr)
        hexKeys.push(byteArrayToHex(byteArr))

        var naclEncryptionKeyPair = nacl.box.keyPair.fromSecretKey(byteArr)
        var naclSigningKeyPair = nacl.sign.keyPair.fromSeed(byteArr)

        naclEncryptionKeyPairs.push(naclEncryptionKeyPair)
        naclEncryptionKeyPairsBase64.push({
          secretKey: base64.fromByteArray(naclEncryptionKeyPair.secretKey),
          publicKey: base64.fromByteArray(naclEncryptionKeyPair.publicKey)
        })

        naclSigningKeyPairs.push(naclSigningKeyPair)
        naclSigningKeyPairsBase64.push({
          secretKey: base64.fromByteArray(naclSigningKeyPair.secretKey),
          publicKey: base64.fromByteArray(naclSigningKeyPair.publicKey)
        })

        b += 32
      }

      out = {}
      out.id = idSha256Hex
      out.byteKeys = byteKeys
      out.hexKeys = hexKeys
      out.naclEncryptionKeyPairs = naclEncryptionKeyPairs
      out.naclEncryptionKeyPairsBase64 = naclEncryptionKeyPairsBase64
      out.naclSigningKeyPairs = naclSigningKeyPairs
      out.naclSigningKeyPairsBase64 = naclSigningKeyPairsBase64

      return callback(null, out)
    } catch (err) {
      return callback(err)
    }
  })
}
