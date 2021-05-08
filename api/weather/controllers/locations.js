const mongoose = require('mongoose')
const WeatherException = require('../../helpers/exceptions/weather')

/* DATA MODELS */
const Location = require('../models/location.js')

/* GET ALL */
exports.locationsReadAll = async (req, res) => {
    try {
        const { collection } = req.query
        const query = collection
            ? { collectionId: mongoose.Types.ObjectId(collection) }
            : {}
        const locations = await Location.find(query).exec()
        res.status(200).json(locations)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* GET ONE */
exports.locationsReadOne = async (req, res) => {
    try {
        const { id } = req.params
        const location = await Location.findById(id).exec()
        if (!location) throw new Error({ code: 404 })
        res.status(200).json(location)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* CREATE EXCEPTION */
exports.locationCreate = async (req, res) => {
    try {
        const { collectionId, code, name } = req.body
        const existingLocation = await Location.findOne({
            $and: [
                { collectionId: mongoose.Types.ObjectId(collectionId) },
                { code },
            ],
        })
        if (existingLocation) throw await WeatherException.init('WL-10')
        const location = new Location({ collectionId, code, name })
        await location.save()
        res.status(201).json({
            location,
            success: true,
            action: 'create',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* UPDATE EXCEPTION */
exports.locationUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const resource = await Location.findByIdAndUpdate(
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
exports.locationDelete = async (req, res) => {
    try {
        const { id } = req.params
        const resource = await Location.findByIdAndDelete(id)
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
