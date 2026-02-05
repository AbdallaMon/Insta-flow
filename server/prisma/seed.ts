import {
  PrismaClient,
  UserType,
  UserStatus,
} from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

import prisma from "./index.js";
async function main() {
  // Default admin credentials
  const defaultEmail = "abdotlos60@gmail.com";
  const defaultPassword = "01127943935ASDf";
  const BCRYPT_ROUNDS = 12;

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: defaultEmail },
  });

  if (existingAdmin) {
    console.log("✅ Admin user already exists:");
    console.log(`   Email: ${defaultEmail}`);
    console.log(`   Password: ${defaultPassword}`);
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(defaultPassword, BCRYPT_ROUNDS);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: defaultEmail,
      passwordHash: passwordHash,
      name: "Super Administrator",
      type: UserType.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("✅ Default admin user created successfully!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`   Email:    ${defaultEmail}`);
  console.log(`   Password: ${defaultPassword}`);
  console.log(`   ID:       ${admin.id}`);
  console.log(`   Type:     ${admin.type}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("⚠️  Please change the password after first login!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
