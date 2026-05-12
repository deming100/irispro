export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");

  const configs = await prisma.slotConfig.findMany({
    where: date ? { date } : { date: null },
    orderBy: { timeSlot: "asc" },
  });

  return NextResponse.json({ configs });
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


  const body = await request.json();
  const { timeSlot, maxCapacity, date } = body;

  const existing = await prisma.slotConfig.findFirst({
    where: { timeSlot, date: date || null },
  });

  let config;
  if (existing) {
    config = await prisma.slotConfig.update({
      where: { id: existing.id },
      data: { maxCapacity },
    });
  } else {
    config = await prisma.slotConfig.create({
      data: { timeSlot, maxCapacity, date: date || null },
    });
  }

  return NextResponse.json({ config });
}
