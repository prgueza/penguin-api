const bcrypt = require('bcrypt')

/* DATA MODELS */
const Recipe = require('../models/recipe.js')

/* GET ALL */
exports.recipesReadAll = async (req, res) => {
  try {
    const recipes = await Recipe.find().exec()
    res.status(200).json(recipes)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* GET ONE */
exports.recipesReadOne = async (req, res) => {
  try {
    const { id } = req.params
    const recipe = await Recipe.findById(id).exec()
    if (!recipe) throw new Error({ code: 404 })
    res.status(200).json(recipe)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* CREATE EXCEPTION */
exports.recipeCreate = async (req, res) => {
  try {
    const { prefix, code } = req.body
    const existingRecipe = await Recipe.findOne({ $and: [{ prefix }, { code }] })
    if (existingRecipe) throw new Error('recipe already exists')
    const recipe = new Recipe(req.body)
    const resource = await recipe.save()
    res.status(201).json({
      recipe,
      success: true,
      action: 'create'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* UPDATE EXCEPTION */
exports.recipeUpdate = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await Recipe.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
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
exports.recipeDelete = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await Recipe.findByIdAndDelete(id)
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
