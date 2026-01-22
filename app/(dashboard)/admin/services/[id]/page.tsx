import React from "react";
import ServiceForm from "../_components/ServiceForm";
import prisma from "@/utils/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

const ServiceEditFormPage = async ({ params }: Props) => {
  const { id } = await params;

  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      calendarRules: true,
      reservations: true,
      workingHours: true,
    },
  });

  if (!service) return null;

  return <ServiceForm defaultValues={service} />;
};

export default ServiceEditFormPage;
