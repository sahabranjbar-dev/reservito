import prisma from "@/utils/prisma";
import { notFound } from "next/navigation";
import React from "react";
import AdminBusinessForm from "../_components/AdminBusinessForm";

interface Props {
  params: Promise<{ id: string }>;
}

const BusinessDetailPage = async ({ params }: Props) => {
  const { id } = await params;

  if (!id) {
    notFound();
  }
  const business = await prisma.business.findUnique({ where: { id } });

  return <AdminBusinessForm businessData={business} />;
};

export default BusinessDetailPage;
