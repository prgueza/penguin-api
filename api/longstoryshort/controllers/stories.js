const bcrypt = require('bcrypt')

/* DATA MODELS */
const Story = require('../models/story.js')

/* GET ALL */
exports.storiesReadAll = async (req, res) => {
  try {
    const stories = await Story.find().exec()
    res.status(200).json(stories)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* GET ONE */
exports.storiesReadOne = async (req, res) => {
  try {
    const { id } = req.params
    const story = await Story.findById(id).exec()
    if (!story) throw new Error({ code: 404 })
    res.status(200).json(story)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* CREATE EXCEPTION */
exports.storyCreate = async (req, res) => {
  try {
    const { prefix, code } = req.body
    const existingStory = await Story.findOne({ $and: [{ prefix }, { code }] })
    if (existingStory) throw new Error('story already exists')
    const story = new Story(req.body)
    const resource = await story.save()
    res.status(201).json({
      story,
      success: true,
      action: 'create'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* UPDATE EXCEPTION */
exports.storyUpdate = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await Story.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    res.status(200).json({
      resource,
      success: true,
      action: 'update'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}

/* DELETE EXCEPTION */
exports.storyDelete = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await Story.findByIdAndDelete(id)
    res.status(200).json({
      resource,
      success: true,
      action: 'delete'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}
