import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("password123", 12);

  // 1. Admin User
  const admin = await prisma.user.upsert({
    where: { email: "admin@pukistore.com" },
    update: {},
    create: {
      name: "Admin Puki Store",
      email: "admin@pukistore.com",
      hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  // 2. Seller User & Store
  const seller = await prisma.user.upsert({
    where: { email: "seller@pukistore.com" },
    update: {},
    create: {
      name: "Digital Corner Store",
      email: "seller@pukistore.com",
      hashedPassword,
      role: "SELLER",
      emailVerified: new Date(),
      store: {
        create: {
          name: "Digital Corner",
          slug: "digital-corner",
          description: "Toko produk digital terpercaya, respon cepat 24/7.",
          isVerified: true,
        },
      },
    },
  });

  // 3. Client User
  const client = await prisma.user.upsert({
    where: { email: "client@pukistore.com" },
    update: {},
    create: {
      name: "Pembeli Setia",
      email: "client@pukistore.com",
      hashedPassword,
      role: "CLIENT",
      emailVerified: new Date(),
    },
  });

  console.log("Seeding complete:");
  console.log("Admin:", admin.email);
  console.log("Seller:", seller.email);
  console.log("Client:", client.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
