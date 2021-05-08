const mongoose = require('mongoose')

const LocationSchema = mongoose.Schema(
    {
        name: { type: String, trim: true },
        code: { type: String, required: true },
        collectionId: { type: mongoose.ObjectId },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false,
    }
)

LocationSchema.virtual('url').get(function() {
    return `${process.env.BASE_URL}weather/locations/${this._id}`
})

LocationSchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection
    .useDb('weather')
    .model('location', LocationSchema)
