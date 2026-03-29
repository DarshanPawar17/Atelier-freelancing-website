const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.gig.findMany({ orderBy: { id: 'desc' }, take: 2 }).then(res => {
  console.log('GIGS:', JSON.stringify(res, null, 2));
}).catch(console.error).finally(() => prisma.$disconnect());
