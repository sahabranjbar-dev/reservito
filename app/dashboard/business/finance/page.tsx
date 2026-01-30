import { redirect } from "next/navigation";
import React from "react";

const BusinessDashboardFinance = () => {
  return redirect("/dashboard/business/finance/summary");
};

export default BusinessDashboardFinance;
