const mongoose = require('mongoose')
const strip = require('striptags')

const StorySchema = mongoose.Schema({
  title: { type: String, trim: true },
  author: { type: String, trim: true },
  published: { type: Boolean, default: false },
  text: { type: String, trim: true }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, id: false })

StorySchema.virtual('url').get(function () {
  return `${process.env.BASE_URL}longstoryshort/stories/${this._id}`
})

StorySchema.virtual('abstract').get(function () {
  return strip(this.text).substr(0, 100)
})

StorySchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection.useDb('long-story-short').model('story', StorySchema)
