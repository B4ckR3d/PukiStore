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
    include: { store: true },
  });

  // Fetch store
  const store = seller.store || (await prisma.store.findUnique({ where: { slug: "digital-corner" } }));

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

  // 4. Categories
  const catVoucher = await prisma.category.upsert({
    where: { slug: "voucher" },
    update: {},
    create: { name: "Voucher & Kode", slug: "voucher" },
  });

  const catTopup = await prisma.category.upsert({
    where: { slug: "topup" },
    update: {},
    create: { name: "Top Up Game", slug: "topup" },
  });

  const catEsim = await prisma.category.upsert({
    where: { slug: "esim" },
    update: {},
    create: { name: "eSIM Data", slug: "esim" },
  });

  const catSubscription = await prisma.category.upsert({
    where: { slug: "subscription" },
    update: {},
    create: { name: "Langganan", slug: "subscription" },
  });

  // 5. Sample Products
  if (store) {
    const productsData = [
      {
        name: "Voucher Google Play Rp 50.000",
        slug: "voucher-google-play-50k",
        price: 49000,
        comparePrice: 50000,
        type: "CODE" as const,
        stock: 25,
        sold: 142,
        categoryId: catVoucher.id,
        isActive: true,
      },
      {
        name: "Top Up Diamond Mobile Legends 86",
        slug: "topup-ml-86-diamond",
        price: 22000,
        comparePrice: 25000,
        type: "TOPUP" as const,
        stock: 100,
        sold: 320,
        categoryId: catTopup.id,
        isActive: true,
      },
      {
        name: "eSIM Telkomsel 10GB 30 Hari",
        slug: "esim-telkomsel-10gb",
        price: 75000,
        comparePrice: 85000,
        type: "ESIM" as const,
        stock: 15,
        sold: 58,
        categoryId: catEsim.id,
        isActive: true,
      },
      {
        name: "Netflix Premium 1 Bulan",
        slug: "netflix-premium-1-bulan",
        price: 45000,
        comparePrice: 54000,
        type: "SUBSCRIPTION" as const,
        stock: 50,
        sold: 210,
        categoryId: catSubscription.id,
        isActive: true,
      },
      {
        name: "Voucher Steam Wallet IDR 60.000",
        slug: "voucher-steam-60k",
        price: 58000,
        comparePrice: 60000,
        type: "CODE" as const,
        stock: 30,
        sold: 87,
        categoryId: catVoucher.id,
        isActive: true,
      },
      {
        name: "Voucher Spotify Premium 1 Bulan (Stok Habis)",
        slug: "spotify-premium-1-bulan-habis",
        price: 35000,
        comparePrice: 40000,
        type: "SUBSCRIPTION" as const,
        stock: 0, // OUT OF STOCK test case
        sold: 99,
        categoryId: catSubscription.id,
        isActive: true,
      },
    ];

    for (const prod of productsData) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          price: prod.price,
          stock: prod.stock,
          isActive: prod.isActive,
        },
        create: {
          ...prod,
          storeId: store.id,
        },
      });
    }
  }

  console.log("Seeding complete!");
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
