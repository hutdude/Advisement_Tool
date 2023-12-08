const mysql = require('mysql2/promise');

// Create a MySQL pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'mitch',
    password: 'Arthurblake1!',
    database: 'university'
});

// Export the pool for use elsewhere
module.exports = pool;