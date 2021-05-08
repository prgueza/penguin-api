const express = require('express')
const router = express.Router()

/* CONTROLLER */
const LocationsController = require('../controllers/locations.js')

/* API GET */
router.get('/', LocationsController.locationsReadAll)
router.get('/:id', LocationsController.locationsReadOne)
//
// /* API POST */
router.post('/', LocationsController.locationCreate)
//
// /* API UPDATE */
router.put('/:id', LocationsController.locationUpdate)
//
// /* API DELETE */
router.delete('/:id', LocationsController.locationDelete)

module.exports = { endpoint: '/locations', router }
