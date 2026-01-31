import { notFound } from "next/navigation";
import { getBusinessBySlugAction } from "../_meta/actions";
import ClientBusinessDetail from "./_components/BusinessDetail";

interface Props {
  params: Promise<{ slug: string[] }>;
}

const BusinessPage = async ({ params }: Props) => {
  const { slug } = await params;
  const id = slug?.[0];

  const response = await getBusinessBySlugAction(id);
  if (!response.success || !response.data) {
    notFound();
  }

  return <ClientBusinessDetail business={response.data as any} />;
};

export default BusinessPage;
