var sessionKeys = require('../')
var test = require('tape')
var base64 = require('base64-js')

// ##########################################################################
// # WARNING : WARNING : WARNING : WARNING : WARNING : WARNING : WARNING
// # DO NOT CHANGE THE RESULT VALUES. THEY ARE USED BY MORE THAN ONE LIBRARY
// # AND THE OUTPUTS MUST BE CONSTANT TO ENSURE INTEROPERABILITY!
// #
// # IF THESE TESTS NO LONGER PASS THEN INTEROPERABILITY IS BROKEN!
// ##########################################################################

// INTERACTIVE

test('interactive test', function (t) {
  sessionKeys.generate('user@example.com', 'pet sprain our trial patch bg', function (err, key) {
    t.plan(7)

    t.notOk(err, 'interactive no error')

    t.equal(key.byteKeys.length, 8, 'interactive byteKeys length')
    t.equal(key.hexKeys.length, 8, 'interactive hexKeys length')
    t.equal(key.naclEncryptionKeyPairs.length, 8, 'interactive naclEncryptionKeyPairs length')
    t.equal(key.naclEncryptionKeyPairsBase64.length, 8, 'interactive naclEncryptionKeyPairsBase64 length')
    t.equal(key.naclSigningKeyPairs.length, 8, 'interactive naclSigningKeyPairs length')
    t.equal(key.naclSigningKeyPairsBase64.length, 8, 'interactive naclSigningKeyPairsBase64 length')
  })
})

test('interactive id test', function (t) {
  sessionKeys.generate('user@example.com', 'pet sprain our trial patch bg', function (err, key) {
    t.plan(2)

    t.notOk(err, 'interactive id no error')

    t.equals(key.id, 'b4c9a289323b21a01c3e940f150eb9b8c542587f1abfd8f0e1cc1ffc5e475514', 'interactive id')
  })
})

test('interactive byteKeys test', function (t) {
  sessionKeys.generate('user@example.com', 'pet sprain our trial patch bg', function (err, key) {
    t.plan(2)

    t.notOk(err, 'interactive byteKeys no error')

    t.deepEqual(key.byteKeys,
      [
        new Uint8Array([227, 213, 226, 155, 22, 212, 112, 32, 60, 247, 86, 101, 125, 154, 151, 234, 71, 59, 82, 79, 8, 52, 188, 100, 91, 28, 165, 216, 183, 137, 157, 17]),
        new Uint8Array([1, 37, 254, 86, 67, 74, 79, 174, 191, 132, 239, 255, 168, 102, 235, 106, 29, 219, 45, 47, 237, 108, 62, 205, 151, 27, 163, 160, 14, 0, 166, 54]),
        new Uint8Array([81, 64, 179, 222, 199, 221, 82, 29, 93, 162, 162, 48, 44, 38, 209, 199, 21, 244, 64, 92, 47, 201, 177, 111, 93, 89, 82, 130, 203, 120, 135, 187]),
        new Uint8Array([128, 57, 78, 134, 230, 191, 121, 88, 50, 177, 118, 75, 63, 231, 21, 168, 106, 103, 187, 78, 254, 58, 140, 198, 237, 3, 109, 126, 68, 60, 204, 216]),
        new Uint8Array([125, 57, 175, 89, 168, 203, 202, 97, 200, 211, 78, 174, 118, 117, 162, 77, 206, 120, 124, 239, 76, 158, 219, 104, 27, 72, 253, 129, 100, 216, 68, 122]),
        new Uint8Array([244, 123, 137, 212, 254, 81, 59, 36, 159, 247, 79, 163, 24, 189, 249, 58, 104, 13, 58, 174, 84, 236, 166, 53, 158, 251, 235, 160, 188, 44, 17, 35]),
        new Uint8Array([70, 41, 248, 98, 4, 156, 146, 253, 236, 23, 38, 177, 1, 91, 139, 123, 15, 96, 53, 41, 168, 60, 244, 52, 89, 16, 219, 60, 29, 183, 32, 110]),
        new Uint8Array([61, 52, 141, 115, 90, 229, 18, 231, 253, 192, 39, 20, 196, 222, 98, 126, 178, 56, 26, 30, 100, 75, 225, 191, 81, 74, 155, 41, 78, 19, 53, 97])
      ]
      , 'interactive byteKeys')
  })
})

test('interactive hexKeys test', function (t) {
  sessionKeys.generate('user@example.com', 'pet sprain our trial patch bg', function (err, key) {
    t.plan(2)

    t.notOk(err, 'interactive hexKeys no error')

    t.deepEqual(key.hexKeys,
      [
        'e3d5e29b16d470203cf756657d9a97ea473b524f0834bc645b1ca5d8b7899d11',
        '0125fe56434a4faebf84efffa866eb6a1ddb2d2fed6c3ecd971ba3a00e00a636',
        '5140b3dec7dd521d5da2a2302c26d1c715f4405c2fc9b16f5d595282cb7887bb',
        '80394e86e6bf795832b1764b3fe715a86a67bb4efe3a8cc6ed036d7e443cccd8',
        '7d39af59a8cbca61c8d34eae7675a24dce787cef4c9edb681b48fd8164d8447a',
        'f47b89d4fe513b249ff74fa318bdf93a680d3aae54eca6359efbeba0bc2c1123',
        '4629f862049c92fdec1726b1015b8b7b0f603529a83cf4345910db3c1db7206e',
        '3d348d735ae512e7fdc02714c4de627eb2381a1e644be1bf514a9b294e133561'
      ]
      , 'interactive hexKeys')
  })
})

