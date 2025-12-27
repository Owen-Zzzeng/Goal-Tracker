import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import pg from 'pg';

const { Client } = pg;

// Try to connect with postgres superuser to create the database
async function setupDatabase() {
    console.log('Attempting to set up database...\n');

    // Common default credentials to try
    const credentials = [
        { user: 'postgres', password: 'postgres', host: '127.0.0.1', port: 5432 },
        { user: 'postgres', password: '', host: '127.0.0.1', port: 5432 },
        { user: process.env.USER || 'postgres', password: '', host: '127.0.0.1', port: 5432 },
    ];

    let client = null;
    let connected = false;

    for (const creds of credentials) {
        try {
            console.log(`Trying to connect with user: ${creds.user}...`);
            client = new Client({
                user: creds.user,
                password: creds.password,
                host: creds.host,
                port: creds.port,
                database: 'postgres', // Connect to default postgres database
            });

            await client.connect();
            console.log(`✅ Connected with user: ${creds.user}\n`);
            connected = true;
            break;
        } catch (error) {
            console.log(`❌ Failed: ${error.message}\n`);
            if (client) {
                await client.end();
            }
        }
    }

    if (!connected) {
        console.error('❌ Could not connect to PostgreSQL with any default credentials.');
        console.error('\nPlease either:');
        console.error('1. Start Docker Desktop and run: docker compose up -d');
        console.error('2. Or manually create the database with:');
        console.error('   CREATE USER goaltracker WITH PASSWORD \'goaltracker\';');
        console.error('   CREATE DATABASE goaltracker OWNER goaltracker;');
        process.exit(1);
    }

    try {
        // Check if user exists
        const userCheck = await client.query(
            "SELECT 1 FROM pg_user WHERE usename = 'goaltracker'"
        );

        if (userCheck.rows.length === 0) {
            console.log('Creating user goaltracker...');
            await client.query("CREATE USER goaltracker WITH PASSWORD 'goaltracker';");
            console.log('✅ User created\n');
        } else {
            console.log('✅ User goaltracker already exists\n');
        }

        // Check if database exists
        const dbCheck = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = 'goaltracker'"
        );

        if (dbCheck.rows.length === 0) {
            console.log('Creating database goaltracker...');
            await client.query('CREATE DATABASE goaltracker OWNER goaltracker;');
            console.log('✅ Database created\n');
        } else {
            console.log('✅ Database goaltracker already exists\n');
        }

        // Grant privileges
        console.log('Granting privileges...');
        await client.query('GRANT ALL PRIVILEGES ON DATABASE goaltracker TO goaltracker;');
        console.log('✅ Privileges granted\n');

        await client.end();

        // Now test with Prisma
        console.log('Testing connection with Prisma...');
        const prisma = new PrismaClient();
        await prisma.$queryRaw`SELECT 1 as test`;
        await prisma.$disconnect();
        console.log('✅ Prisma connection successful!\n');

        console.log('🎉 Database setup complete! You can now run the application.');
    } catch (error) {
        console.error('❌ Error during setup:', error.message);
        if (client) {
            await client.end();
        }
        process.exit(1);
    }
}

setupDatabase();

