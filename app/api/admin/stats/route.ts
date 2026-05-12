export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date(now);
  endOfToday.setHours(23, 59, 59, 999);

  const [todayCount, totalCount, pendingCount] = await Promise.all([
    prisma.booking.count({
      where: { appointmentDate: { gte: startOfToday, lte: endOfToday } },
    }),
    prisma.booking.count(),
    prisma.booking.count({ where: { status: "pending" } }),
  ]);

  return NextResponse.json({ todayCount, totalCount, pendingCount });
}
