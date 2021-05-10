const express = require('express')
const router = express.Router()

/* CONTROLLER */
const PlacesController = require('../controllers/places.js')

/* API GET */
router.get('/', PlacesController.placesReadAll)
router.get('/:id', PlacesController.placesReadOne)
//
// /* API POST */
router.post('/', PlacesController.placeCreate)
//
// /* API UPDATE */
router.put('/:id', PlacesController.placeUpdate)
//
// /* API DELETE */
router.delete('/:id', PlacesController.placeDelete)

module.exports = { endpoint: '/places', router }
