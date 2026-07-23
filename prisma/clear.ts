import { PrismaClient } from "@prisma/client";
import * as readline from "readline";
import * as dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const LOCAL_HOST_PATTERNS = ["localhost", "127.0.0.1", "::1"];

function isLocalDatabaseUrl(url: string | undefined): boolean {
  if (!url) return false;
  return LOCAL_HOST_PATTERNS.some((pattern) => url.includes(pattern));
}

function maskDatabaseUrl(url: string): string {
  return url.replace(/(mongodb(?:\+srv)?:\/\/)([^:]+):([^@]+)@/i, "$1$2:****@");
}

async function promptConfirmation(databaseUrl: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log("");
  console.log("⚠️  NON-LOCAL DATABASE DETECTED");
  console.log(`   Target: ${maskDatabaseUrl(databaseUrl)}`);
  console.log("   This will permanently delete ALL records from every collection.");
  console.log("");

  return new Promise((resolve) => {
    rl.question('   Type "WIPE" (uppercase) to continue, anything else cancels: ', (answer) => {
      rl.close();
      resolve(answer.trim() === "WIPE");
    });
  });
}

async function clearDatabase() {
  console.log("🧹 Clearing database (children → parents)...");

  const results = {
    reviews: await prisma.review.deleteMany({}),
    pricing: await prisma.pricing.deleteMany({}),
    specifications: await prisma.specifications.deleteMany({}),
    gallery: await prisma.gallery.deleteMany({}),
    blogLinks: await prisma.blogLink.deleteMany({}),
    subVariants: await prisma.subVariant.deleteMany({}),
    variants: await prisma.variant.deleteMany({}),
    vehicleModels: await prisma.vehicleModel.deleteMany({}),
    brands: await prisma.brand.deleteMany({}),
    dealers: await prisma.dealer.deleteMany({}),
    banners: await prisma.banner.deleteMany({}),
    blogs: await prisma.blog.deleteMany({}),
    users: await prisma.users.deleteMany({}),
  };

  console.log("");
  console.log("   Deleted record counts:");
  for (const [key, result] of Object.entries(results)) {
    console.log(`     ${key.padEnd(16)} → ${result.count}`);
  }
  console.log("");
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    console.error("❌ DATABASE_URL is not set. Aborting.");
    process.exit(1);
  }

  if (isLocalDatabaseUrl(databaseUrl)) {
    console.log(`🏠 Local database detected (${maskDatabaseUrl(databaseUrl)}) — skipping confirmation.`);
  } else {
    const confirmed = await promptConfirmation(databaseUrl);
    if (!confirmed) {
      console.log("❌ Cancelled. No changes made.");
      process.exit(0);
    }
  }

  await clearDatabase();
  console.log("✅ Database cleared. Run `npm run seed` to repopulate.");
}

main()
  .catch((e) => {
    console.error("❌ Clear failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
