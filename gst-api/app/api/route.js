"use server";

import { NextResponse } from "next/server";

export async function GET() {
  const gstRates = [5, 12, 18, 28];
  const randomIndex = Math.floor(Math.random() * gstRates.length);
  const gstPercentage = gstRates[randomIndex];

  const response = {
    success: true,
    gstPercentage,
    message: `GST percentage fetched successfully: ${gstPercentage}%`,
  };

  return NextResponse.json(response);
}
