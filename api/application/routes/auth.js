const express = require('express')
const router = express.Router()
const CheckAuth = require('../../helpers/middleware/check-auth')

/* CONTROLLER */
const AuthControllers = require('../controllers/auth.js')

/* API AUTH */
router.get('/user', CheckAuth, AuthControllers.user)
router.post('/signup', AuthControllers.signup)
router.post('/signin', AuthControllers.signin)
router.post('/signout', CheckAuth, AuthControllers.signout)
router.post('/validate/:id', AuthControllers.validate)
router.post('/recover', AuthControllers.recover)
router.post('/reset', AuthControllers.reset)

module.exports = { endpoint: '/auth', router }
