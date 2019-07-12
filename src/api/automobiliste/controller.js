const { isAutomobiliste, authenticated } = require('../../services/acl')
const { internalError } = require('../../services/http')

exports.readMe = [
  isAutomobiliste,
  authenticated,
  async (req, res) => {
    await req.user.findCommands()
    res.json(req.user)
  }
]

exports.update = [
  isAutomobiliste,
  authenticated,
  async ({ user, body }, res, next) => {
    try {
      delete body.email
      delete body.providers
      delete body.tokens
      user.set(body)
      if (body.token) {
        const token = user.tokens.find(
          t => body.token == t
        )
        if (!token) {
          user.tokens.push(body.token)
        }
      }
      await user.save()
      res.json({
        success: true,
        ok: true,
        n: 1
      })
      next()
    } catch (error) {
      internalError(res, error)
    }
  }
]
