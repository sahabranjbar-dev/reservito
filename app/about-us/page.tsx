import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  CalendarDays,
  CheckCircle,
  Heart,
  Phone,
  PhoneOutgoing,
  SquareChartGantt,
  Target,
  Users,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

const services = [
  {
    id: "booking",
    title: "سیستم رزرو آنلاین",
    desc: "رزرو نوبت آسان، مدیریت ساعات و یادآوری برای مشتریان و کسب‌وکارها.",
    Icon: Target,
  },
  {
    id: "menu",
    title: "مدیریت منو و خدمات",
    desc: "افزودن، ویرایش و دسته‌بندی خدمات و محصولات با رابط کاربری ساده.",
    Icon: Heart,
  },
  {
    id: "notifications",
    title: "اطلاع‌رسانی و یادآوری",
    desc: "ارسال پیامک/ایمیل برای تایید رزرو و یادآوری قبل از نوبت.",
    Icon: Phone,
  },
];

const team = [
  { id: 1, name: "سحاب رنجبر", role: "بنیان‌گذار / توسعه‌دهندهٔ ارشد" },
];

export const metadata: Metadata = {
  title: "درباره‌ما | رزرو مارکت",
};

export default function AboutUsPage() {
  return (
    <main dir="rtl" className="min-h-screen bg-white text-neutral-900">
      {/* HERO */}
      <section className="bg-linear-to-r from-indigo-100 to-white border-b">
        <div className="container mx-auto px-6 py-12 md:flex md:items-center md:justify-between">
          <div className="max-w-2xl">
            <h1 className="flex justify-start items-center gap-2">
              رزرو مارکت | تجربه‌ی ساده‌ی رزرو
            </h1>
            <p className="mt-4 text-neutral-600">
              ما کمک می‌کنیم مشتریانتان راحت‌تر وقت بگیرند و شما بهتر مدیریت
              کنید. محصولی مختص کسب‌وکارهای کوچک و متوسط که مدیریت نوبت، منو و
              پرداخت را یک‌جا فراهم می‌کند.
            </p>

            <div className="mt-6 flex gap-3">
              <Link href="/business">
                <Button className="shadow-sm" rightIcon={<CalendarDays />}>
                  رزرو نوبت
                </Button>
              </Link>
              <Link href="/contact-us">
                <Button rightIcon={<PhoneOutgoing />} variant="outline">
                  تماس با ما
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:block mt-8 md:mt-0">
            <div className="w-64 h-40 rounded-xl bg-linear-to-tr from-indigo-100 to-indigo-50 shadow-md flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">+۵۰ کسب‌وکار</div>
                <div className="text-sm text-neutral-600">
                  در ایران از سرویس ما استفاده می‌کنند
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION & SERVICES */}
      <section className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <article className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>ماموریت ما</CardTitle>
              <CardDescription>
                آسان‌تر کردن ارتباط میان مشتری و کسب‌وکارها با ابزارهایی که
                واقعا کاربردی و قابل اعتماد باشد.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-600">
                ما به کسب‌وکارها کمک می‌کنیم تا با ساده‌سازی فرایند رزرو، کیفیت
                خدمات و نرخ تبدیل را افزایش دهند. تمرکز ما روی تجربهٔ کاربری و
                گزارش‌دهی عملیاتی است.
              </p>
            </CardContent>
          </Card>
        </article>

        <div className="md:col-span-2 grid gap-6 grid-cols-1 sm:grid-cols-2">
          {services.map((s) => (
            <Card key={s.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="flex gap-4 items-start">
                <div className="shrink-0 p-3 rounded-lg bg-indigo-50">
                  <s.Icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{s.title}</h3>
                  <p className="text-sm text-neutral-600 mt-1">{s.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-neutral-50 py-10">
        <div className="container mx-auto px-6">
          <h2 className="text-2xl font-bold">چطور کار می‌کنیم</h2>
          <p className="text-neutral-600 mt-2">سه قدم ساده تا رزرو موفق</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-indigo-100">
                  <Calendar className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold">انتخاب زمان</h4>
                  <p className="text-sm text-neutral-600">
                    کاربر زمان دلخواه را انتخاب می‌کند.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-indigo-100">
                  <CheckCircle className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold">تایید و یادآوری</h4>
                  <p className="text-sm text-neutral-600">
                    ارسال پیامک/ایمیل برای تایید و یادآوری قبل از نوبت.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-indigo-100">
                  <Users className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h4 className="font-semibold">مدیریت ساده</h4>
                  <p className="text-sm text-neutral-600">
                    کنترل زمان‌بندی، پرسنل و گزارش‌ها از یک پنل واحد.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS & TEAM */}
      <section className="container mx-auto px-6 py-12 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-1 flex flex-col gap-4">
          <div className="rounded-lg bg-indigo-50 p-6 text-center">
            <div className="text-3xl font-bold">+۵۰</div>
            <div className="text-sm text-neutral-600">کسب‌وکار فعال</div>
          </div>

          <div className="rounded-lg bg-indigo-50 p-6 text-center">
            <div className="text-3xl font-bold">+۲۰۰۰</div>
            <div className="text-sm text-neutral-600">رزرو موفق</div>
          </div>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xl font-bold">تیم ما</h3>
          <p className="text-neutral-600 mt-1">
            تیم کوچک، حرفه‌ای و متعهد به کیفیت
          </p>

          <div className="mt-6 grid sm:grid-cols-3 gap-4">
            {team.map((m) => (
              <Card key={m.id} className="flex items-center gap-4 p-4">
                <Avatar>
                  <div className="bg-indigo-200 w-12 h-12 rounded-full">
                    <span className="absolute top-1/2 left-1/2 -translate-1/2">
                      {m.name.split(" ")[0][0]}
                    </span>
                  </div>
                </Avatar>
                <div>
                  <div className="font-medium">{m.name}</div>
                  <div className="text-sm text-neutral-600">{m.role}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS & CTA */}
      <section className="bg-linear-to-r from-white to-indigo-50 py-12">
        <div className="container mx-auto px-6">
          <h3 className="text-xl font-bold">نظرات مشتریان</h3>
          <div className="mt-4 grid sm:grid-cols-2 gap-4">
            <blockquote className="p-6 bg-white rounded-lg shadow">
              <p className="text-neutral-700">
                سرویس رزرو مارکت باعث شد مدیریت نوبت‌ها ساده‌تر بشه و رضایت
                مشتری‌هامون بالا بره.
              </p>
              <footer className="mt-3 text-sm text-neutral-500">
                — آرش، صاحب کلینیک
              </footer>
            </blockquote>

            <blockquote className="p-6 bg-white rounded-lg shadow">
              <p className="text-neutral-700">
                پشتیبانی خوب و رابط کاربری ساده؛ از استفاده این سرویس راضی‌
                هستیم.
              </p>
              <footer className="mt-3 text-sm text-neutral-500">
                — فرناز، سالن زیبایی
              </footer>
            </blockquote>
          </div>

          <div className="mt-8 text-center border-t pt-8">
            <h4 className="text-lg font-bold">
              آماده‌اید کسب‌وکار خود را رشد دهید؟
            </h4>
            <p className="text-neutral-600 mt-2">
              یک دموی رایگان رزرو کنید و ببینید چطور می‌توانیم به شما کمک کنیم.
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <Link target="_blank" href="/business/auth/register">
                <Button rightIcon={<SquareChartGantt />} variant="outline">
                  ثبت‌نام رایگان
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
