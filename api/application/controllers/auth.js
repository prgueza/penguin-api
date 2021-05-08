const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const AuthException = require('../../helpers/exceptions/auth')
const { sendValidationMail, sendRecoveryMail } = require('../../../emails/mail')
const {
    checkValidationCode,
    generateValidationCode,
    checkRecoveryCode,
    generateRecoveryCode,
} = require('../../helpers/verification/codes')

/* DATA MODELS */
const User = require('../models/user.js')

/* AUTH USER */
exports.user = async (req, res) => {
    try {
        const auth = req.auth
        const user = await User.findById(auth._id).exec()
        if (!user) throw new Error({ code: 404 })
        res.status(200).json({ user, loggedIn: true, action: 'user' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* AUTH SIGNUP */
exports.signup = async (req, res) => {
    try {
        const { username, email, password, confirmPassword } = req.body
        const existingUser = await User.findOne({
            $or: [{ username }, { email }],
        })
        if (existingUser) throw await AuthException.init('SU-11')
        if (!password) throw await AuthException.init('SU-30')
        if (password !== confirmPassword)
            throw await AuthException.init('SU-31')
        const hashedPassword = await bcrypt.hash(
            password,
            Number(process.env.BCRYPT_SALT_ROUNDS)
        )
        const newUser = new User({ username, email, password: hashedPassword })
        const user = await newUser.save()
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        })
        const validationCode = generateValidationCode(user)
        sendValidationMail({
            to: user.email,
            username: user.username,
            code: validationCode,
        })
        res.status(201).json({
            user,
            token,
            loggedIn: true,
            action: 'signup',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error })
    }
}

/* AUTH SIGNIN */
exports.signin = async (req, res) => {
    try {
        const { identifier, password } = req.body
        if (!identifier) throw await AuthException.init('SI-10')
        if (!password) throw await AuthException.init('SI-11')
        const user = await User.findOne({
            $or: [{ username: identifier }, { email: identifier }],
        })
        if (!user) throw await AuthException.init('SI-12')
        const authenticated = await bcrypt.compare(password, user.password)
        if (!authenticated) throw await AuthException.init('SI-13')
        const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRATION,
        })
        res.status(200).json({
            user,
            token,
            success: true,
            action: 'signin',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* AUTH SIGNOUT */
exports.validate = async (req, res) => {
    try {
        const { id } = req.params
        const { code } = req.body
        if (!code) throw await AuthException.init('VC-10')
        const user = await User.findOne({ _id: id })
        if (!user) throw await AuthException.init('VC-12')
        if (!checkValidationCode(user, code))
            throw await AuthException.init('VC-11')
        const validatedUser = await User.findByIdAndUpdate(
            { _id: id },
            { $set: { validated: true } },
            { new: true }
        )
        res.status(200).json({
            user: validatedUser,
            success: true,
            action: 'validate',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* AUTH RECOVER */
exports.recover = async (req, res) => {
    try {
        const { email } = req.body
        if (!email) throw await AuthException.init('RC-10')
        const user = await User.findOne({ email })
        if (!user) throw await AuthException.init('RC-11')
        const recoveryCode = generateRecoveryCode(user)
        sendRecoveryMail({
            to: user.email,
            username: user.username,
            code: recoveryCode,
        })
        res.status(200).json({
            success: true,
            action: 'codegen',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* AUTH RECOVER */
exports.reset = async (req, res) => {
    try {
        const { email, password, confirmPassword, code } = req.body
        if (!email) throw await AuthException.init('RC-10')
        if (!password) throw await AuthException.init('RC-12')
        if (password !== confirmPassword)
            throw await AuthException.init('RC-13')
        if (!code) throw await AuthException.init('RC-16')
        const user = await User.findOne({ email })
        if (!checkRecoveryCode(user, code))
            throw await AuthException.init('RC-17')
        const hashedPassword = await bcrypt.hash(
            password,
            Number(process.env.BCRYPT_SALT_ROUNDS)
        )
        const updatedUser = await User.findOneAndUpdate(
            { email },
            { $set: { password: hashedPassword } }
        )
        res.status(200).json({
            user: updatedUser,
            success: true,
            action: 'reset',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}

/* AUTH SIGNOUT */
exports.signout = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            action: 'signout',
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error })
    }
}
