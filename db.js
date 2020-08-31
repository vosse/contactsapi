const Pool = require('pg').Pool

// INSERT YOUR CONN INFO HERE

const pool = new Pool({
  user: 'vosse', // {username}
  password: 'voda22', // {password}
  host: 'localhost',
  port: 5432,
  database: 'contactsdb' // {dbname}
})

module.exports = pool



// You are connected to database "contactsdb" as user "vosse" via socket in "/var/run/postgresql" at port "5432".
