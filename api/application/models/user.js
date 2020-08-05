const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
  name: { type: String, required: false, trim: true },
  username: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  password: { type: String, required: true },
  admin: { type: Boolean, default: false },
  validated: { type: Boolean, default: false }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }, id: false })

UserSchema.virtual('url').get(function () {
  return `${process.env.BASE_URL}application/users/${this._id}`
})

UserSchema.set('toJSON', { getters: true, versionKey: false, transform: (doc, { password, ...user }) => user })

module.exports = mongoose.connection.useDb('application').model('User', UserSchema)
