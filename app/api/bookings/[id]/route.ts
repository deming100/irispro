export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { status } = body;

  if (!["pending", "confirmed", "completed", "cancelled"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json({ booking });
  } catch {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
}
