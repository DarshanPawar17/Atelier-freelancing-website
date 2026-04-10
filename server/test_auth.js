import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function test() {
  try {
    console.log("Testing connection...");
    await prisma.$connect();
    console.log("Connected successfully!");
    
    console.log("Testing create user...");
    const user = await prisma.user.create({
      data: {
        email: `test_${Date.now()}@example.com`,
        password: "password123",
        username: `testuser_${Date.now()}`,
      }
    });
    console.log("User created:", user);
    
    await prisma.user.delete({ where: { id: user.id } });
    console.log("Test user cleaned up.");
  } catch (err) {
    console.error("TEST FAILED:", err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
