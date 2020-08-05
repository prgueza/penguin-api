const mongoose = require('mongoose')

const RecipeSchema = mongoose.Schema({
  name: { type: String, trim: true },
  ingredients: { type: Array },
  steps: { type: Array }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, id: false })

RecipeSchema.virtual('url').get(function () {
  return `${process.env.BASE_URL}cookbook/recipes/${this._id}`
})

RecipeSchema.virtual('errCode').get(function () {
  return `${this.prefix}-${this.code}`
})

RecipeSchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection.useDb('cookbook').model('recipe', RecipeSchema)
