const mongoose = require('mongoose')
const WeatherException = require('../../helpers/exceptions/weather')
/* DATA MODELS */
const Collection = require('../models/collection.js')

/* GET ALL */
exports.collectionsReadAll = async (req, res) => {
    try {
        const { user } = req.query
        console.log(user)
        const query = user ? { userId: mongoose.Types.ObjectId(user) } : {}
        const collections = await Collection.find(query).exec()
        res.status(200).json(collections)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* GET ONE */
exports.collectionsReadOne = async (req, res) => {
    try {
        const { id } = req.params
        const collection = await Collection.findById(id).exec()
        if (!collection) throw new Error({ code: 404 })
        res.status(200).json(collection)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* CREATE EXCEPTION */
exports.collectionCreate = async (req, res) => {
    try {
        const { name } = req.body
        const { _id } = req.auth
        const existingCollection = await Collection.findOne({
            $and: [{ name }, { userId: mongoose.Types.ObjectId(_id) }],
        })
        if (existingCollection) throw await WeatherException.init('WC-10')
        const collection = new Collection({ name, userId: _id })
        await collection.save()
        res.status(201).json({
            collection,
            success: true,
            action: 'create',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* UPDATE EXCEPTION */
exports.collectionUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const resource = await Collection.findByIdAndUpdate(
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
exports.collectionDelete = async (req, res) => {
    try {
        const { id } = req.params
        const resource = await Collection.findByIdAndDelete(id)
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
