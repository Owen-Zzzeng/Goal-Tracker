import pg from 'pg';
import 'dotenv/config';

const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'goaltracker',
  password: 'goaltracker',
  database: 'goaltracker',
});

console.log('Testing direct PostgreSQL connection...');

client.connect()
  .then(() => {
    console.log('✅ Direct connection successful!');
    return client.query('SELECT 1 as test');
  })
  .then((result) => {
    console.log('✅ Query successful!', result.rows);
    return client.end();
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    process.exit(1);
  });

