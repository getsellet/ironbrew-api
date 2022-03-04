const { default: ow } = require('ow')
const luaparse = require('luaparse')
const obfuscate = require('../../modules/obfuscate.js')

module.exports = {
  endpoint: '/obfuscate/',
  post: async (req, res) => {
    // validate request
    try {
      ow(req.body, ow.object.exactShape({
        code: ow.string
      }))
    } catch (err) {
      return res.status(400).send({ message: err.message.replaceAll('`', '\'').replace('object \'req.body\'', 'body') })
    }

    try {
      luaparse.parse(req.body.code)
    } catch (e) {
      return res.status(400).send({ message: `Expected '${req.body.code}' to be lua code` })
    }

    const obfuscated = await obfuscate(req.body.code)

    res.send(obfuscated)
  }
}
