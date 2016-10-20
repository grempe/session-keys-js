# sessionKeys (JavaScript)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[![Build Status](https://travis-ci.org/grempe/session-keys-js.svg?branch=master)](https://travis-ci.org/grempe/session-keys-js)

`sessionKeys` is a cryptographic tool for the generation of unique user IDs,
and NaCl compatible [Curve25519](https://cr.yp.to/ecdh.html) encryption, and
[Ed25519](http://ed25519.cr.yp.to) digital signature keys using JavaScript.

It is compatible with [grempe/session-keys-rb](https://github.com/grempe/session-keys-rb)
which can generates identical IDs and crypto keys server-side using Ruby when given the
same username and passphrase values. Both libraries have extensive tests to
ensure they remain interoperable.

## Security

The encryption and signing keys are created with
[TweetNaCl.js](https://github.com/dchest/tweetnacl-js), a port of
[TweetNaCl](http://tweetnacl.cr.yp.to/) / [NaCl](http://nacl.cr.yp.to/) to
JavaScript for modern browsers and Node.js. The encryption keys are for the
Public-key authenticated encryption `box` construction which
implements `curve25519-xsalsa20-poly1305`. The signing keys are for the `Ed25519`
digital signature system.

The strength of the system lies in the fact that the keypairs are derived from
passing an identifier such as a username or email address, and a high-entropy
passphrase through the `SHA256` cryptographic one-way hash function,
and then 'stretching' that username/password into strong key material using
the `scrypt` key derivation function.

The benefit of this approach are manifold:

- Cryptographically secure key generation, full 32 byte (256 bit) keys
- Risk of brute force attempts at key discovery likely eliminated
- A deterministic ID protects user privacy when used in place of stored username on server
- No need to manage or move keypairs around for use on different devices
- Users never need to store sensitive key material on disk
- Key material can't be stolen or copied without compromise of username/passphrase
- Key material is deterministic, same username/passphrase always results in same keys
- Multiple sets of key material are generated, allowing applications to secure different things with different keys
- Cross language, Javascript and Ruby currently supported.

The code is simple and easily auditable, and uses only the fast and secure `SHA256`
hash function, `scrypt` for strong key derivation, and the `NaCL` compatible
encryption and digital signature keys provided by `tweetnacl-js`.

This code was inspired by, but is **incompatible** with, the
[session25519](https://github.com/jo/session25519) library created by
[Johannes Jörg Schmidt (@jo)](https://github.com/jo).

It bears repeating that **the strength of this system is very strongly
tied to the strength of the passphrase chosen by the user**. Application
developers are **strongly encouraged** to enforce the use of
high-entropy passphrases by their users. Memorable high-entropy passphrases,
such as can be generated using [Diceware](https://www.rempe.us/diceware/),
and measured with password strength estimation tools like
[zxcvbn](https://github.com/dropbox/zxcvbn), are critically important to
the overall security of this system.

## Usage

Simply pass in a user identifier, such as an email address and a high-entropy
passphrase. The callback will return an Object Literal with the key material.

A total of 256 bytes of key material is derived, and this is split into 8
32 byte keys which are returned as an Array of [Uint8Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array)
objects with raw binary data.

Each of those keys are also returned as hex values, and derived encryption
and signing keypairs with Base64 encoded versions as well for convenience.
This gives you eight different secure keys to choose from with various
representations.


```js
var sessionKeys = require('session-keys')

sessionKeys.generate('user@example.com', 'my secret password', function(err, keys) {
  // {
  //   id: "0123456789abcdef",
  //   byteKeys: [...],
  //   hexKeys: [...],
  //   naclEncryptionKeyPairs: [...],
  //   naclEncryptionKeyPairsBase64: [...],
  //   naclSigningKeyPairs: [...],
  //   naclSigningKeyPairsBase64: [...],
  // }
})
```

## Cryptographic Design

The following pseudo-code illustrates how `sessionKeys` derives keys
from a user ID and passphrase.

```txt
// PSEUDOCODE

// 32 Byte hash of the user name
id = SHA256(username)

// 32 Byte hash of the password
key = SHA256(password)

// 32 Byte hash of the ID, its length, and a library specific string
salt = SHA256(id + idLength + 'session_keys')

// scrypt params
// 256 bytes of scrypt output
derivedBytes = scrypt(key, salt, N = 16384, r = 8, p = 1, dkLen = 256)

// Return all of the following
//////////////////////////////

// The hex encoded sha256(username)
idhex = hex(id)

// Split the 256 derived bytes into 8 * 32 byte Uint8Array keys
byteKeys = []

// For each byteKey generate:

  // An Array of the hex values of each byteKey
  hexKeys = []

  // An Array of NaCl Encryption keys seeded from each byteKey
  naclEncryptionKeyPairs = []

  // An Array of NaCl Encryption keys seeded from each byteKey, Base 64 encoded
  naclEncryptionKeyPairsBase64 = []

  // An Array of NaCl Signing keys seeded from each byteKey
  naclSigningKeyPairs = []

  // An Array of NaCl Signing keys seeded from each byteKey, Base 64 encoded
  naclSigningKeyPairsBase64 = []

```

## Performance

The author of [scrypt-async-js](https://github.com/dchest/scrypt-async-js),
which is the strong key derivation mechanism used by `sessionKeys`, [recommends](https://github.com/dchest/scrypt-async-js/commit/ac57f235b505eb3f4fa8f2f95ae22d7eddd655d5)
using `setImmediate`:

> Using `setImmediate` massively improves performance. Since
> most browsers don't support it, you'll have to include a
> shim for it.

- [YuzuJS/setImmediate](https://github.com/YuzuJS/setImmediate)
- [setImmediate shim demo](http://jphpsf.github.io/setImmediate-shim-demo/)
- [caniuse setImmediate](http://caniuse.com/#search=setImmediate)

Performance in this context is *not* about making the key derivation run faster, as
that would kind of defeat the purpose. It is instead about ensuring your
application remains responsive while this code is running.

## Resources

### fast-sha256-js
- Origin: https://github.com/dchest/fast-sha256-js
- License: Public Domain

### scrypt-async-js
- Origin: https://github.com/dchest/scrypt-async-js
- License: BSD-like, see LICENSE file or MIT license at your choice.

### TweetNaCl.js
- Origin: https://github.com/dchest/tweetnacl-js
- License: Public Domain

### base64-js
- Origin: https://github.com/beatgammit/base64-js
- License: MIT

## Development

### Setup

This project now manages all dependencies with [yarn](https://yarnpkg.com) which
you'll need to install first.

Make sure you are using v0.16.0 or higher.

```
$ yarn -V
0.16.0
```

Install all dependencies locally.

```
yarn
```

### Build

You can build a `dist` version of `sessionKeys` using `browserify`. There is a
pre-built version in the `dist` directory of this repository which includes
all dependencies and can be used with a `<script>` tag in the browser.

```sh
yarn run build
```

### Testing

```sh
# run all tests locally with node
yarn test

# run all tests locally from test.html in your default browser
# test output will be in your browser's console.
yarn run test-browser
```

### Installation Security : Signed Git Commits

Most, if not all, of the commits and tags in the repository for this code are
signed with my PGP/GPG code signing key. I have uploaded my code signing public
keys to GitHub and you can now verify those signatures with the GitHub UI.
See [this list of commits](https://github.com/grempe/session-keys-js/commits/master)
and look for the `Verified` tag next to each commit. You can click on that tag
for additional information.

You can also clone the repository and verify the signatures locally using your
own GnuPG installation. You can find my certificates and read about how to conduct
this verification at [https://www.rempe.us/keys/](https://www.rempe.us/keys/).

### Contributing

Bug reports and pull requests are welcome on GitHub
at [https://github.com/grempe/session-keys-js](https://github.com/grempe/session-keys-js). This
project is intended to be a safe, welcoming space for collaboration, and contributors
are expected to adhere to the
[Contributor Covenant](http://contributor-covenant.org) code of conduct.

## Legal

### Copyright

(c) 2016 Glenn Rempe <[glenn@rempe.us](mailto:glenn@rempe.us)> ([https://www.rempe.us/](https://www.rempe.us/))

### License

The gem is available as open source under the terms of
the [MIT License](http://opensource.org/licenses/MIT).

### Warranty

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the LICENSE.txt file for the
specific language governing permissions and limitations under
the License.

## Thank You!

Thanks to Dmitry Chestnykh ([@dchest](https://github.com/dchest)) and
Tony Arcieri ([@bascule](https://github.com/bascule)) for all the great
code and help, and [Johannes Jörg Schmidt (@jo)](https://github.com/jo)
for the original implementation.
