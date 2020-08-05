const express = require('express')
const router = express.Router()

/* CONTROLLER */
const AppsController = require('../controllers/apps.js')

/* API GET */
router.get('/', AppsController.appsReadAll)
router.get('/:id', AppsController.appsReadOne)
/* API POST */
router.post('/', AppsController.appCreate)
/* API UPDATE */
router.put('/:id', AppsController.appUpdate)
/* API DELETE */
router.delete('/:id', AppsController.appDelete)

module.exports = { endpoint: '/apps', router }