test('interactive naclEncryptionKeyPairsBase64 test', function (t) {
  sessionKeys.generate('user@example.com', 'pet sprain our trial patch bg', function (err, key) {
    t.plan(2)

    t.notOk(err, 'interactive naclEncryptionKeyPairsBase64 no error')

    t.deepEqual(key.naclEncryptionKeyPairsBase64,
      [
        {secretKey: '49XimxbUcCA891ZlfZqX6kc7Uk8INLxkWxyl2LeJnRE=', publicKey: '9G8XJgiIXj32stQmxtUa8vmmvLGTssTrEwd9tIYpVkA='},
        {secretKey: 'ASX+VkNKT66/hO//qGbrah3bLS/tbD7NlxujoA4ApjY=', publicKey: 'JH73SmhYv43j25rpC8q797XHQi4hx/DrAcQCb5i143k='},
        {secretKey: 'UUCz3sfdUh1doqIwLCbRxxX0QFwvybFvXVlSgst4h7s=', publicKey: 'HmpoJqIjMnHYqvQheiCc8HXymyiGHX3ell8A+2WE330='},
        {secretKey: 'gDlOhua/eVgysXZLP+cVqGpnu07+OozG7QNtfkQ8zNg=', publicKey: 'otEJhqs+cpZ1x4OHva30k4T8ye7x5eUBc2UR5IcZkhc='},
        {secretKey: 'fTmvWajLymHI006udnWiTc54fO9MnttoG0j9gWTYRHo=', publicKey: 'AHHyBuknbD8/2sOe5fUWY7y9zVkOD1SrjaLdBRglVDM='},
        {secretKey: '9HuJ1P5ROySf90+jGL35OmgNOq5U7KY1nvvroLwsESM=', publicKey: 'uFKZeT1VgkltnczCmljitEQswPFjQT2mS6nRKAJ4YnE='},
        {secretKey: 'Rin4YgSckv3sFyaxAVuLew9gNSmoPPQ0WRDbPB23IG4=', publicKey: 'W/VA/NmgV4idPxVtzuGE8Uo5bs2fQU0L2cxhoZJFgyU='},
        {secretKey: 'PTSNc1rlEuf9wCcUxN5ifrI4Gh5kS+G/UUqbKU4TNWE=', publicKey: 'zyQcH+swlgDiBwzDAtFnTMKWR//DdNPyFYNLLMOLsjc='}
      ]
      , 'interactive naclEncryptionKeyPairsBase64')
  })
})

test('interactive naclSigningKeyPairsBase64 test', function (t) {
  sessionKeys.generate('user@example.com', 'pet sprain our trial patch bg', function (err, key) {
    t.plan(9)

    t.notOk(err, 'interactive naclSigningKeyPairsBase64 no error')

    // NOTE : Test only the public (verify) key against the Ruby gem output.
    // RbNaCl and tweetnacl-js somehow have different private key values,
    // but the same public key values. This is OK, since the private
    // key is never shared.
    t.equals(key.naclSigningKeyPairsBase64[0]['publicKey'], '9mc6TmR6fw+OfPZA+TI4pDMeensYo3vHjCAWwNJr5Sg=', 'public key 0')
    t.equals(key.naclSigningKeyPairsBase64[1]['publicKey'], 'IA4yoeU/2xv2elvmJWFLP3Hiy2Hp5FdGpdrJjkf+5FU=', 'public key 1')
    t.equals(key.naclSigningKeyPairsBase64[2]['publicKey'], '/orhEpXoWrbHQcWlg/IEnNiJvW+2j0lS7+/gvOFlppc=', 'public key 2')
    t.equals(key.naclSigningKeyPairsBase64[3]['publicKey'], 'JAr8Pcij0HTvraNF9UeZ3vx0rvtixv4aIIMuDXrq+xc=', 'public key 3')
    t.equals(key.naclSigningKeyPairsBase64[4]['publicKey'], 'j9v+uOiZ2iVYwIiSMEeh8LVtFVagKkQ0n8lM6g7NIEY=', 'public key 4')
    t.equals(key.naclSigningKeyPairsBase64[5]['publicKey'], 'SJF1MvZ0Ggb1UQWHKkn9NHAkHU9A/ofV159fCsB6Pbo=', 'public key 5')
    t.equals(key.naclSigningKeyPairsBase64[6]['publicKey'], 'KlYHO13rFU3vlWxHvMo0s7nILVH6rzsgDAblSz3yVaw=', 'public key 6')
    t.equals(key.naclSigningKeyPairsBase64[7]['publicKey'], 'HllzWBHwzXC4XnQU0xSzGDYN5aUhD2lbSQJVF3f2mQA=', 'public key 7')
  })
})
