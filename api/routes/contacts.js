const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const pool = require('../../db')


/*
get all contacts
get route
*/

router.get('/test', auth, async(req, res) => {
  try {
    console.log('test')
    res.status(200).json('Test')
  } catch (err) {
    console.error(err.message)
    console.log('test')
    res.status(500).json('Server Error')
  }
})

router.get('/', auth, async (req, res) => {
  try {
    const user = await pool.query(
      'SELECT u.user_name, c.contact_id, c.contact_first_name, c.contact_last_name, c.contact_email, c.contact_favorite, c.contact_number FROM users AS u LEFT JOIN contacts AS c ON u.user_id = c.user_id WHERE u.user_id = $1', [req.user.id]
    )
    if(user.rows) {
      res.json(user.rows)
    }
    else {
      res.json(`You don't have any contacts`);
    }

  } catch (err) {
    console.error(err.message)
    res.status(500)
  }
})


/*
create new contact
post route
*/

router.post('/new', auth, async (req, res) => {
  try {
    console.log(req.body)

    let { first_name, last_name, email, number } = req.body
    number = `+${number}`
    const newContact = await pool.query(
      'INSERT INTO contacts (user_id, contact_first_name, contact_last_name, contact_email, contact_number) VALUES ($1, $2, $3, $4, $5) RETURNING *', [req.user.id, first_name, last_name, email, number]
    )
    res.json(newContact.rows[0])
  } catch (err) {
    console.error(err.message)
    res.status(500)
  }
})


/*
update existing contact
put route
*/

router.put('/update/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const { first_name, last_name, email, number, favorite } = req.body
    const updateContact = pool.query(
      'UPDATE contacts SET contact_first_name = $1, contact_last_name = $2, contact_email = $3, contact_number = $4, contact_favorite = $5 WHERE contact_id = $6 and user_id = $7 RETURNING *',
      [first_name, last_name, email, number, favorite, id, req.user.id]
    )
    if(updateContact.rows.length === 0) {
      return res.json('Nothing to update')
    }
  } catch (err) {
    console.error(err.message)
    res.status(500)
  }
})


/*
delete a contact
delete route
*/

router.delete('/delete/:id', auth, async(req, res) => {
  try {
    const { id } = req.params
    const deleteContact = await query.pool(
      'DELETE FROM contacts WHERE contact_id = $1 AND user_id = $2 RETURNING *', [id, req.user.id]
    )
    if(deleteContact.rows.length === 0) {
      res.json('Unauthorized')
    }
  } catch (err) {
    console.error(err.message)
  }
})


module.exports = router
