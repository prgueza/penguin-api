const mongoose = require('mongoose')

const ExceptionSchema = mongoose.Schema(
    {
        message: { type: String, trim: true },
        api: { type: String, enum: ['application', 'weather'] },
        typology: { type: String, enum: ['auth', 'apps'] },
        prefix: {
            type: String,
            enum: ['SI', 'SU', 'WT', 'VC', 'RC', 'WC', 'WL'],
        },
        code: { type: Number, required: true },
        level: { type: Number, min: 1, max: 5 },
    },
    {
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        id: false,
    }
)

ExceptionSchema.virtual('url').get(function() {
    return `${process.env.BASE_URL}application/exceptions/${this._id}`
})

ExceptionSchema.virtual('errCode').get(function() {
    return `${this.prefix}-${this.code}`
})

ExceptionSchema.set('toJSON', { getters: true, versionKey: false })

module.exports = mongoose.connection
    .useDb('application')
    .model('Exception', ExceptionSchema)
