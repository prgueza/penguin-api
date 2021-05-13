const mongoose = require('mongoose')
const WeatherException = require('../../helpers/exceptions/weather')
/* DATA MODELS */
const Collection = require('../models/collection.js')
const Place = require('../models/place.js')

/* GET ALL */
exports.collectionsReadAll = async (req, res) => {
    try {
        const { _id: userId } = req.auth
        const collections = await Collection.aggregate([
            {
                $match: {
                    userId: mongoose.Types.ObjectId(userId),
                },
            },
            { $sort: { order: 1 } },
            {
                $lookup: {
                    from: 'places',
                    localField: '_id',
                    foreignField: 'collectionId',
                    as: 'places',
                },
            },
        ])
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

/* CREATE COLLECTION */
exports.collectionCreate = async (req, res) => {
    try {
        const { name, icon, places, order } = req.body
        const { _id } = req.auth
        const existingCollection = await Collection.findOne({
            $and: [{ name }, { userId: mongoose.Types.ObjectId(_id) }],
        })
        if (existingCollection) throw await WeatherException.init('WC-10')
        const collection = new Collection({ name, icon, userId: _id, order })
        await collection.save()
        const savedPlaces = []
        if (places && places.length) {
            for (const place of places) {
                try {
                    const { name, county, code, countycode } = place
                    const placeDoc = new Place({
                        name,
                        code,
                        county,
                        countycode,
                        collectionId: collection._id,
                    })
                    await placeDoc.save()
                    savedPlaces.push(placeDoc)
                } catch (error) {
                    console.error(error)
                }
            }
        }
        res.status(201).json({
            collection: {
                ...collection.toJSON(),
                places: savedPlaces.map(place => place.toJSON()),
            },
            success: true,
            action: 'create',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* UPDATE COLLECTION */
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

/* UPDATE COLLECTION */
exports.collectionUpdateMany = async (req, res) => {
    try {
        const { collections } = req.body
        await Promise.all(
            collections.map(({ _id, order }) =>
                Collection.findByIdAndUpdate(
                    { _id: _id },
                    { $set: { order } },
                    { new: true }
                )
            )
        )
        res.status(200).json({
            success: true,
            action: 'update',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* DELETE COLLECTION */
exports.collectionDelete = async (req, res) => {
    try {
        const { id } = req.params
        const relatedPlaces = await Place.find({
            collectionId: mongoose.Types.ObjectId(id),
        })
        const deletedPlaces = []
        const collection = await Collection.findByIdAndDelete(id)
        for (const place of relatedPlaces) {
            try {
                const deletedPlace = await Collection.findByIdAndDelete(
                    place._id
                )
                deletedPlaces.push(deletedPlace)
            } catch (error) {
                console.error(error)
            }
        }
        res.status(200).json({
            collection,
            nDeletedPlaces: deletedPlaces.length,
            success: true,
            action: 'delete',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}
