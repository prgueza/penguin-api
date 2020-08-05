const express = require('express')
const router = express.Router()

/* CONTROLLER */
const ExceptionsController = require('../controllers/exceptions.js')

/* API GET */
router.get('/', ExceptionsController.exceptionsReadAll)
router.get('/:id', ExceptionsController.exceptionsReadOne)
/* API POST */
router.post('/', ExceptionsController.exceptionCreate)
/* API UPDATE */
router.put('/:id', ExceptionsController.exceptionUpdate)
/* API DELETE */
router.delete('/:id', ExceptionsController.exceptionDelete)

module.exports = { endpoint: '/exceptions', router }
