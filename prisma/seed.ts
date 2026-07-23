import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // ─────────────────────────────────────────────
  // 1. USERS
  // ─────────────────────────────────────────────
  console.log("👤 Seeding users...");

  const hashedPassword = await bcrypt.hash("Password@123", 10);

  const superAdmin = await prisma.users.upsert({
    where: { email: "superadmin@evinfo.in" },
    update: {},
    create: {
      user_name: "superadmin",
      email: "superadmin@evinfo.in",
      password: hashedPassword,
      first_name: "Super",
      last_name: "Admin",
      full_name: "Super Admin",
      is_admin: true,
      is_superuser: true,
      is_active: true,
      otp_verified: true,
      email_verified: true,
      role: "superadmin",
      designation: "Super Administrator",
      status: "active",
      date_joined: new Date(),
    },
  });

  const adminUser = await prisma.users.upsert({
    where: { email: "admin@evinfo.in" },
    update: {},
    create: {
      user_name: "content_admin",
      email: "admin@evinfo.in",
      password: hashedPassword,
      first_name: "Content",
      last_name: "Manager",
      full_name: "Content Manager",
      is_admin: true,
      is_superuser: false,
      is_active: true,
      otp_verified: true,
      email_verified: true,
      role: "admin",
      designation: "Content Manager",
      status: "active",
      date_joined: new Date(),
    },
  });

  console.log(`   ✅ Created users: ${superAdmin.email}, ${adminUser.email}`);

  // ─────────────────────────────────────────────
  // 2. BRANDS
  // ─────────────────────────────────────────────
  console.log("🏷️  Seeding brands...");

  const teslaBrand = await prisma.brand.upsert({
    where: { slug: "tesla" },
    update: {},
    create: {
      name: "Tesla",
      slug: "tesla",
      logo: "https://cdn.evinfo.in/brands/tesla-logo.png",
      country: "USA",
      founded: 2003,
      description: "Tesla, Inc. is an American electric vehicle and clean energy company. Tesla designs and manufactures electric cars, battery energy storage, solar panels and more.",
      website: "https://www.tesla.com",
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const tataBrand = await prisma.brand.upsert({
    where: { slug: "tata-motors" },
    update: {},
    create: {
      name: "Tata Motors",
      slug: "tata-motors",
      logo: "https://cdn.evinfo.in/brands/tata-logo.png",
      country: "India",
      founded: 1945,
      description: "Tata Motors Limited is an Indian multinational automotive manufacturing company. It is India's largest commercial vehicle manufacturer and the third-largest passenger vehicle manufacturer.",
      website: "https://www.tatamotors.com",
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const mgBrand = await prisma.brand.upsert({
    where: { slug: "mg-motor" },
    update: {},
    create: {
      name: "MG Motor",
      slug: "mg-motor",
      logo: "https://cdn.evinfo.in/brands/mg-logo.png",
      country: "UK",
      founded: 1924,
      description: "MG Motor is a British automotive brand owned by SAIC Motor. The company sells electric vehicles including the ZS EV and Comet EV in India.",
      website: "https://www.mgmotor.co.in",
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const hyundaiBrand = await prisma.brand.upsert({
    where: { slug: "hyundai" },
    update: {},
    create: {
      name: "Hyundai",
      slug: "hyundai",
      logo: "https://cdn.evinfo.in/brands/hyundai-logo.png",
      country: "South Korea",
      founded: 1967,
      description: "Hyundai Motor Company is a South Korean multinational automotive manufacturer. It produces the IONIQ range of electric vehicles.",
      website: "https://www.hyundai.com",
      status: "active",
      created_by: superAdmin.id,
    },
  });

  console.log(`   ✅ Created brands: Tesla, Tata Motors, MG Motor, Hyundai`);

  // ─────────────────────────────────────────────
  // 3. VEHICLE MODELS
  // ─────────────────────────────────────────────
  console.log("🚗 Seeding vehicle models...");

  const teslaModel3 = await prisma.vehicleModel.upsert({
    where: { slug: "tesla-model-3" },
    update: {},
    create: {
      name: "Model 3",
      slug: "tesla-model-3",
      brand_id: teslaBrand.id,
      generation: "2nd Gen (Highland)",
      body_type: "Sedan",
      production_years: "2017-Present",
      platform: "Tesla Platform 3",
      timeline: [
        { year: 2017, event: "Model 3 Launch", description: "Tesla Model 3 launched globally" },
        { year: 2022, event: "Highland Update", description: "Major facelift with updated interior and exterior" },
        { year: 2024, event: "India Launch", description: "Tesla Model 3 officially launched in India" },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const teslaModelY = await prisma.vehicleModel.upsert({
    where: { slug: "tesla-model-y" },
    update: {},
    create: {
      name: "Model Y",
      slug: "tesla-model-y",
      brand_id: teslaBrand.id,
      generation: "1st Gen",
      body_type: "SUV / Crossover",
      production_years: "2020-Present",
      platform: "Tesla Platform 3",
      timeline: [
        { year: 2020, event: "Global Launch", description: "Tesla Model Y launched globally" },
        { year: 2023, event: "Highland Refresh", description: "Model Y updated with Highland design language" },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const tataNexonEV = await prisma.vehicleModel.upsert({
    where: { slug: "tata-nexon-ev" },
    update: {},
    create: {
      name: "Nexon EV",
      slug: "tata-nexon-ev",
      brand_id: tataBrand.id,
      generation: "2nd Gen",
      body_type: "Compact SUV",
      production_years: "2020-Present",
      platform: "SIGMA Architecture",
      timeline: [
        { year: 2020, event: "Nexon EV Launch", description: "First Nexon EV launched in India" },
        { year: 2022, event: "MAX Variant", description: "Nexon EV MAX with 40.5 kWh battery launched" },
        { year: 2024, event: "2024 Update", description: "Updated with Zconnect tech and ADAS" },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const mgZsEV = await prisma.vehicleModel.upsert({
    where: { slug: "mg-zs-ev" },
    update: {},
    create: {
      name: "ZS EV",
      slug: "mg-zs-ev",
      brand_id: mgBrand.id,
      generation: "2nd Gen",
      body_type: "Compact SUV",
      production_years: "2019-Present",
      platform: "MG EV Platform",
      timeline: [
        { year: 2019, event: "ZS EV India Launch", description: "First MG ZS EV launched in India" },
        { year: 2022, event: "Pro & Excite Variants", description: "Updated with new variants and 50.3 kWh battery" },
        { year: 2024, event: "Exclusive Update", description: "New Exclusive variant with enhanced ADAS features" },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const hyundaiIoniq5 = await prisma.vehicleModel.upsert({
    where: { slug: "hyundai-ioniq-5" },
    update: {},
    create: {
      name: "IONIQ 5",
      slug: "hyundai-ioniq-5",
      brand_id: hyundaiBrand.id,
      generation: "1st Gen",
      body_type: "Crossover CUV",
      production_years: "2021-Present",
      platform: "E-GMP",
      timeline: [
        { year: 2021, event: "Global Launch", description: "IONIQ 5 launched globally with 800V architecture" },
        { year: 2022, event: "India Launch", description: "IONIQ 5 launched in India" },
        { year: 2024, event: "2024 Update", description: "Updated battery and ADAS features" },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  console.log(`   ✅ Created 5 vehicle models`);

  // ─────────────────────────────────────────────
  // 4. VARIANTS (with colors & cover image)
  // ─────────────────────────────────────────────
  console.log("⚙️  Seeding variants...");

  const model3LongRange = await prisma.variant.upsert({
    where: { slug: "model-3-long-range-awd" },
    update: {},
    create: {
      name: "Long Range AWD",
      slug: "model-3-long-range-awd",
      model_id: teslaModel3.id,
      trim: "Long Range",
      launch_year: 2024,
      production_status: "active",
      segment: "Premium Sedan",
      cover_image: "https://cdn.evinfo.in/vehicles/model3/ext-front.jpg",
      featured: true,
      colors: [
        { id: "c1", name: "Pearl White Multi-Coat", hex_code: "#F5F5F5", image_url: "https://cdn.evinfo.in/vehicles/model3/white.jpg", price_delta: 0, type: "multi-coat", is_available: true },
        { id: "c2", name: "Midnight Silver Metallic", hex_code: "#5A5A5A", image_url: "https://cdn.evinfo.in/vehicles/model3/silver.jpg", price_delta: 90000, type: "metallic", is_available: true },
        { id: "c3", name: "Deep Blue Metallic", hex_code: "#1A3A6E", image_url: "https://cdn.evinfo.in/vehicles/model3/blue.jpg", price_delta: 90000, type: "metallic", is_available: true },
        { id: "c4", name: "Solid Black", hex_code: "#1A1A1A", image_url: "https://cdn.evinfo.in/vehicles/model3/black.jpg", price_delta: 90000, type: "solid", is_available: true },
        { id: "c5", name: "Ultra Red", hex_code: "#C0392B", image_url: "https://cdn.evinfo.in/vehicles/model3/red.jpg", price_delta: 180000, type: "multi-coat", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const model3RWD = await prisma.variant.upsert({
    where: { slug: "model-3-rwd" },
    update: {},
    create: {
      name: "Standard RWD",
      slug: "model-3-rwd",
      model_id: teslaModel3.id,
      trim: "Standard Range",
      launch_year: 2024,
      production_status: "active",
      segment: "Premium Sedan",
      cover_image: "https://cdn.evinfo.in/vehicles/model3/ext-front.jpg",
      featured: false,
      colors: [
        { id: "c1", name: "Pearl White Multi-Coat", hex_code: "#F5F5F5", image_url: "https://cdn.evinfo.in/vehicles/model3/white.jpg", price_delta: 0, type: "multi-coat", is_available: true },
        { id: "c2", name: "Midnight Silver Metallic", hex_code: "#5A5A5A", image_url: "https://cdn.evinfo.in/vehicles/model3/silver.jpg", price_delta: 90000, type: "metallic", is_available: true },
        { id: "c3", name: "Solid Black", hex_code: "#1A1A1A", image_url: "https://cdn.evinfo.in/vehicles/model3/black.jpg", price_delta: 90000, type: "solid", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const modelYLongRange = await prisma.variant.upsert({
    where: { slug: "model-y-long-range-awd" },
    update: {},
    create: {
      name: "Long Range AWD",
      slug: "model-y-long-range-awd",
      model_id: teslaModelY.id,
      trim: "Long Range",
      launch_year: 2024,
      production_status: "active",
      segment: "Electric SUV",
      cover_image: "https://cdn.evinfo.in/vehicles/model-y/ext-front.jpg",
      featured: false,
      colors: [
        { id: "c1", name: "Pearl White Multi-Coat", hex_code: "#F5F5F5", image_url: "https://cdn.evinfo.in/vehicles/model-y/white.jpg", price_delta: 0, type: "multi-coat", is_available: true },
        { id: "c2", name: "Midnight Silver Metallic", hex_code: "#5A5A5A", image_url: "https://cdn.evinfo.in/vehicles/model-y/silver.jpg", price_delta: 90000, type: "metallic", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const nexonEVMax = await prisma.variant.upsert({
    where: { slug: "nexon-ev-max" },
    update: {},
    create: {
      name: "MAX",
      slug: "nexon-ev-max",
      model_id: tataNexonEV.id,
      trim: "MAX",
      launch_year: 2022,
      production_status: "active",
      segment: "Compact EV SUV",
      cover_image: "https://cdn.evinfo.in/vehicles/nexon-ev/ext-front.jpg",
      featured: true,
      colors: [
        { id: "c1", name: "Fearless Purple", hex_code: "#6A0DAD", image_url: "https://cdn.evinfo.in/vehicles/nexon-ev/purple.jpg", price_delta: 0, type: "standard", is_available: true },
        { id: "c2", name: "Pristine White", hex_code: "#FFFFFF", image_url: "https://cdn.evinfo.in/vehicles/nexon-ev/white.jpg", price_delta: 0, type: "standard", is_available: true },
        { id: "c3", name: "Midnight Black", hex_code: "#1A1A1A", image_url: "https://cdn.evinfo.in/vehicles/nexon-ev/black.jpg", price_delta: 0, type: "standard", is_available: true },
        { id: "c4", name: "Flame Red", hex_code: "#B22222", image_url: "https://cdn.evinfo.in/vehicles/nexon-ev/red.jpg", price_delta: 10000, type: "standard", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const nexonEVPrime = await prisma.variant.upsert({
    where: { slug: "nexon-ev-prime" },
    update: {},
    create: {
      name: "Prime",
      slug: "nexon-ev-prime",
      model_id: tataNexonEV.id,
      trim: "Prime",
      launch_year: 2021,
      production_status: "active",
      segment: "Compact EV SUV",
      cover_image: "https://cdn.evinfo.in/vehicles/nexon-ev/ext-front.jpg",
      featured: false,
      colors: [
        { id: "c1", name: "Pristine White", hex_code: "#FFFFFF", image_url: "https://cdn.evinfo.in/vehicles/nexon-ev/white.jpg", price_delta: 0, type: "standard", is_available: true },
        { id: "c2", name: "Midnight Black", hex_code: "#1A1A1A", image_url: "https://cdn.evinfo.in/vehicles/nexon-ev/black.jpg", price_delta: 0, type: "standard", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const mgZsExclusive = await prisma.variant.upsert({
    where: { slug: "mg-zs-ev-exclusive" },
    update: {},
    create: {
      name: "Exclusive",
      slug: "mg-zs-ev-exclusive",
      model_id: mgZsEV.id,
      trim: "Exclusive",
      launch_year: 2023,
      production_status: "active",
      segment: "Compact EV SUV",
      cover_image: "https://cdn.evinfo.in/vehicles/mg-zs/ext-front.jpg",
      featured: false,
      colors: [
        { id: "c1", name: "Canterbury Silver", hex_code: "#C0C0C0", image_url: "https://cdn.evinfo.in/vehicles/mg-zs/silver.jpg", price_delta: 0, type: "metallic", is_available: true },
        { id: "c2", name: "Starry Black", hex_code: "#1A1A1A", image_url: "https://cdn.evinfo.in/vehicles/mg-zs/black.jpg", price_delta: 0, type: "standard", is_available: true },
        { id: "c3", name: "Aurora Silver with Starry Black Roof", hex_code: "#C0C0C0", image_url: "https://cdn.evinfo.in/vehicles/mg-zs/silver-black.jpg", price_delta: 15000, type: "standard", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  const ioniq5Standard = await prisma.variant.upsert({
    where: { slug: "ioniq-5-standard-range" },
    update: {},
    create: {
      name: "Standard Range 2WD",
      slug: "ioniq-5-standard-range",
      model_id: hyundaiIoniq5.id,
      trim: "Standard",
      launch_year: 2022,
      production_status: "active",
      segment: "Electric Crossover",
      cover_image: "https://cdn.evinfo.in/vehicles/ioniq5/ext-front.jpg",
      featured: true,
      colors: [
        { id: "c1", name: "Lucid Lime", hex_code: "#C8D400", image_url: "https://cdn.evinfo.in/vehicles/ioniq5/lime.jpg", price_delta: 0, type: "matte", is_available: true },
        { id: "c2", name: "Atlas White", hex_code: "#F5F5F5", image_url: "https://cdn.evinfo.in/vehicles/ioniq5/white.jpg", price_delta: 0, type: "standard", is_available: true },
        { id: "c3", name: "Digital Teal Green", hex_code: "#1C6B6B", image_url: "https://cdn.evinfo.in/vehicles/ioniq5/teal.jpg", price_delta: 30000, type: "metallic", is_available: true },
        { id: "c4", name: "Midnight Black", hex_code: "#1A1A1A", image_url: "https://cdn.evinfo.in/vehicles/ioniq5/black.jpg", price_delta: 30000, type: "metallic", is_available: true },
      ],
      status: "active",
      created_by: superAdmin.id,
    },
  });

  console.log(`   ✅ Created 7 variants`);

  // ─────────────────────────────────────────────
  // 5. SUB-VARIANTS
  // ─────────────────────────────────────────────
  console.log("🔋 Seeding sub-variants...");

  const svModel3LR = await prisma.subVariant.upsert({
    where: { slug: "tesla-model-3-lr-awd-ev" },
    update: {},
    create: {
      name: "Long Range AWD EV",
      slug: "tesla-model-3-lr-awd-ev",
      variant_id: model3LongRange.id,
      fuel_type: "EV",
      transmission: "Single-Speed Automatic",
      drivetrain: "AWD",
      view_count: 2450,
      status: "active",
      created_by: superAdmin.id,
      ownership: {
        warranty: "4 years / 80,000 km",
        battery_warranty: "8 years / 160,000 km (70% capacity retention)",
        service_interval: "Annual service recommended",
        maintenance_cost: "Low cost (no engine oil, brake pads last longer due to regen)",
        roadside_assist: true,
        service_centers: 8,
      },
    },
  });

  const svModel3RWD = await prisma.subVariant.upsert({
    where: { slug: "tesla-model-3-rwd-ev" },
    update: {},
    create: {
      name: "Standard RWD EV",
      slug: "tesla-model-3-rwd-ev",
      variant_id: model3RWD.id,
      fuel_type: "EV",
      transmission: "Single-Speed Automatic",
      drivetrain: "RWD",
      view_count: 1820,
      status: "active",
      created_by: superAdmin.id,
      ownership: {
        warranty: "4 years / 80,000 km",
        battery_warranty: "8 years / 160,000 km",
        service_interval: "Annual service recommended",
        maintenance_cost: "Low cost",
        roadside_assist: true,
        service_centers: 8,
      },
    },
  });

  const svNexonMax = await prisma.subVariant.upsert({
    where: { slug: "tata-nexon-ev-max-ev" },
    update: {},
    create: {
      name: "MAX EV",
      slug: "tata-nexon-ev-max-ev",
      variant_id: nexonEVMax.id,
      fuel_type: "EV",
      transmission: "Single-Speed Automatic",
      drivetrain: "FWD",
      view_count: 5320,
      status: "active",
      created_by: superAdmin.id,
      ownership: {
        warranty: "3 years / Unlimited km",
        battery_warranty: "8 years / 1,60,000 km",
        service_interval: "Annual service",
        maintenance_cost: "Low cost",
        roadside_assist: true,
        service_centers: 250,
      },
    },
  });

  const svMgZsExclusive = await prisma.subVariant.upsert({
    where: { slug: "mg-zs-ev-exclusive-ev" },
    update: {},
    create: {
      name: "Exclusive EV",
      slug: "mg-zs-ev-exclusive-ev",
      variant_id: mgZsExclusive.id,
      fuel_type: "EV",
      transmission: "Single-Speed Automatic",
      drivetrain: "FWD",
      view_count: 3100,
      status: "active",
      created_by: superAdmin.id,
      ownership: {
        warranty: "5 years / Unlimited km",
        battery_warranty: "8 years / 1,50,000 km",
        service_interval: "Annual service",
        maintenance_cost: "Low cost",
        roadside_assist: true,
        service_centers: 300,
      },
    },
  });

  const svIoniq5Std = await prisma.subVariant.upsert({
    where: { slug: "hyundai-ioniq-5-std-rwd-ev" },
    update: {},
    create: {
      name: "Standard Range RWD EV",
      slug: "hyundai-ioniq-5-std-rwd-ev",
      variant_id: ioniq5Standard.id,
      fuel_type: "EV",
      transmission: "Single-Speed Automatic",
      drivetrain: "RWD",
      view_count: 4200,
      status: "active",
      created_by: superAdmin.id,
      ownership: {
        warranty: "3 years / Unlimited km",
        battery_warranty: "8 years / 1,60,000 km",
        service_interval: "Annual service",
        maintenance_cost: "Low cost",
        roadside_assist: true,
        service_centers: 180,
      },
    },
  });

  console.log(`   ✅ Created 5 sub-variants`);

  // ─────────────────────────────────────────────
  // 6. PRICING
  // ─────────────────────────────────────────────
  console.log("💰 Seeding pricing...");

  // Delete existing pricing first for idempotency
  await prisma.pricing.deleteMany({
    where: {
      sub_variant_id: {
        in: [svModel3LR.id, svModel3RWD.id, svNexonMax.id, svMgZsExclusive.id, svIoniq5Std.id],
      },
    },
  });

  await prisma.pricing.createMany({
    data: [
      {
        sub_variant_id: svModel3LR.id,
        city: null,
        ex_showroom_price: 4299000,
        on_road_price: 5100000,
        insurance: 145000,
        registration: 78000,
        tcs_tax: 430000,
        financing: { emi: "₹84,500/month", down_payment: "₹860,000", tenure: "60 months", interest: 8.5 },
        is_active: true,
        created_by: superAdmin.id,
      },
      {
        sub_variant_id: svModel3LR.id,
        city: "Mumbai",
        state: "Maharashtra",
        ex_showroom_price: 4299000,
        on_road_price: 5250000,
        insurance: 155000,
        registration: 92000,
        tcs_tax: 445000,
        financing: { emi: "₹86,500/month", down_payment: "₹875,000", tenure: "60 months", interest: 8.5 },
        is_active: true,
        created_by: superAdmin.id,
      },
      {
        sub_variant_id: svModel3RWD.id,
        city: null,
        ex_showroom_price: 3499000,
        on_road_price: 4200000,
        insurance: 120000,
        registration: 65000,
        tcs_tax: 350000,
        financing: { emi: "₹69,000/month", down_payment: "₹700,000", tenure: "60 months", interest: 8.5 },
        is_active: true,
        created_by: superAdmin.id,
      },
      {
        sub_variant_id: svNexonMax.id,
        city: null,
        ex_showroom_price: 1799900,
        on_road_price: 2150000,
        insurance: 72000,
        registration: 45000,
        tcs_tax: 180000,
        financing: { emi: "₹38,500/month", down_payment: "₹360,000", tenure: "60 months", interest: 9.0 },
        is_active: true,
        created_by: superAdmin.id,
      },
      {
        sub_variant_id: svNexonMax.id,
        city: "Delhi",
        state: "Delhi",
        ex_showroom_price: 1799900,
        on_road_price: 2080000,
        insurance: 70000,
        registration: 38000,
        tcs_tax: 175000,
        financing: { emi: "₹37,000/month", down_payment: "₹350,000", tenure: "60 months", interest: 9.0 },
        is_active: true,
        created_by: superAdmin.id,
      },
      {
        sub_variant_id: svMgZsExclusive.id,
        city: null,
        ex_showroom_price: 2088000,
        on_road_price: 2500000,
        insurance: 82000,
        registration: 52000,
        tcs_tax: 200000,
        financing: { emi: "₹45,000/month", down_payment: "₹420,000", tenure: "60 months", interest: 8.9 },
        is_active: true,
        created_by: superAdmin.id,
      },
      {
        sub_variant_id: svIoniq5Std.id,
        city: null,
        ex_showroom_price: 4415000,
        on_road_price: 5250000,
        insurance: 155000,
        registration: 82000,
        tcs_tax: 440000,
        financing: { emi: "₹88,000/month", down_payment: "₹880,000", tenure: "60 months", interest: 8.5 },
        is_active: true,
        created_by: superAdmin.id,
      },
    ],
  });

  console.log(`   ✅ Created 7 pricing records (incl. city-specific)`);

  // ─────────────────────────────────────────────
  // 7. SPECIFICATIONS
  // ─────────────────────────────────────────────
  console.log("📋 Seeding specifications...");

  await prisma.specifications.deleteMany({
    where: {
      sub_variant_id: {
        in: [svModel3LR.id, svModel3RWD.id, svNexonMax.id, svMgZsExclusive.id, svIoniq5Std.id],
      },
    },
  });

  // Tesla Model 3 Long Range AWD
  await prisma.specifications.create({
    data: {
      sub_variant_id: svModel3LR.id,
      performance: {
        acceleration: "4.4s (0-100 km/h)",
        top_speed: "201 km/h",
        power: "366 hp",
        torque: "493 Nm",
        fuel_efficiency: "14.3 kWh/100km",
        traction_control: true,
        launch_control: false,
      },
      battery: {
        capacity: "75 kWh",
        type: "Lithium-Ion (NMC)",
        voltage: "350V",
        range: "629 km (WLTP)",
        range_city: "710 km",
        range_highway: "560 km",
        efficiency: "238 Wh/km",
        charging: {
          ac: "11 kW (3-phase)",
          dc: "170 kW (Supercharger)",
          time_10to80: "25 min",
          time_0to100: "8.5 hrs (11 kW AC)",
          connector_type: "CCS2 / Type 2",
          port_location: "Rear Left",
        },
      },
      dimensions: {
        length: "4720 mm",
        width: "1921 mm",
        height: "1441 mm",
        wheelbase: "2875 mm",
        ground_clearance: "140 mm",
        kerb_weight: "1830 kg",
        turning_radius: "5.8 m",
        boot_space: "594 L (boot) + 88 L (frunk)",
      },
      interior: {
        seating: 5,
        seating_material: "Vegan Leather",
        upholstery: "White / Black",
        dashboard: "Minimalist with 15.4 inch Central Display",
        infotainment: "15.4 inch Touchscreen with OTA updates",
        instrument_cluster: "Digital (screen-based)",
        headroom_front: "993 mm",
        headroom_rear: "930 mm",
        legroom_front: "1041 mm",
        legroom_rear: "972 mm",
        cargo_volume: "594 L (boot) + 88 L (frunk)",
        cargo_max: "682 L total",
      },
      safety: {
        ncap_rating: "5-Star Euro NCAP 2022",
        airbags: 8,
        abs: true,
        esc: true,
        tcs: true,
        blind_spot: true,
        lane_assist: true,
        adaptive_cruise: true,
        parking_sensors: "both",
        camera_360: true,
        autonomous_level: "Level 2 (Autopilot)",
      },
      wheels: {
        front: "235/45 R18",
        rear: "255/45 R18",
        wheel_type: "alloy",
        spare: "None (Tyre Repair Kit)",
        pressure_monitoring: true,
      },
      features: {
        exterior: ["LED Matrix Headlights", "Flush Door Handles", "Panoramic Glass Roof", "Auto-folding Mirrors"],
        interior: ["Heated Front & Rear Seats", "15.4 inch Touchscreen", "Premium Audio (16 speakers)", "Wireless Charging Pad"],
        comfort: ["Auto AC with HEPA Filter", "Ambient Lighting", "Power Adjustable Seats", "Smart Air Suspension"],
        entertainment: ["Netflix", "YouTube", "Spotify", "Gaming (in-car)"],
        connectivity: ["Bluetooth 5.0", "Wi-Fi", "LTE", "OTA Software Updates"],
        convenience: ["Autopilot", "Full Self-Driving (FSD) Ready", "Summon", "Smart Phone Key"],
        safety_features: ["8 Airbags", "ABS with EBD", "ESC", "Blind Spot Monitoring", "TPMS"],
        adas_features: ["Autopilot", "Navigate on Autopilot", "Auto Lane Change", "Traffic-Aware Cruise Control"],
      },
      created_by: superAdmin.id,
    },
  });

  // Tesla Model 3 Standard RWD
  await prisma.specifications.create({
    data: {
      sub_variant_id: svModel3RWD.id,
      performance: {
        acceleration: "6.1s (0-100 km/h)",
        top_speed: "201 km/h",
        power: "283 hp",
        torque: "420 Nm",
        fuel_efficiency: "13.9 kWh/100km",
        traction_control: true,
        launch_control: false,
      },
      battery: {
        capacity: "60 kWh",
        type: "Lithium-Iron-Phosphate (LFP)",
        voltage: "350V",
        range: "513 km (WLTP)",
        range_city: "600 km",
        range_highway: "430 km",
        efficiency: "271 Wh/km",
        charging: {
          ac: "7.2 kW",
          dc: "170 kW",
          time_10to80: "30 min",
          time_0to100: "9.5 hrs (7.2 kW AC)",
          connector_type: "CCS2 / Type 2",
          port_location: "Rear Left",
        },
      },
      dimensions: {
        length: "4720 mm",
        width: "1921 mm",
        height: "1441 mm",
        wheelbase: "2875 mm",
        ground_clearance: "140 mm",
        kerb_weight: "1761 kg",
        turning_radius: "5.8 m",
        boot_space: "594 L",
      },
      interior: {
        seating: 5,
        seating_material: "Vegan Leather",
        upholstery: "White / Black",
        dashboard: "Minimalist with 15.4 inch Central Display",
        infotainment: "15.4 inch Touchscreen with OTA updates",
        instrument_cluster: "Digital",
        headroom_front: "993 mm",
        headroom_rear: "930 mm",
        legroom_front: "1041 mm",
        legroom_rear: "972 mm",
        cargo_volume: "594 L",
        cargo_max: "682 L",
      },
      safety: {
        ncap_rating: "5-Star Euro NCAP",
        airbags: 8,
        abs: true,
        esc: true,
        tcs: true,
        blind_spot: true,
        lane_assist: true,
        adaptive_cruise: true,
        parking_sensors: "both",
        camera_360: true,
        autonomous_level: "Level 2 (Autopilot)",
      },
      wheels: {
        front: "235/45 R18",
        rear: "235/45 R18",
        wheel_type: "alloy",
        spare: "None",
        pressure_monitoring: true,
      },
      features: {
        exterior: ["LED Headlights", "Flush Door Handles", "Panoramic Glass Roof"],
        interior: ["Heated Front Seats", "15.4 inch Touchscreen", "8-Speaker Audio"],
        comfort: ["Auto AC", "Power Adjustable Seats"],
        entertainment: ["Netflix", "YouTube", "Spotify"],
        connectivity: ["Bluetooth", "Wi-Fi", "LTE", "OTA Updates"],
        convenience: ["Autopilot", "Phone Key", "App Control"],
        safety_features: ["8 Airbags", "ABS with EBD", "ESC", "TPMS"],
        adas_features: ["Autopilot", "Traffic-Aware Cruise Control"],
      },
      created_by: superAdmin.id,
    },
  });

  // Tata Nexon EV MAX
  await prisma.specifications.create({
    data: {
      sub_variant_id: svNexonMax.id,
      performance: {
        acceleration: "9.0s (0-100 km/h)",
        top_speed: "140 km/h",
        power: "143 hp",
        torque: "250 Nm",
        fuel_efficiency: "9.3 kWh/100km",
        traction_control: true,
        launch_control: false,
      },
      battery: {
        capacity: "40.5 kWh",
        type: "Lithium-Ion",
        voltage: "350V",
        range: "437 km (ARAI)",
        range_city: "480 km",
        range_highway: "380 km",
        efficiency: "213 Wh/km",
        charging: {
          ac: "7.2 kW",
          dc: "50 kW (DC Fast Charge)",
          time_10to80: "56 min (DC)",
          time_0to100: "8.5 hrs (7.2 kW AC)",
          connector_type: "CCS2 / Type 2",
          port_location: "Front",
        },
      },
      dimensions: {
        length: "3993 mm",
        width: "1811 mm",
        height: "1606 mm",
        wheelbase: "2498 mm",
        ground_clearance: "190 mm",
        kerb_weight: "1475 kg",
        turning_radius: "5.2 m",
        boot_space: "350 L",
      },
      interior: {
        seating: 5,
        seating_material: "Leatherette",
        upholstery: "Oyster White",
        dashboard: "Connected with 10.25 inch Infotainment",
        infotainment: "10.25 inch Harman Touchscreen",
        instrument_cluster: "7 inch Digital + Analog",
        headroom_front: "990 mm",
        headroom_rear: "970 mm",
        legroom_front: "1040 mm",
        legroom_rear: "930 mm",
        cargo_volume: "350 L",
        cargo_max: "350 L",
      },
      safety: {
        ncap_rating: "5-Star Global NCAP",
        airbags: 6,
        abs: true,
        esc: true,
        tcs: true,
        blind_spot: false,
        lane_assist: false,
        adaptive_cruise: false,
        parking_sensors: "rear",
        camera_360: false,
        autonomous_level: "Level 1 (ADAS)",
      },
      wheels: {
        front: "215/60 R16",
        rear: "215/60 R16",
        wheel_type: "alloy",
        spare: "Temporary Spare",
        pressure_monitoring: true,
      },
      features: {
        exterior: ["LED DRL Headlights", "Shark Fin Antenna", "Roof Rails", "Diamond Cut Alloys"],
        interior: ["10.25 inch Harman Infotainment", "Air Purifier", "Ventilated Front Seats", "Wireless Charger"],
        comfort: ["Automatic Climate Control", "Cruise Control", "Electric Parking Brake"],
        entertainment: ["JBL Sound System", "Android Auto / Apple CarPlay"],
        connectivity: ["Bluetooth", "Wi-Fi Hotspot", "Zconnect Connected Tech"],
        convenience: ["Drive Modes (Eco/City/Sport)", "Paddle Shifters", "Auto Hold"],
        safety_features: ["6 Airbags", "ABS with EBD", "ESC", "TPMS", "Hill Hold Control"],
        adas_features: ["Emergency Brake Assist", "Lane Departure Warning"],
      },
      created_by: superAdmin.id,
    },
  });

  // MG ZS EV Exclusive
  await prisma.specifications.create({
    data: {
      sub_variant_id: svMgZsExclusive.id,
      performance: {
        acceleration: "8.5s (0-100 km/h)",
        top_speed: "175 km/h",
        power: "176 hp",
        torque: "280 Nm",
        fuel_efficiency: "10.9 kWh/100km",
        traction_control: true,
        launch_control: false,
      },
      battery: {
        capacity: "50.3 kWh",
        type: "Lithium-Ion",
        voltage: "360V",
        range: "461 km (ARAI)",
        range_city: "500 km",
        range_highway: "400 km",
        efficiency: "217 Wh/km",
        charging: {
          ac: "7.4 kW",
          dc: "76 kW",
          time_10to80: "36 min (DC)",
          time_0to100: "8.5 hrs (AC)",
          connector_type: "CCS2 / Type 2",
          port_location: "Front Left",
        },
      },
      dimensions: {
        length: "4314 mm",
        width: "1809 mm",
        height: "1649 mm",
        wheelbase: "2585 mm",
        ground_clearance: "177 mm",
        kerb_weight: "1620 kg",
        turning_radius: "5.4 m",
        boot_space: "448 L",
      },
      interior: {
        seating: 5,
        seating_material: "Leatherette",
        upholstery: "Black",
        dashboard: "Connected with 10.1 inch Infotainment",
        infotainment: "10.1 inch Touchscreen with TomTom Navigation",
        instrument_cluster: "7 inch Digital",
        headroom_front: "985 mm",
        headroom_rear: "960 mm",
        legroom_front: "1030 mm",
        legroom_rear: "950 mm",
        cargo_volume: "448 L",
        cargo_max: "1166 L (seats folded)",
      },
      safety: {
        ncap_rating: "5-Star ANCAP",
        airbags: 6,
        abs: true,
        esc: true,
        tcs: true,
        blind_spot: true,
        lane_assist: true,
        adaptive_cruise: true,
        parking_sensors: "both",
        camera_360: true,
        autonomous_level: "Level 2 (i-SMART ADAS)",
      },
      wheels: {
        front: "215/55 R17",
        rear: "215/55 R17",
        wheel_type: "alloy",
        spare: "Tyre Repair Kit",
        pressure_monitoring: true,
      },
      features: {
        exterior: ["LED Headlights", "Panoramic Sunroof", "Chrome Accents", "17-inch Alloy Wheels"],
        interior: ["10.1 inch Touchscreen", "Heated Front Seats", "PM 2.5 Air Filter", "Wireless Charging"],
        comfort: ["Automatic Climate Control", "Ventilated Seats", "Keyless Entry"],
        entertainment: ["Arkamys Sound System", "Android Auto / Apple CarPlay"],
        connectivity: ["i-SMART Connected Car", "Bluetooth", "Wi-Fi", "OTA Updates"],
        convenience: ["360 degree Camera", "Rear Cross Traffic Alert", "Hill Descent Control"],
        safety_features: ["6 Airbags", "ABS with EBD", "ESC", "Blind Spot Monitoring", "TPMS"],
        adas_features: ["Lane Departure Warning", "Adaptive Cruise Control", "Forward Collision Warning", "Rear Cross Traffic Alert"],
      },
      created_by: superAdmin.id,
    },
  });

  // Hyundai IONIQ 5 Standard Range 2WD
  await prisma.specifications.create({
    data: {
      sub_variant_id: svIoniq5Std.id,
      performance: {
        acceleration: "8.5s (0-100 km/h)",
        top_speed: "185 km/h",
        power: "170 hp",
        torque: "350 Nm",
        fuel_efficiency: "15.1 kWh/100km",
        traction_control: true,
        launch_control: false,
      },
      battery: {
        capacity: "58 kWh",
        type: "Lithium-Ion (NCM)",
        voltage: "800V",
        range: "385 km (WLTP)",
        range_city: "440 km",
        range_highway: "330 km",
        efficiency: "261 Wh/km",
        charging: {
          ac: "11 kW",
          dc: "220 kW (800V ultra-fast)",
          time_10to80: "18 min (800V DC)",
          time_0to100: "6.5 hrs (11 kW AC)",
          connector_type: "CCS2 / Type 2",
          port_location: "Rear Left",
        },
      },
      dimensions: {
        length: "4635 mm",
        width: "1890 mm",
        height: "1605 mm",
        wheelbase: "3000 mm",
        ground_clearance: "160 mm",
        kerb_weight: "1850 kg",
        turning_radius: "5.6 m",
        boot_space: "527 L (boot) + 57 L (frunk)",
      },
      interior: {
        seating: 5,
        seating_material: "Eco Processed Leather",
        upholstery: "Brise Beige",
        dashboard: "Dual 12 inch Screen Cockpit",
        infotainment: "12 inch Touchscreen with connected navigation",
        instrument_cluster: "12 inch Digital Cluster",
        headroom_front: "1009 mm",
        headroom_rear: "982 mm",
        legroom_front: "1047 mm",
        legroom_rear: "1060 mm",
        cargo_volume: "527 L (boot) + 57 L (frunk)",
        cargo_max: "1587 L (seats folded)",
      },
      safety: {
        ncap_rating: "5-Star Euro NCAP 2021",
        airbags: 6,
        abs: true,
        esc: true,
        tcs: true,
        blind_spot: true,
        lane_assist: true,
        adaptive_cruise: true,
        parking_sensors: "both",
        camera_360: true,
        autonomous_level: "Level 2 (Hyundai SmartSense)",
      },
      wheels: {
        front: "235/55 R19",
        rear: "255/45 R20",
        wheel_type: "alloy",
        spare: "None",
        pressure_monitoring: true,
      },
      features: {
        exterior: ["Pixel LED Headlights", "Retractable Door Handles", "Panoramic Glass Roof", "V2L (Vehicle-to-Load)"],
        interior: ["Dual 12 inch Screens", "Sliding Center Console", "Universal Island Platform Floor", "Relaxation Seats"],
        comfort: ["5-zone Climate Control", "V2L 220V Outlet", "Solar Roof Option"],
        entertainment: ["Bose Premium Audio (8 speakers)", "Android Auto / Apple CarPlay", "Rear Entertainment"],
        connectivity: ["Bluelink Connected Car", "Bluetooth", "Wi-Fi", "OTA Updates"],
        convenience: ["Remote Smart Parking", "Highway Driving Assist 2", "Ultra-fast 800V Charging"],
        safety_features: ["6 Airbags", "ABS with EBD", "ESC", "Blind Spot Collision Warning", "TPMS"],
        adas_features: ["Highway Driving Assist 2", "Smart Cruise Control", "Lane Keeping Assist", "Forward Collision Avoidance"],
      },
      created_by: superAdmin.id,
    },
  });

  console.log(`   ✅ Created 5 specifications records`);

  // Update competitor_ids on variants
  await prisma.variant.update({
    where: { id: model3LongRange.id },
    data: { competitor_ids: [ioniq5Standard.id] },
  });
  await prisma.variant.update({
    where: { id: model3RWD.id },
    data: { competitor_ids: [model3LongRange.id] },
  });
  await prisma.variant.update({
    where: { id: nexonEVMax.id },
    data: { competitor_ids: [mgZsExclusive.id] },
  });
  await prisma.variant.update({
    where: { id: mgZsExclusive.id },
    data: { competitor_ids: [nexonEVMax.id] },
  });
  await prisma.variant.update({
    where: { id: ioniq5Standard.id },
    data: { competitor_ids: [model3LongRange.id] },
  });

  console.log(`   ✅ Updated competitor_ids on variants`);

  // ─────────────────────────────────────────────
  // 8. REVIEWS
  // ─────────────────────────────────────────────
  console.log("⭐ Seeding reviews...");

  await prisma.review.createMany({
    data: [
      {
        sub_variant_id: svModel3LR.id,
        user_id: adminUser.id,
        rating: 5.0,
        title: "Best EV I have ever driven",
        content: "The Tesla Model 3 Long Range is an absolute dream to drive. The acceleration is effortless, the range is more than adequate for daily use, and Autopilot has made highway driving stress-free. The over-the-air updates keep adding new features without visiting a service center.",
        pros: ["Incredible range", "Supercharger network", "Autopilot", "Low running cost", "OTA updates"],
        cons: ["High purchase price", "Limited service centers in India", "No Apple CarPlay"],
        status: "approved",
        helpful_count: 42,
        created_by: adminUser.id,
      },
      {
        sub_variant_id: svModel3LR.id,
        user_id: adminUser.id,
        rating: 4.0,
        title: "Excellent tech but expensive maintenance",
        content: "Love the car in every way — the performance, the range, the futuristic interior. However, servicing is expensive and spare parts take time. Great for tech enthusiasts who can handle the ownership quirks.",
        pros: ["Exceptional performance", "Minimalist interior", "Premium feel"],
        cons: ["Expensive service", "Long wait for parts", "No dealer network in smaller cities"],
        status: "approved",
        helpful_count: 28,
        created_by: adminUser.id,
      },
      {
        sub_variant_id: svNexonMax.id,
        user_id: adminUser.id,
        rating: 4.5,
        title: "Best value EV in India",
        content: "The Tata Nexon EV MAX offers the best combination of range, features, and price in the Indian market. 437 km ARAI range means I never worry about charging. Service network is excellent across India.",
        pros: ["437 km range", "Excellent service network", "5-star safety", "Value for money", "Made in India"],
        cons: ["Acceleration not great", "Interior could be better", "No Level 2 ADAS"],
        status: "approved",
        helpful_count: 87,
        created_by: adminUser.id,
      },
      {
        sub_variant_id: svNexonMax.id,
        user_id: adminUser.id,
        rating: 4.0,
        title: "Perfect first EV for Indian conditions",
        content: "Bought Nexon EV MAX 6 months ago. The ground clearance of 190mm is perfect for Indian roads. DC fast charging from 10-80% in under an hour is impressive at this price point.",
        pros: ["High ground clearance", "DC fast charge", "Tata service centers everywhere"],
        cons: ["Mediocre sound system", "Plastic quality inside could be better"],
        status: "approved",
        helpful_count: 64,
        created_by: adminUser.id,
      },
      {
        sub_variant_id: svIoniq5Std.id,
        user_id: adminUser.id,
        rating: 5.0,
        title: "A revolution in EV design and tech",
        content: "The IONIQ 5 is unlike any car I have owned. The 800V architecture means ultra-fast charging (10-80% in just 18 minutes!), the interior is spacious and futuristic, and V2L lets me power my appliances from the car. Worth every rupee.",
        pros: ["800V ultra-fast charging", "Futuristic interior", "V2L feature", "5-star safety", "Spacious"],
        cons: ["Range could be better", "Expensive", "No sunroof in base variant"],
        status: "approved",
        helpful_count: 55,
        created_by: adminUser.id,
      },
      {
        sub_variant_id: svMgZsExclusive.id,
        user_id: adminUser.id,
        rating: 4.0,
        title: "Feature-packed family EV",
        content: "The MG ZS EV Exclusive is loaded with features at its price point. The 360-degree camera, ADAS, panoramic sunroof, and 50.3 kWh battery make it an excellent family car. MG's customer service is also very responsive.",
        pros: ["Feature-loaded", "Panoramic sunroof", "360 degree camera", "Large boot space", "Responsive service"],
        cons: ["Brand resale value uncertain", "Touchscreen can lag", "Higher kerb weight"],
        status: "approved",
        helpful_count: 31,
        created_by: adminUser.id,
      },
    ],
  });

  console.log(`   ✅ Created 6 reviews`);

  // ─────────────────────────────────────────────
  // 9. BLOGS
  // ─────────────────────────────────────────────
  console.log("📝 Seeding blogs...");

  await prisma.blog.createMany({
    data: [
      {
        title: "Top 5 Electric Vehicles Under 25 Lakhs in India 2025",
        slug: "top-5-evs-under-25-lakhs-india-2025",
        excerpt: "Looking for an affordable electric vehicle in India? We break down the best EVs available under 25 lakhs, covering range, features, and value.",
        cover_images: ["https://cdn.evinfo.in/blogs/top-5-evs-cover.jpg"],
        author_id: adminUser.id,
        categories: ["evs"],
        tags: ["EV", "budget EV", "India", "2025", "Tata", "MG"],
        sections: [
          {
            id: "s1",
            heading: "Why Go Electric in 2025?",
            content: "With rising fuel prices and improving charging infrastructure, 2025 is the best time to switch to electric in India. Government subsidies under FAME II and state-level incentives make EVs more affordable than ever.",
            images: ["https://cdn.evinfo.in/blogs/ev-india-infra.jpg"],
            order: 1,
          },
          {
            id: "s2",
            heading: "1. Tata Nexon EV MAX — Rs. 17.99 Lakhs",
            content: "The Nexon EV MAX remains the undisputed champion of affordable EVs in India. With 437 km ARAI range, 5-star safety rating, and Tata's extensive 250+ service center network, it's a no-brainer for first-time EV buyers.",
            images: ["https://cdn.evinfo.in/blogs/nexon-ev-max.jpg"],
            order: 2,
          },
          {
            id: "s3",
            heading: "2. MG ZS EV Exclusive — Rs. 20.88 Lakhs",
            content: "The MG ZS EV packs more features than any competitor at this price. Panoramic sunroof, 360-degree camera, ADAS, and 461 km ARAI range make it the most feature-rich EV under 25 lakhs.",
            images: [],
            order: 3,
          },
        ],
        seo: {
          metaTitle: "Best Electric Cars Under 25 Lakhs India 2025 | EVinfo",
          metaDescription: "Discover the top 5 affordable electric vehicles under 25 lakhs in India for 2025. Compare range, features, charging, and value.",
          keywords: ["electric car under 25 lakhs", "affordable EV India", "best EV 2025", "Tata Nexon EV", "MG ZS EV"],
        },
        status: "published",
        featured: true,
        published: true,
        published_at: new Date("2025-01-15"),
        created_by: adminUser.id,
      },
      {
        title: "Tesla Model 3 Highland vs Hyundai IONIQ 5: Which Premium EV Should You Buy?",
        slug: "tesla-model-3-highland-vs-hyundai-ioniq-5-comparison",
        excerpt: "Two of the most sought-after premium EVs in India go head-to-head. We compare the Tesla Model 3 Highland and Hyundai IONIQ 5 on range, performance, technology, and ownership costs.",
        cover_images: ["https://cdn.evinfo.in/blogs/tesla-vs-ioniq5-cover.jpg"],
        author_id: adminUser.id,
        categories: ["evs", "technology"],
        tags: ["Tesla", "Hyundai", "IONIQ 5", "Model 3", "comparison", "premium EV"],
        sections: [
          {
            id: "s1",
            heading: "Price Comparison",
            content: "The Tesla Model 3 Long Range starts at Rs. 42.99 lakhs while the IONIQ 5 Standard Range comes in at Rs. 44.15 lakhs. Both are in similar territory, making this a true feature-vs-feature battle.",
            images: [],
            order: 1,
          },
          {
            id: "s2",
            heading: "Charging Technology",
            content: "This is where the IONIQ 5 has a massive edge — Hyundai's 800V architecture supports ultra-fast 220 kW DC charging, bringing the battery from 10% to 80% in just 18 minutes. Tesla's 170 kW charging is still excellent but takes 25 minutes for the same charge window.",
            images: [],
            order: 2,
          },
          {
            id: "s3",
            heading: "Range & Efficiency",
            content: "Tesla Model 3 LR wins on range with 629 km WLTP vs IONIQ 5's 385 km WLTP. However, with ultra-fast charging, the IONIQ 5 can cover more ground in a long trip with shorter stops.",
            images: [],
            order: 3,
          },
          {
            id: "s4",
            heading: "Our Verdict",
            content: "Choose the Tesla Model 3 LR if range anxiety is your primary concern and you want the best-in-class tech ecosystem. Choose the IONIQ 5 if you want ultra-fast charging capability, more interior space, and the innovative V2L feature.",
            images: [],
            order: 4,
          },
        ],
        seo: {
          metaTitle: "Tesla Model 3 vs Hyundai IONIQ 5 2025 Comparison | EVinfo",
          metaDescription: "Detailed comparison between Tesla Model 3 Highland and Hyundai IONIQ 5. Range, charging speed, features, price, and which one to buy.",
          keywords: ["Tesla Model 3 vs IONIQ 5", "premium EV comparison India", "best EV above 40 lakhs"],
        },
        status: "published",
        featured: true,
        published: true,
        published_at: new Date("2025-02-10"),
        created_by: adminUser.id,
      },
      {
        title: "Understanding EV Charging in India: AC vs DC, Connectors & Home Setup Guide",
        slug: "ev-charging-india-guide-2025",
        excerpt: "A complete guide to electric vehicle charging in India — from AC vs DC charging, connector types (CCS2, CHAdeMO, Type 2), home charging setup, and finding public chargers near you.",
        cover_images: ["https://cdn.evinfo.in/blogs/ev-charging-guide-cover.jpg"],
        author_id: adminUser.id,
        categories: ["evs", "technology"],
        tags: ["EV charging", "CCS2", "home charging", "DC fast charge", "charging guide"],
        sections: [
          {
            id: "s1",
            heading: "AC vs DC Charging — What's the Difference?",
            content: "AC (Alternating Current) charging uses your home power supply. It's slower (3-11 kW) but great for overnight charging. DC (Direct Current) fast charging bypasses the onboard charger and delivers power directly to the battery — much faster (50-350 kW).",
            images: [],
            order: 1,
          },
          {
            id: "s2",
            heading: "Connector Types in India",
            content: "Most modern EVs in India use CCS2 (Combined Charging System 2) for DC fast charging and Type 2 for AC charging. Older vehicles may use CHAdeMO. Always check which connectors your vehicle supports before planning a trip.",
            images: [],
            order: 2,
          },
          {
            id: "s3",
            heading: "Setting Up Home Charging",
            content: "A standard 15A socket gives you about 2.4 kW — fine for overnight charging. A dedicated 32A outlet with a 7.2 kW charger is faster and preferred. Most EV brands offer home charger installation as part of the purchase package.",
            images: [],
            order: 3,
          },
        ],
        seo: {
          metaTitle: "EV Charging Guide India 2025 | AC, DC, Connectors | EVinfo",
          metaDescription: "Complete guide to EV charging in India. Learn AC vs DC charging, connector types, home setup, and find public chargers. Updated for 2025.",
          keywords: ["EV charging India", "CCS2 connector", "home EV charging", "DC fast charger India", "electric car charging guide"],
        },
        status: "published",
        featured: false,
        published: true,
        published_at: new Date("2025-03-01"),
        created_by: adminUser.id,
      },
      {
        title: "FAME III Policy Update: What It Means for EV Buyers in 2025",
        slug: "fame-3-policy-update-ev-buyers-2025",
        excerpt: "The Indian government's FAME III scheme is set to replace FAME II with larger subsidies, broader coverage, and new eligibility criteria. Here's everything you need to know as an EV buyer.",
        cover_images: ["https://cdn.evinfo.in/blogs/fame3-cover.jpg"],
        author_id: adminUser.id,
        categories: ["evs", "business"],
        tags: ["FAME III", "EV subsidy", "government policy", "EV India", "2025"],
        sections: [
          {
            id: "s1",
            heading: "What is FAME III?",
            content: "Faster Adoption and Manufacturing of Electric Vehicles (FAME) III is the third phase of India's flagship EV incentive programme. It allocates Rs. 20,000 crore over 3 years to subsidize electric two-wheelers, three-wheelers, buses, and passenger cars.",
            images: [],
            order: 1,
          },
        ],
        seo: {
          metaTitle: "FAME III EV Subsidy India 2025 — Complete Guide | EVinfo",
          metaDescription: "Everything about India's FAME III policy — subsidies, eligibility, how to apply, and impact on EV prices in 2025.",
          keywords: ["FAME III", "EV subsidy India 2025", "electric vehicle policy India"],
        },
        status: "draft",
        featured: false,
        published: false,
        created_by: adminUser.id,
      },
    ],
  });

  console.log(`   ✅ Created 4 blogs (3 published, 1 draft)`);

  // ─────────────────────────────────────────────
  // 10. BANNERS
  // ─────────────────────────────────────────────
  console.log("🖼️  Seeding banners...");

  await prisma.banner.createMany({
    data: [
      {
        title: "Explore India's Best Electric Vehicles",
        slug: "explore-best-evs-india-2025",
        image_url: "https://cdn.evinfo.in/banners/hero-banner-2025.jpg",
        redirect_url: "/sub-variants/get-all",
        position: "HOME_TOP",
        priority: 1,
        status: "active",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
        created_by: superAdmin.id,
      },
      {
        title: "Tesla Model 3 Now in India — Book a Test Drive",
        slug: "tesla-model-3-india-launch-2025",
        image_url: "https://cdn.evinfo.in/banners/tesla-model3-banner.jpg",
        redirect_url: "/sub-variants/slug/tesla-model-3-lr-awd-ev",
        position: "HOME_MIDDLE",
        priority: 2,
        status: "active",
        start_date: new Date("2025-02-01"),
        end_date: new Date("2025-06-30"),
        created_by: superAdmin.id,
      },
      {
        title: "Compare EVs — Find Your Perfect Match",
        slug: "compare-evs-find-your-match",
        image_url: "https://cdn.evinfo.in/banners/compare-ev-banner.jpg",
        redirect_url: "/compare/sub-variants",
        position: "HOME_BOTTOM",
        priority: 3,
        status: "active",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
        created_by: superAdmin.id,
      },
      {
        title: "Tata Nexon EV — India's #1 Best-Selling EV",
        slug: "tata-nexon-ev-bestseller-india",
        image_url: "https://cdn.evinfo.in/banners/nexon-ev-banner.jpg",
        redirect_url: "/sub-variants/slug/tata-nexon-ev-max-ev",
        position: "SIDEBAR",
        priority: 1,
        status: "active",
        start_date: new Date("2025-01-01"),
        end_date: new Date("2025-12-31"),
        created_by: superAdmin.id,
      },
      {
        title: "EV Charging Guide — Everything You Need to Know",
        slug: "ev-charging-guide-popup",
        image_url: "https://cdn.evinfo.in/banners/charging-guide-popup.jpg",
        redirect_url: "/blogs/slug/ev-charging-india-guide-2025",
        position: "POPUP",
        priority: 1,
        status: "inactive",
        start_date: new Date("2025-03-01"),
        end_date: new Date("2025-05-31"),
        created_by: superAdmin.id,
      },
    ],
  });

  console.log(`   ✅ Created 5 banners`);

  // ─────────────────────────────────────────────
  // 11. DEALERS
  // ─────────────────────────────────────────────
  console.log("🏪 Seeding dealers...");

  await prisma.dealer.createMany({
    data: [
      {
        name: "EV World - Andheri West, Mumbai",
        address: "123, Veera Desai Road, Andheri West",
        city: "Mumbai",
        state: "Maharashtra",
        country: "India",
        pincode: "400053",
        phone: "+912266442200",
        email: "andheri@evworld.in",
        website: "https://evworld.in/mumbai-andheri",
        coordinates: { lat: 19.1362, lng: 72.8296 },
        brands: [teslaBrand.id, hyundaiBrand.id],
        services: ["sales", "service", "parts", "test_drive", "financing"],
        rating: 4.5,
        status: "active",
        created_by: superAdmin.id,
      },
      {
        name: "Tata Motors EV Showroom - Connaught Place, Delhi",
        address: "Block A, Connaught Place, New Delhi",
        city: "New Delhi",
        state: "Delhi",
        country: "India",
        pincode: "110001",
        phone: "+911123456789",
        email: "cp@tatamotors.in",
        website: "https://tatamotors.com/dealers/delhi-cp",
        coordinates: { lat: 28.6315, lng: 77.2167 },
        brands: [tataBrand.id],
        services: ["sales", "service", "parts", "test_drive", "financing", "insurance"],
        rating: 4.3,
        status: "active",
        created_by: superAdmin.id,
      },
      {
        name: "MG Motor Authorised Dealer - Koramangala, Bengaluru",
        address: "80 Feet Road, 6th Block, Koramangala",
        city: "Bengaluru",
        state: "Karnataka",
        country: "India",
        pincode: "560095",
        phone: "+918022334455",
        email: "koramangala@mgmotor.in",
        website: "https://mgmotor.co.in/dealers/bengaluru",
        coordinates: { lat: 12.9352, lng: 77.6245 },
        brands: [mgBrand.id],
        services: ["sales", "service", "parts", "test_drive"],
        rating: 4.2,
        status: "active",
        created_by: superAdmin.id,
      },
      {
        name: "Hyundai Star Motors - Anna Nagar, Chennai",
        address: "23, 2nd Avenue, Anna Nagar",
        city: "Chennai",
        state: "Tamil Nadu",
        country: "India",
        pincode: "600040",
        phone: "+914428888888",
        email: "annanagar@hyundaistarmotors.in",
        website: "https://hyundaistarmotors.in",
        coordinates: { lat: 13.0843, lng: 80.2096 },
        brands: [hyundaiBrand.id],
        services: ["sales", "service", "parts", "test_drive", "financing"],
        rating: 4.6,
        status: "active",
        created_by: superAdmin.id,
      },
      {
        name: "EVConnect Service Hub - Baner, Pune",
        address: "Survey No. 123, Baner Road, Baner",
        city: "Pune",
        state: "Maharashtra",
        country: "India",
        pincode: "411045",
        phone: "+912066778899",
        email: "baner@evconnect.in",
        website: "https://evconnect.in/pune",
        coordinates: { lat: 18.5593, lng: 73.7794 },
        brands: [tataBrand.id, mgBrand.id],
        services: ["service", "parts", "financing"],
        rating: 4.0,
        status: "active",
        created_by: superAdmin.id,
      },
      {
        name: "Tesla Authorized Service Center - Gurugram",
        address: "Plot 44, Sector 18, Udyog Vihar",
        city: "Gurugram",
        state: "Haryana",
        country: "India",
        pincode: "122015",
        phone: "+911244567890",
        email: "gurugram@tesla.com",
        website: "https://tesla.com/servicecenter/gurugram",
        coordinates: { lat: 28.5008, lng: 77.0855 },
        brands: [teslaBrand.id],
        services: ["service", "parts", "test_drive"],
        rating: 4.4,
        status: "active",
        created_by: superAdmin.id,
      },
    ],
  });

  console.log(`   ✅ Created 6 dealers across major Indian cities`);

  // ─────────────────────────────────────────────
  // 12. GALLERY (images & videos per entity)
  // ─────────────────────────────────────────────
  console.log("🖼️  Seeding gallery...");

  await prisma.gallery.deleteMany({
    where: {
      OR: [
        { entity_id: { in: [teslaModel3.id, teslaModelY.id, tataNexonEV.id, mgZsEV.id, hyundaiIoniq5.id] } },
        { entity_id: { in: [model3LongRange.id, nexonEVMax.id, mgZsExclusive.id, ioniq5Standard.id] } },
        { entity_id: { in: [svModel3LR.id, svNexonMax.id, svIoniq5Std.id] } },
      ],
    },
  });

  await prisma.gallery.createMany({
    data: [
      // Tesla Model 3 — model-level
      {
        entity_type: "model",
        entity_id: teslaModel3.id,
        media_type: "image",
        category: "exterior",
        url: "https://cdn.evinfo.in/vehicles/model3/ext-front.jpg",
        thumbnail: "https://cdn.evinfo.in/vehicles/model3/ext-front-thumb.jpg",
        title: "Model 3 Highland — Front 3/4",
        order: 1,
        is_primary: true,
        created_by: superAdmin.id,
      },
      {
        entity_type: "model",
        entity_id: teslaModel3.id,
        media_type: "image",
        category: "interior",
        url: "https://cdn.evinfo.in/vehicles/model3/int-dashboard.jpg",
        title: "Minimalist 15.4-inch Dashboard",
        order: 2,
        created_by: superAdmin.id,
      },
      {
        entity_type: "model",
        entity_id: teslaModel3.id,
        media_type: "video",
        category: "walkaround",
        url: "https://cdn.evinfo.in/vehicles/model3/walkaround.mp4",
        thumbnail: "https://cdn.evinfo.in/vehicles/model3/walkaround-thumb.jpg",
        title: "Model 3 Highland Walkaround",
        order: 3,
        created_by: superAdmin.id,
      },

      // Tata Nexon EV — model-level
      {
        entity_type: "model",
        entity_id: tataNexonEV.id,
        media_type: "image",
        category: "exterior",
        url: "https://cdn.evinfo.in/vehicles/nexon-ev/ext-front.jpg",
        title: "Nexon EV — Front",
        order: 1,
        is_primary: true,
        created_by: superAdmin.id,
      },
      {
        entity_type: "model",
        entity_id: tataNexonEV.id,
        media_type: "image",
        category: "side_view",
        url: "https://cdn.evinfo.in/vehicles/nexon-ev/ext-side.jpg",
        title: "Nexon EV — Side Profile",
        order: 2,
        created_by: superAdmin.id,
      },

      // Hyundai IONIQ 5 — model-level
      {
        entity_type: "model",
        entity_id: hyundaiIoniq5.id,
        media_type: "image",
        category: "exterior",
        url: "https://cdn.evinfo.in/vehicles/ioniq5/ext-front.jpg",
        title: "IONIQ 5 — Pixel-art Design Front",
        order: 1,
        is_primary: true,
        created_by: superAdmin.id,
      },
      {
        entity_type: "model",
        entity_id: hyundaiIoniq5.id,
        media_type: "image",
        category: "360",
        url: "https://cdn.evinfo.in/vehicles/ioniq5/360-view.jpg",
        title: "IONIQ 5 — 360° View",
        order: 2,
        created_by: superAdmin.id,
      },

      // Variant-level (color swatches)
      {
        entity_type: "variant",
        entity_id: model3LongRange.id,
        media_type: "image",
        category: "color",
        url: "https://cdn.evinfo.in/vehicles/model3/ultra-red.jpg",
        title: "Ultra Red Color Option",
        order: 1,
        created_by: superAdmin.id,
      },
      {
        entity_type: "variant",
        entity_id: nexonEVMax.id,
        media_type: "image",
        category: "color",
        url: "https://cdn.evinfo.in/vehicles/nexon-ev/fearless-purple.jpg",
        title: "Fearless Purple",
        order: 1,
        created_by: superAdmin.id,
      },

      // Sub-variant-level (detail shots)
      {
        entity_type: "sub_variant",
        entity_id: svModel3LR.id,
        media_type: "image",
        category: "detail",
        url: "https://cdn.evinfo.in/vehicles/model3/wheels-19inch.jpg",
        title: "19-inch Nova Wheels (LR AWD)",
        order: 1,
        created_by: superAdmin.id,
      },
      {
        entity_type: "sub_variant",
        entity_id: svIoniq5Std.id,
        media_type: "image",
        category: "detail",
        url: "https://cdn.evinfo.in/vehicles/ioniq5/v2l-port.jpg",
        title: "V2L Vehicle-to-Load Port",
        order: 1,
        created_by: superAdmin.id,
      },
    ],
  });

  console.log(`   ✅ Created 11 gallery items across models, variants and sub-variants`);

  // ─────────────────────────────────────────────
  // 13. BLOG LINKS (blogs ↔ vehicles)
  // ─────────────────────────────────────────────
  console.log("🔗 Seeding blog links...");

  const seededBlogs = await prisma.blog.findMany({
    where: {
      slug: {
        in: [
          "top-5-evs-under-25-lakhs-india-2025",
          "tesla-model-3-highland-vs-hyundai-ioniq-5-comparison",
          "ev-charging-india-guide-2025",
          "fame-3-policy-update-ev-buyers-2025",
        ],
      },
    },
  });

  const blogBySlug = Object.fromEntries(seededBlogs.map((b) => [b.slug, b.id]));

  await prisma.blogLink.deleteMany({
    where: { blog_id: { in: seededBlogs.map((b) => b.id) } },
  });

  await prisma.blogLink.createMany({
    data: [
      // "Top 5 EVs under 25 lakhs" → links to Tata Nexon EV MAX + MG ZS EV Exclusive
      {
        blog_id: blogBySlug["top-5-evs-under-25-lakhs-india-2025"],
        linked_type: "sub_variant",
        linked_id: svNexonMax.id,
        created_by: adminUser.id,
      },
      {
        blog_id: blogBySlug["top-5-evs-under-25-lakhs-india-2025"],
        linked_type: "sub_variant",
        linked_id: svMgZsExclusive.id,
        created_by: adminUser.id,
      },
      {
        blog_id: blogBySlug["top-5-evs-under-25-lakhs-india-2025"],
        linked_type: "brand",
        linked_id: tataBrand.id,
        created_by: adminUser.id,
      },

      // "Tesla Model 3 vs Hyundai IONIQ 5" → links to both sub-variants + both models
      {
        blog_id: blogBySlug["tesla-model-3-highland-vs-hyundai-ioniq-5-comparison"],
        linked_type: "sub_variant",
        linked_id: svModel3LR.id,
        created_by: adminUser.id,
      },
      {
        blog_id: blogBySlug["tesla-model-3-highland-vs-hyundai-ioniq-5-comparison"],
        linked_type: "sub_variant",
        linked_id: svIoniq5Std.id,
        created_by: adminUser.id,
      },
      {
        blog_id: blogBySlug["tesla-model-3-highland-vs-hyundai-ioniq-5-comparison"],
        linked_type: "model",
        linked_id: teslaModel3.id,
        created_by: adminUser.id,
      },
      {
        blog_id: blogBySlug["tesla-model-3-highland-vs-hyundai-ioniq-5-comparison"],
        linked_type: "model",
        linked_id: hyundaiIoniq5.id,
        created_by: adminUser.id,
      },

      // "EV Charging Guide" → general, link to all EV brands
      {
        blog_id: blogBySlug["ev-charging-india-guide-2025"],
        linked_type: "brand",
        linked_id: teslaBrand.id,
        created_by: adminUser.id,
      },
      {
        blog_id: blogBySlug["ev-charging-india-guide-2025"],
        linked_type: "brand",
        linked_id: hyundaiBrand.id,
        created_by: adminUser.id,
      },
    ],
  });

  console.log(`   ✅ Created 9 blog links connecting blogs to vehicles and brands`);

  // ─────────────────────────────────────────────
  // DONE
  // ─────────────────────────────────────────────
  console.log("\n✅ Seed completed successfully!");
  console.log("─────────────────────────────────────────────");
  console.log("  Superadmin  → superadmin@evinfo.in / Password@123");
  console.log("  Admin       → admin@evinfo.in / Password@123");
  console.log("─────────────────────────────────────────────");
  console.log("  Brands       : 4  (Tesla, Tata, MG, Hyundai)");
  console.log("  Models       : 5  (with timeline events)");
  console.log("  Variants     : 7  (with colors & cover images)");
  console.log("  Sub-Variants : 5  (with ownership info)");
  console.log("  Pricing      : 7  (incl. city-specific records)");
  console.log("  Specs        : 5  (full specs per sub-variant)");
  console.log("  Reviews      : 6  (all approved)");
  console.log("  Blogs        : 4  (3 published, 1 draft)");
  console.log("  Banners      : 5  (4 active, 1 inactive)");
  console.log("  Dealers      : 6  (Mumbai, Delhi, Bengaluru, Chennai, Pune, Gurugram)");
  console.log("  Gallery      : 11 (images & videos: models/variants/sub-variants)");
  console.log("  Blog Links   : 9  (blogs ↔ brands/models/sub-variants)");
  console.log("─────────────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
