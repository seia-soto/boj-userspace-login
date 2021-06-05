const login = require('../src')

module.exports = (async () => {
  const token = await login()

  console.log(token)
})()
