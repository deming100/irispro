import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, format, setHours } from "date-fns";
import "dotenv/config";

const prisma = new PrismaClient();

const TIME_SLOTS = [
  "9:00AM", "10:00AM", "11:00AM", "12:00PM",
  "2:00PM", "3:00PM", "4:00PM", "5:00PM",
];

async function main() {
  console.log("Seeding database...");

  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await prisma.adminUser.upsert({
    where: { email: "admin@irispro.bn" },
    update: {},
    create: {
      email: "admin@irispro.bn",
      password: hashedPassword,
    },
  });
  console.log("✓ Admin user created: admin@irispro.bn / admin123");

  // Create default slot configs
  for (const slot of TIME_SLOTS) {
    const existing = await prisma.slotConfig.findFirst({
      where: { timeSlot: slot, date: null },
    });
    if (!existing) {
      await prisma.slotConfig.create({
        data: { timeSlot: slot, maxCapacity: 3, date: null },
      });
    }
  }
  console.log("✓ Default slot configs created (3 per slot)");

  // Create sample bookings
  const tomorrow = addDays(new Date(), 1);
  const dayAfter = addDays(new Date(), 3);

  const sampleBookings = [
    {
      reference: `IRP-${format(tomorrow, "yyyyMMdd")}-1001`,
      status: "confirmed",
      serviceType: "Automobile Tinting",
      productTier: "DiamondX Series",
      carPlate: "BAA 1234 B",
      carBrand: "Toyota",
      carModel: "Fortuner",
      carType: "SUV",
      carYear: 2022,
      specialNotes: "Has panoramic sunroof",
      appointmentDate: setHours(tomorrow, 9),
      timeSlot: "9:00AM",
      customerName: "Ahmad Rashid",
      customerPhone: "+673 712 3456",
      customerEmail: "ahmad@example.com",
    },
    {
      reference: `IRP-${format(tomorrow, "yyyyMMdd")}-1002`,
      status: "pending",
      serviceType: "Automobile Tinting",
      productTier: "Diamond Series",
      carPlate: "BBB 5678 C",
      carBrand: "Honda",
      carModel: "CR-V",
      carType: "SUV",
      carYear: 2021,
      specialNotes: null,
      appointmentDate: setHours(tomorrow, 10),
      timeSlot: "10:00AM",
      customerName: "Siti Nuraisha",
      customerPhone: "+673 876 5432",
      customerEmail: null,
    },
    {
      reference: `IRP-${format(dayAfter, "yyyyMMdd")}-1003`,
      status: "pending",
      serviceType: "Automobile Tinting",
      productTier: "Elite Series",
      carPlate: "BAC 9012 D",
      carBrand: "Nissan",
      carModel: "X-Trail",
      carType: "SUV",
      carYear: 2023,
      specialNotes: "Existing tint to be removed first",
      appointmentDate: setHours(dayAfter, 14),
      timeSlot: "2:00PM",
      customerName: "Mohd Faiz",
      customerPhone: "+673 234 5678",
      customerEmail: "faiz@example.com",
    },
  ];

  for (const booking of sampleBookings) {
    await prisma.booking.upsert({
      where: { reference: booking.reference },
      update: {},
      create: booking,
    });
  }
  console.log("✓ 3 sample bookings created");

  console.log("\nSeeding complete! 🎉");
  console.log("Admin login: admin@irispro.bn / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
