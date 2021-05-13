const mongoose = require('mongoose')

const PlaceSchema = mongoose.Schema(
    {
        name: { type: String, trim: true },
        code: { type: String, required: true },
        countycode: { type: String, required: true },
        county: { type: String, required: true },
        collectionId: { type: mongoose.ObjectId },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false,
    }
)

PlaceSchema.virtual('url').get(function() {
    return `${process.env.BASE_URL}weather/places/${this._id}`
})

PlaceSchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection
    .useDb('weather')
    .model('place', PlaceSchema)
