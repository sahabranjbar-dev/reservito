import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";

import prisma from "@/utils/prisma";
import { authOptions } from "@/utils/authOptions";
import BusinessSettingsForm from "./_components/BusinessSettingsForm";
import { BusinessRole } from "@/constants/enums";

export default async function BusinessSettingPage() {
  const session = await getServerSession(authOptions);
  const businessId = session?.user?.business?.id;

  if (!businessId) notFound();

  // فقط Owner
  if (session.user.business?.businessRole !== BusinessRole.OWNER) {
    notFound();
  }

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: {
      id: true,
      businessName: true,
      ownerName: true,
      description: true,
      address: true,
      businessType: true,
      isActive: true,
      registrationStatus: true,
      identifier: true,
      slug: true,
    },
  });

  if (!business) notFound();

  return <BusinessSettingsForm business={business as any} />;
}
