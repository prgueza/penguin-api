const mongoose = require('mongoose')

const CollectionSchema = mongoose.Schema(
    {
        name: { type: String, trim: true },
        userId: { type: mongoose.ObjectId },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false,
    }
)

CollectionSchema.virtual('url').get(function() {
    return `${process.env.BASE_URL}weather/collections/${this._id}`
})

CollectionSchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection
    .useDb('weather')
    .model('collection', CollectionSchema)
