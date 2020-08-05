const express = require('express')
const router = express.Router()

/* CONTROLLER */
const RecipesController = require('../controllers/recipes.js')

/* API GET */
router.get('/', RecipesController.recipesReadAll)
// router.get('/:id', RecipesController.usersReadOne)
//
// /* API POST */
// router.post('/', RecipesController.userCreate)
//
// /* API UPDATE */
// router.put('/:id', RecipesController.userUpdate)
//
// /* API DELETE */
// router.delete('/:id', RecipesController.userDelete)

module.exports = { endpoint: '/recipes', router }
