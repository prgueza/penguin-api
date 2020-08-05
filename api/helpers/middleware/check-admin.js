const jwt = require('jsonwebtoken')
const AuthException = require('../exceptions/auth')

async function CheckAdmin (req, res, next) {
  try {
    if (!req.auth.admin) throw await AuthException.init('WT-13')
    next()
  } catch (error) {
    return res.status(401).json({ error })
  }
}

module.exports = CheckAdmin
