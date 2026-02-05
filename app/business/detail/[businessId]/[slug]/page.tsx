import { notFound } from "next/navigation";
import ClientBusinessDetail from "./_components/BusinessDetail";
import { getBusinessBySlugAction } from "../../_meta/actions";

interface Props {
  params: Promise<{
    businessId: string;
    slug: string;
  }>;
}

const BusinessPage = async ({ params }: Props) => {
  const { businessId, slug } = await params;

  const response = await getBusinessBySlugAction(businessId);

  if (!response.success || !response.data) {
    notFound();
  }

  const business = response.data;

  const resolvedSlug = decodeURIComponent(slug);

  if (business.slug !== resolvedSlug) {
    notFound();
  }

  return <ClientBusinessDetail business={business as any} />;
};

export default BusinessPage;
