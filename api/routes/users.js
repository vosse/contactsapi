const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const pool = require('../../db')
const jwtGen = require('../utils/jwtGen')
const auth = require('../middleware/auth')
const vi = require('../middleware/vi')


/*
register
post route
*/

router.post('/signup', async(req, res) => {

  const { name, email, pass } = req.body

  try {
    const user = await pool.query('SELECT * FROM users WHERE user_email = $1', [email])

    if(user.rows.length != 0) {
      return res.status(401).json('User already exists')
    }

    const salt = await bcrypt.genSalt(10)

    const bcPassword = await bcrypt.hash(pass, salt)

    console.log(bcPassword)

    let newUser = await pool.query('INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *',
     [name, email, bcPassword])

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

    if(user.rows.length === 0) {
      return res.status(401).json('Something seems to be wrong')
    }

    //console.log(user.rows[0].user_password)
    const validPass = await bcrypt.compare(pass, user.rows[0].user_password)

    if(!validPass) {
      return res.status(401).json('Invalid pass')
      console.log('success')
    }

    const jwtToken = jwtGen(user.rows[0].user_id)

    return res.json({ jwtToken })

    console.log('test')

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
