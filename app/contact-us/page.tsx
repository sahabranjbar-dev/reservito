import React from "react";
import ContactForm from "./_components/ContactForm";
import Link from "next/link";
import { Mail, MapPin, PhoneOutgoing } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "تماس‌ با ما | رزرویتو",
};

interface Props {
  searchParams: Promise<{ success: boolean }>;
}

const ContactUsPage = async ({ searchParams }: Props) => {
  const { success } = await searchParams;
  return (
    <main className="min-h-screen bg-white text-neutral-900">
      {/* Hero */}
      {!success && (
        <header className="bg-linear-to-r from-indigo-100 to-white border-b">
          <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl md:text-4xl font-extrabold">تماس با ما</h1>
            <p className="mt-4 text-neutral-600">
              هر سوالی دارید یا می‌خواهید دموی رایگان رزرو کنید، از طریق فرم زیر
              با ما در تماس باشید.
            </p>
          </div>
        </header>
      )}

      {/* Contact Form Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <ContactForm />
        </div>
      </section>

      {/* Contact Info */}
      <section className="container mx-auto px-6 py-8 bg-neutral-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">اطلاعات تماس</h2>
        <ul className="text-neutral-600 space-y-2">
          <li className="flex justify-start items-center gap-2">
            <Mail size={16} /> ایمیل:
            <Link href={"mailto:info@reservito.com"}>info@reservito.com</Link>
          </li>
          <li className="flex justify-start items-center gap-2">
            <PhoneOutgoing size={16} /> تلفن:{" "}
            <Link dir="ltr" href={"tel:+989111105440"}>
              ۰۹۱۱ ۱۱۰ ۵۴۴۰
            </Link>
          </li>
          <li className="flex justify-start items-center gap-2">
            <MapPin size={16} /> آدرس: مازندران، بابل
          </li>
        </ul>
      </section>
    </main>
  );
};

export default ContactUsPage;
