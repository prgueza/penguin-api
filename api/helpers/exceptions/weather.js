/* EXCEPTION MODEL */
const Exception = require('../../application/models/exception')

class WeatherException extends Error {
    constructor(exception) {
        super()
        this.message = exception.message || 'Unexpected error'
        this.api = exception.api
        this.typology = exception.typology
        this.errCode = exception.errCode
    }

    static async init(errCode) {
        const [prefix, code] = errCode.split('-')
        const exception = await Exception.findOne({
            $and: [{ prefix }, { code }],
        })
        return new WeatherException(exception)
    }
}

module.exports = WeatherException
