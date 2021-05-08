/* DATA MODELS */
const App = require('../models/app.js')

/* GET ALL */
exports.appsReadAll = async (_, res) => {
    try {
        const apps = await App.find().exec()
        res.status(200).json(apps)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* GET ONE */
exports.appsReadOne = async (req, res) => {
    try {
        const { id } = req.params
        const app = await App.findById(id).exec()
        if (!app) throw new Error({ code: 404 })
        res.status(200).json(app)
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* CREATE APP */
exports.appCreate = async (req, res) => {
    try {
        const { name } = req.body
        const existingApp = await App.findOne({ name })
        if (existingApp) throw new Error('app already exists')
        const app = new App(req.body)
        await app.save()
        res.status(201).json({
            app,
            success: true,
            action: 'create',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* UPDATE APP */
exports.appUpdate = async (req, res) => {
    try {
        const { id } = req.params
        const app = await App.findByIdAndUpdate(
            { _id: id },
            { $set: req.body },
            { new: true }
        )
        res.status(200).json({
            app,
            success: true,
            action: 'update',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* DELETE App */
exports.appDelete = async (req, res) => {
    try {
        const { id } = req.params
        const app = await App.findByIdAndDelete(id)
        res.status(200).json({
            app,
            success: true,
            action: 'delete',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}
