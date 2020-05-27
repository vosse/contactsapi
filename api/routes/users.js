const express = require('express')
const router = express.Router()
const bc = require('bcrypt')
const pool = require('../../db')
const jwtGen = require('../utils/jwtGen')
const auth = require('../middleware/auth')

/*
register
post route
*/
router.post('/register', async(req, res) => {

  const { name, email, pass } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

    if(user.rows.length != 0) {
      return res.status(401).json('User already exists')
    }

    const salt = await bc.genSalt(10)

    const bcPass = await bc.hash(pass, salt)
    let newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *', [name, email, bcPass])

    const jwtToken = jwtGen(newUser.rows[0].user_id)

    return res.json({ jwtToken })

  } catch (err) {
    console.error(err.message)
    res.status(500)
  }
})


/*
login
post route
*/
router.post('/login', async(req, res) => {
  const { email, pass } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

    if(user.rows.length != 1) {
      return res.status(401).json('Something seems to be wrong')
    }

    const validPass = await bc.compare(pass, user.rows[0].user_password)

    if(!validPass) {
      return res.status(401).json('Invalid pass')
    }

    const jwtToken = jwtGen(user.rows[0].user_id)

    return res.json({ jwtToken })

  } catch (err) {
    console.error(err.message)
    res.status(500)
  }
})


/*
verify/auth
post route
*/
router.post('/verify', auth, async(req, res) => {
  try {
    res.json(true)
  } catch (err) {
    console.error(err.message)
    res.status(500)
  }
})


module.exports = router
