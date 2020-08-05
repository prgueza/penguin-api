const jwt = require('jsonwebtoken')
const AuthException = require('../exceptions/auth')

async function CheckAuth (req, res, next) {
  try {
    const { authorization } = req.headers || {}
    if (!authorization) throw await AuthException.init('WT-10')
    const token = authorization.split(' ')[1]
    if (!token) throw await AuthException.init('WT-11')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.auth = decoded
    next()
  } catch (error) {
    return res.status(401).json({ error })
  }
}

module.exports = CheckAuth
