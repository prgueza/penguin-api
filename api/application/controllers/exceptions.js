const bcrypt = require('bcrypt')

/* DATA MODELS */
const Exception = require('../models/exception.js')

/* GET ALL */
exports.exceptionsReadAll = async (req, res) => {
  try {
    const exceptions = await Exception.find().exec()
    res.status(200).json(exceptions)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* GET ONE */
exports.exceptionsReadOne = async (req, res) => {
  try {
    const { id } = req.params
    const exception = await Exception.findById(id).exec()
    if (!exception) throw new Error({ code: 404 })
    res.status(200).json(exception)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* CREATE EXCEPTION */
exports.exceptionCreate = async (req, res) => {
  try {
    const { prefix, code } = req.body
    const existingException = await Exception.findOne({ $and: [{ prefix }, { code }] })
    if (existingException) throw new Error('exception already exists')
    const exception = new Exception(req.body)
    const resource = await exception.save()
    res.status(201).json({
      exception,
      success: true,
      action: 'create'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* UPDATE EXCEPTION */
exports.exceptionUpdate = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await Exception.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    res.status(200).json({
      resource,
      success: true,
      action: 'update'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}

/* DELETE EXCEPTION */
exports.exceptionDelete = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await Exception.findByIdAndDelete(id)
    res.status(200).json({
      resource,
      success: true,
      action: 'delete'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error })
  }
}
