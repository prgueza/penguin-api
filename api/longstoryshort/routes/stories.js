const express = require('express')
const router = express.Router()

/* CONTROLLER */
const StoriesController = require('../controllers/stories.js')

/* API GET */
router.get('/', StoriesController.storiesReadAll)
router.get('/:id', StoriesController.storiesReadOne)
/* API POST */
router.post('/', StoriesController.storyCreate)
/* API UPDATE */
router.put('/:id', StoriesController.storyUpdate)
/* API DELETE */
router.delete('/:id', StoriesController.storyDelete)

module.exports = { endpoint: '/stories', router }
