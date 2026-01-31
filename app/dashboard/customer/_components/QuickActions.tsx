import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  const actions = [
    {
      title: "رزرو جدید",
      description: "یک نوبت جدید رزرو کنید",
      icon: Calendar,
      color: "bg-indigo-100 text-indigo-600",
      href: "/business",
      target: "_blank",
    },
    {
      title: "نوبت‌های پیش رو",
      description: "مشاهده نوبت‌های آینده",
      icon: Clock,
      color: "bg-emerald-100 text-emerald-600",
      href: "/dashboard/customer/bookings/active",
    },
    // {
    //   title: "علاقه‌مندی‌ها",
    //   description: "کسب‌وکارهای مورد علاقه",
    //   icon: Star,
    //   color: "bg-amber-100 text-amber-600",
    //   href: "/dashboard/customer/favorites",
    // },
    // {
    //   title: "جستجوی نزدیک",
    //   description: "کسب‌وکارهای اطراف",
    //   icon: MapPin,
    //   color: "bg-rose-100 text-rose-600",
    //   href: "/business?nearby=true",
    // },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">اقدامات سریع</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => (
          <Link
            target={action?.target}
            key={action.title}
            href={action.href}
            className="group block p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className={`p-3 rounded-full ${action.color} mb-3`}>
                <action.icon className="h-6 w-6" />
              </div>
              <h3 className="font-medium text-gray-900 group-hover:text-indigo-600">
                {action.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">{action.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
