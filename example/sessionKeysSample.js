var sessionKeys = require('../')

sessionKeys('user@example.com', 'my secret password', function (err, keys) {
  if (err) {
    console.log(err.stack)
  }

  console.log(keys)
})
