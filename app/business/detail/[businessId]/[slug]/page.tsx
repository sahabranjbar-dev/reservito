import Link from "next/link";
import { getBusinessBySlugAction } from "../../_meta/actions";
import ClientBusinessDetail from "./_components/BusinessDetail";

interface Props {
  params: {
    businessId: string;
    slug: string;
  };
}
const BusinessPage = async ({ params }: Props) => {
  const { businessId, slug } = params;
  console.log({ businessId, slug });

  const response = await getBusinessBySlugAction(businessId);
  console.log({ response });

  // اگر خطا بود، کامپوننت ارور نشون بده
  if (!response.success) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <h1 className="text-4xl font-bold text-rose-600 mb-4">
          خطا در بارگذاری
        </h1>
        <p className="text-slate-600 mb-6">
          {response.error || "کسب‌وکار یافت نشد."}
        </p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  const business = response.data;
  console.log({ business });

  // بررسی اسلاگ
  const resolvedSlug = decodeURIComponent(slug);

  console.log({ resolvedSlug });

  if (business?.slug !== resolvedSlug) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
        <h1 className="text-4xl font-bold text-rose-600 mb-4">
          آدرس اشتباه است
        </h1>
        <p className="text-slate-600 mb-6">لینکی که وارد کردید معتبر نیست.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
        >
          بازگشت به صفحه اصلی
        </Link>
      </div>
    );
  }

  return <ClientBusinessDetail business={business as any} />;
};

export default BusinessPage;
