export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { getServerSession } from "next-auth";

function generateReference(date: Date): string {
  const dateStr = format(date, "yyyyMMdd");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `IRP-${dateStr}-${random}`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    serviceType, productTier, carPlate, carBrand, carModel, carType,
    carYear, specialNotes, appointmentDate, timeSlot,
    customerName, customerPhone, customerEmail,
  } = body;

  if (!serviceType || !productTier || !carPlate || !carBrand || !carModel ||
    !carType || !appointmentDate || !timeSlot || !customerName || !customerPhone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const dateObj = new Date(appointmentDate);
  const startOfDay = new Date(dateObj);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(dateObj);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      const existingCount = await tx.booking.count({
        where: {
          appointmentDate: { gte: startOfDay, lte: endOfDay },
          timeSlot,
          status: { not: "cancelled" },
        },
      });

      const dateStr = format(dateObj, "yyyy-MM-dd");
      const specificConfig = await tx.slotConfig.findFirst({
        where: { date: dateStr, timeSlot },
      });
      const defaultConfig = await tx.slotConfig.findFirst({
        where: { date: null, timeSlot },
      });
      const maxCapacity = specificConfig?.maxCapacity ?? defaultConfig?.maxCapacity ?? 3;

      if (existingCount >= maxCapacity) {
        throw new Error("SLOT_FULL");
      }

      const reference = generateReference(dateObj);
      const newBooking = await tx.booking.create({
        data: {
          reference, serviceType, productTier, carPlate, carBrand, carModel,
          carType, carYear: carYear ? parseInt(carYear) : null,
          specialNotes: specialNotes || null,
          appointmentDate: dateObj, timeSlot,
          customerName, customerPhone, customerEmail: customerEmail || null,
          status: "pending",
        },
      });

      return newBooking;
    });

    console.log(
      `Booking confirmed for ${customerName}, ${carPlate}, ${format(dateObj, "dd MMM yyyy")} at ${timeSlot}. Reference: ${booking.reference}`
    );

    return NextResponse.json({ booking }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "SLOT_FULL") {
      return NextResponse.json({ error: "This time slot is now fully booked." }, { status: 409 });
    }
    console.error(error);
    return NextResponse.json({ error: "Failed to create booking" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};

  if (date) {
    const dateObj = new Date(date);
    const startOfDay = new Date(dateObj);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(dateObj);
    endOfDay.setHours(23, 59, 59, 999);
    where.appointmentDate = { gte: startOfDay, lte: endOfDay };
  }

  if (status) {
    where.status = status;
  }

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
