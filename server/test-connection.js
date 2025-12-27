import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Testing database connection...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');

prisma.$queryRaw`SELECT 1 as test`
  .then((result) => {
    console.log('✅ Connection successful!', result);
    return prisma.$disconnect();
  })
  .catch((error) => {
    console.error('❌ Connection failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Error details:', error);
    return prisma.$disconnect().then(() => process.exit(1));
  });

