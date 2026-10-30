import { NextResponse } from "next/server";
import { verifyAdminPin } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const pin = body.pin || "";

    if (!verifyAdminPin(pin)) {
      return NextResponse.json(
        { success: false, message: "PIN Admin tidak valid." },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Otorisasi Admin berhasil.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Terjadi kesalahan server.";
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

