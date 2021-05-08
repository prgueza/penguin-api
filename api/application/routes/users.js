const express = require('express')
const router = express.Router()

/* CONTROLLER */
const UsersController = require('../controllers/users.js')

/* API GET */
router.get('/', UsersController.usersReadAll)
router.get('/:id', UsersController.usersReadOne)

/* API POST */
router.post('/', UsersController.userCreate)

/* API UPDATE */
router.put('/:id', UsersController.userUpdate)

/* API DELETE */
router.delete('/:id', UsersController.userDelete)

module.exports = { endpoint: '/users', router }
