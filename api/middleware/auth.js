const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req, res, next) => {
  // try to get token from header
  const token = req.header('jwt_token')

  // if theres no token
  if(!token) {
    return res.status(403)
  }

  // verify token
  try {
    const verify = jwt.verify(token, process.env.jwt)

    req.user = verify.user
    next()
  } catch (err) {
    res.status(401)
  }
}

module.exports = auth
