import React from "react";
import { getProductsWithAvailability } from "@/lib/db";
import CheckoutClient from "@/components/CheckoutClient";

export const dynamic = "force-dynamic";

interface CheckoutPageProps {
  searchParams: Promise<{
    motor?: string;
    start?: string;
    end?: string;
  }>;
}

export default async function CheckoutPage({
  searchParams,
}: CheckoutPageProps) {
  const resolvedParams = await searchParams;

  const today = new Date();
  const defaultEnd = new Date();
  defaultEnd.setDate(today.getDate() + 2);

  const startDate =
    resolvedParams.start && resolvedParams.start.length === 10
      ? resolvedParams.start
      : today.toISOString().slice(0, 10);

  const endDate =
    resolvedParams.end && resolvedParams.end.length === 10
      ? resolvedParams.end
      : defaultEnd.toISOString().slice(0, 10);

  const initialProducts = getProductsWithAvailability(startDate, endDate);
  const validSlugs = initialProducts.map((p) => p.slug);
  const initialMotorSlug =
    resolvedParams.motor && validSlugs.includes(resolvedParams.motor)
      ? resolvedParams.motor
      : "volta-401";

  return (
    <CheckoutClient
      initialProducts={initialProducts}
      initialMotorSlug={initialMotorSlug}
      initialStartDate={startDate}
      initialEndDate={endDate}
    />
  );
}

