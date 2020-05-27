const jwt = require('jsonwebtoken')
require('dotenv').config

const jwtGen = (id) => {
  const payload = {
    user: {
      id: id
    }
  }
  return jwt.sign(payload, process.env.jwt, {expiresIn: 1800})
}
