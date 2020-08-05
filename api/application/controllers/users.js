const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const AuthException = require('../../helpers/exceptions/auth')

/* DATA MODELS */
const User = require('../models/user.js')

/* GET ALL */
exports.usersReadAll = async (req, res) => {
  try {
    const users = await User.find().exec()
    res.status(200).json(users)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* GET ONE */
exports.usersReadOne = async (req, res) => {
  try {
    const { id } = req.params
    const user = await User.findById(id).select(UserProjection).exec()
    if (!user) throw new Error({ code: 404 })
    res.status(200).json(user)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* CREATE USER */
exports.userCreate = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body
    const existingUser = await User.findOne({ $or: [{ username }, { email }] })
    if (existingUser) throw new AuthException(1)
    if (!password) throw new AuthException(10)
    if (password !== confirmPassword) throw new AuthException(11)
    const SALT = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT_ROUNDS))
    const hashed_pwd = await bcrypt.hash(password, SALT)
    const user = new User({ username, email, password: hashed_pwd })
    const resource = await user.save()
    res.status(201).json({
      resource,
      success: true,
      action: 'create'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* UPDATE USER */
exports.userUpdate = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await User.findByIdAndUpdate({ _id: id }, { $set: req.body }, { new: true })
    res.status(200).json({
      resource,
      success: true,
      action: 'update'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}

/* DELETE USER */
exports.userDelete = async (req, res) => {
  try {
    const { id } = req.params
    const resource = await User.findByIdAndDelete(id)
    res.status(200).json({
      resource,
      success: true,
      action: 'delete'
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error })
  }
}
