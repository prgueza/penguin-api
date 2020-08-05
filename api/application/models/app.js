const mongoose = require('mongoose')

const AppSchema = mongoose.Schema({
  name: { type: String, required: false, trim: true },
  description: { type: String, required: false, trim: true },
  icon: { type: String, required: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, id: false })

AppSchema.virtual('url').get(function () {
  return `${process.env.BASE_URL}application/apps/${this._id}`
})

AppSchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection.useDb('application').model('App', AppSchema)
