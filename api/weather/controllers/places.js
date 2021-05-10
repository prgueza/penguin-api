const mongoose = require('mongoose')
const WeatherException = require('../../helpers/exceptions/weather')

/* DATA MODELS */
const Place = require('../models/place.js')

/* GET ALL */
exports.placesReadAll = async (req, res) => {
    try {
        const { collection } = req.query
        const query = collection
            ? { collectionId: mongoose.Types.ObjectId(collection) }
            : {}
        const places = await Place.find(query).exec()
        res.status(200).json(places)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* GET ONE */
exports.placesReadOne = async (req, res) => {
    try {
        const { id } = req.params
        const place = await Place.findById(id).exec()
        if (!place) throw new Error({ code: 404 })
        res.status(200).json(place)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* CREATE EXCEPTION */
exports.placeCreate = async (req, res) => {
    try {
        const { collectionId, code, name, county, countyCode } = req.body
        const existingPlace = await Place.findOne({
            $and: [
                { collectionId: mongoose.Types.ObjectId(collectionId) },
                { code },
            ],
        })
        if (existingPlace) throw await WeatherException.init('WL-10')
        const place = new Place({
            collectionId,
            code,
            name,
            county,
            countyCode,
        })
        await place.save()
        res.status(201).json({
            place,
            success: true,
            action: 'create',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* UPDATE EXCEPTION */
exports.placeUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const resource = await Place.findByIdAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        )
        res.status(200).json({
            resource,
            success: true,
            action: 'update',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* DELETE EXCEPTION */
exports.placeDelete = async (req, res) => {
    try {
        const { id } = req.params
        const resource = await Place.findByIdAndDelete(id)
        res.status(200).json({
            resource,
            success: true,
            action: 'delete',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}
