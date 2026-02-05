import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Create adapter with connection config
const adapter = new PrismaMariaDb(
  process.env.DATABASE_URL! ||
    "mysql://main:123456789@localhost:3306/instaflow",
);
// Singleton pattern to prevent multiple instances in development
console.log(process.env.DATABASE_URL, "DATABASE_URL");
declare global {
  var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter });
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient({ adapter });
  }
  prisma = global.prisma;
}

export default prisma;
