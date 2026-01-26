import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { BusinessType } from "@/constants/enums";
import { businessTypeLabelsFa } from "../_meta/utils";
import clsx from "clsx";
import { Activity } from "react";

type Business = {
  id: string;
  slug: string;
  businessName: string;
  description: string | null;
  address: string | null;
  banner: string | null;
  logo: string | null;
  businessType: BusinessType;
  allowOfflinePayment: boolean;
  allowOnlinePayment: boolean;
};

const BusinessCard = ({ business }: { business: Business }) => {
  const businessType = businessTypeLabelsFa[business.businessType];

  const imgUrl =
    business.banner && business.banner.startsWith("http")
      ? business.banner
      : "/images/placeholder.png";

  return (
    <Link
      href={`/business/${business.id}/${business.slug}`}
      className="group block bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-300 border border-slate-100 overflow-hidden"
    >
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <Image
          src={imgUrl}
          alt={business.businessName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-60" />
        {business.logo && (
          <div className="absolute bottom-0 left-4 translate-y-1/2">
            <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-md">
              <Image
                src={business.logo}
                alt="Logo"
                width={100}
                height={100}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      <div className="p-5 pt-8">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {business.businessName}
          </h3>
          {/* <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg text-amber-700 font-bold text-xs border border-amber-100">
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
            <span>4.8</span>
          </div> */}
        </div>

        {business.address && (
          <div className="flex items-start gap-2 mb-4">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">
              {business.address}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex gap-4">
            <Activity mode={business.allowOnlinePayment ? "visible" : "hidden"}>
              <span
                className={clsx("text-xs text-slate-400 font-medium", {
                  "line-through": !business?.allowOnlinePayment,
                })}
              >
                پرداخت آنلاین
              </span>
            </Activity>

            <Activity
              mode={business?.allowOfflinePayment ? "visible" : "hidden"}
            >
              <span className={"text-xs text-slate-400 font-medium"}>
                پرداخت در محل
              </span>
            </Activity>
          </div>
          <div className="border p-2 rounded-2xl bg-slate-100 inline-block text-sm">
            <span className="text-primary">{businessType}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
