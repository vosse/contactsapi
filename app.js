const express = require('express')
const app = express()
const cors = require('cors')

// middleware
app.use(cors())
app.use(express.json())

// routes
app.use('/auth', require('./api/routes/users'))
app.use('/contacts', require('./api/routes/contacts'))


port = process.env.PORT || 5000

// run the server
app.listen(port, () => console.log(`Running on port ${port}`))
