const { PrismaClient } = require('@prisma/client');

// const opts = process.env.NODE_ENV === 'development' ? {
//   log: ['query', 'info', 'warn', 'error'],
// } : null;

module.exports = new PrismaClient();
