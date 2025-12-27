import 'dotenv/config';
import pg from 'pg';

const { Client } = pg;

const client = new Client({
    connectionString: process.env.DATABASE_URL || 'postgresql://goaltracker:goaltracker@127.0.0.1:5432/goaltracker'
});

console.log('Testing direct PostgreSQL connection...');
console.log('Connection string:', process.env.DATABASE_URL ? 'From .env' : 'Using default');

client.connect()
    .then(() => {
        console.log('✅ Connected successfully!');
        return client.query('SELECT current_database(), current_user');
    })
    .then((result) => {
        console.log('Database:', result.rows[0].current_database);
        console.log('User:', result.rows[0].current_user);
        return client.end();
    })
    .catch((error) => {
        console.error('❌ Connection failed:', error.message);
        console.error('Error code:', error.code);
        process.exit(1);
    });

