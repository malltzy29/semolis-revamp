import React from "react";
import { getProductsWithAvailability } from "@/lib/db";
import CheckoutClient from "@/components/CheckoutClient";

export default function CheckoutPage() {
  const today = new Date();
  const defaultEnd = new Date();
  defaultEnd.setDate(today.getDate() + 2);

  const startDate = today.toISOString().slice(0, 10);
  const endDate = defaultEnd.toISOString().slice(0, 10);
  const initialProducts = getProductsWithAvailability(startDate, endDate);

  return (
    <CheckoutClient
      initialProducts={initialProducts}
      initialMotorSlug="volta-401"
      initialStartDate={startDate}
      initialEndDate={endDate}
    />
  );
}
