const Email = require('email-templates')
const path = require('path')
const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ACC,
    pass: process.env.MAIL_PWD
  }
})

const email = new Email({
  message: { from: process.env.MAIL_ACC },
  send: true,
  transport: transporter,
  juice: true,
  juiceResources: {
    preserveImportant: true,
    webResources: {
      relativeTo: path.resolve('emails', 'assets')
    }
  }
})

function sendValidationMail ({ to, username, code }) {
  email.send({
    template: 'validate',
    message: { to },
    locals: { username, code }
  })
}

function sendRecoveryMail ({ to, username, code }) {
  email.send({
    template: 'recover',
    message: { to },
    locals: { username, code }
  })
}

module.exports = { sendValidationMail, sendRecoveryMail }
