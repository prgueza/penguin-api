const usersRoutes = require('./routes/users.js')
const authRoutes = require('./routes/auth.js')
const exceptionsRoutes = require('./routes/exceptions.js')
const appsRoutes = require('./routes/apps.js')

module.exports = [usersRoutes, authRoutes, exceptionsRoutes, appsRoutes]
