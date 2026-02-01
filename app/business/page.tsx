import { Metadata } from "next";
import ClientBusinessList from "./_components/ClientBusinessList";
import { getPaginatedBusinessAction } from "./_meta/actions";

export const metadata: Metadata = {
  title: "مراکز خدمات و رزرو | رزرویتو",
};

export default async function BusinessPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string; query?: string }>;
}) {
  const resolvedParams = await searchParams;

  const { category, page, query } = resolvedParams;

  const response = await getPaginatedBusinessAction({
    page,
    category,
    query,
  });

  const initialData = response.success ? response.data : [];
  const meta = response.success
    ? response.meta
    : { totalPages: 1, currentPage: 1, hasNext: false, hasPrev: false };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <ClientBusinessList
        initialBusinesses={initialData as any}
        initialMeta={meta as any}
        currentParams={{
          category: category || "all",
          query: query || "",
        }}
      />
    </div>
  );
}
