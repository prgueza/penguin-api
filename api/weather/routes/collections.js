const CheckAuth = require('../../helpers/middleware/check-auth')
const express = require('express')
const router = express.Router()

/* CONTROLLER */
const CollectionsController = require('../controllers/collections.js')

/* API GET */
router.get('/', CheckAuth, CollectionsController.collectionsReadAll)
router.get('/:id', CheckAuth, CollectionsController.collectionsReadOne)
//
// /* API POST */
router.post('/', CheckAuth, CollectionsController.collectionCreate)
//
// /* API UPDATE */
router.put('/', CheckAuth, CollectionsController.collectionUpdateMany)
router.put('/:id', CheckAuth, CollectionsController.collectionUpdate)
//
// /* API DELETE */
router.delete('/:id', CheckAuth, CollectionsController.collectionDelete)

module.exports = { endpoint: '/collections', router }
