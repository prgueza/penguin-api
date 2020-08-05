const hashObject = require('object-hash')

function generateCode (hash) {
  return hash.split('').filter(c => !isNaN(c)).slice(2, 6).join('')
}

function generate (user, type) {
  const { email, username, updatedAt } = user
  const hash = hashObject({ email, username, updatedAt, type, secret: process.env.HASH_SECRET })
  const code = `${type}${generateCode(hash)}`
  return code
}

function check (user, code, type) {
  const { email, username, updatedAt } = user
  const hash = hashObject({ email, username, updatedAt, type, secret: process.env.HASH_SECRET })
  const check = `${type}${generateCode(hash)}`
  return check === String(code)
}

function generateValidationCode (user) {
  return generate(user, 'V')
}

function checkValidationCode (user, code) {
  return check(user, code, 'V')
}

function generateRecoveryCode (user) {
  return generate(user, 'R')
}

function checkRecoveryCode (user, code) {
  return check(user, code, 'R')
}

module.exports = { generateValidationCode, checkValidationCode, generateRecoveryCode, checkRecoveryCode }
