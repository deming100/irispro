export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { TIME_SLOTS } from "@/lib/constants";
import { isBefore } from "date-fns";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  // Build UTC-equivalent boundaries for the given Brunei date (UTC+8)
  const BRUNEI_MS = 8 * 60 * 60 * 1000;
  const [y, m, d] = date.split("-").map(Number);
  const startOfDay = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0) - BRUNEI_MS);
  const endOfDay = new Date(Date.UTC(y, m - 1, d, 23, 59, 59, 999) - BRUNEI_MS);

  const bookings = await prisma.booking.findMany({
    where: {
      appointmentDate: { gte: startOfDay, lte: endOfDay },
      status: { not: "cancelled" },
    },
    select: { timeSlot: true },
  });

  const bookingCounts: Record<string, number> = {};
  for (const b of bookings) {
    bookingCounts[b.timeSlot] = (bookingCounts[b.timeSlot] || 0) + 1;
  }

  const defaultConfig = await prisma.slotConfig.findMany({
    where: { date: null },
  });

  const dateConfig = await prisma.slotConfig.findMany({
    where: { date },
  });

  // Use Brunei time (UTC+8)
  const nowUtc = new Date();
  const bruneiOffset = 8 * 60;
  const nowBrunei = new Date(nowUtc.getTime() + bruneiOffset * 60 * 1000);
  const todayBrunei = nowBrunei.toISOString().slice(0, 10);
  const isToday = todayBrunei === date;

  const slots = TIME_SLOTS.map((slot) => {
    const specificConfig = dateConfig.find((c) => c.timeSlot === slot);
    const defaultCfg = defaultConfig.find((c) => c.timeSlot === slot);
    const maxCapacity = specificConfig?.maxCapacity ?? defaultCfg?.maxCapacity ?? 3;
    const count = bookingCounts[slot] || 0;

    let isPast = false;
    if (isToday) {
      const [time, period] = slot.match(/(\d+:\d+)([AP]M)/)!.slice(1);
      const [hours, minutes] = time.split(":").map(Number);
      const slotHour = period === "PM" && hours !== 12 ? hours + 12 : period === "AM" && hours === 12 ? 0 : hours;
      const slotTimeBrunei = new Date(nowUtc.getTime() + bruneiOffset * 60 * 1000);
      slotTimeBrunei.setUTCHours(slotHour - 8, minutes, 0, 0);
      isPast = isBefore(slotTimeBrunei, nowUtc);
    }

    return {
      slot,
      count,
      maxCapacity,
      available: count < maxCapacity && !isPast,
      isPast,
    };
  });

  return NextResponse.json({ slots });
}
