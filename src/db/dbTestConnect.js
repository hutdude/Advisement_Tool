const pool = require('./dbConnect'); // Assuming your module is in a file named 'your_pool_module.js'

async function testDatabaseConnection() {
    try {
        // Attempt to get a connection from the pool
        const connection = await pool.getConnection();

        // If successful, release the connection
        connection.release();
        
        console.log('Successfully connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error.code);
        console.error('Error message:', error);
    }
}

testDatabaseConnection();