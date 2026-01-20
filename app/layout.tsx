import { ReactNode } from "react";
import "./globals.css";

interface Props {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({ children }: Props) {
  return (
    <html lang={"fa"} dir="rtl">
      <body>{children}</body>
    </html>
  );
}
