import { Footer, Header } from "@/components";
import QueryClientWrapper from "@/container/QueryClientWrapper/QueryClientWrapper";
import SessionWrapper from "@/container/SessionWrapper/SessionWrapper";
import { authOptions } from "@/utils/authOptions";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";
import { ConfirmProvider } from "@/container/ConfirmProvider/ConfirmProvider";

interface Props {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "رزرویتو | reservito",
};

export default async function LocaleLayout({ children }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fa" dir="rtl">
      <body>
        <SessionWrapper session={session}>
          <QueryClientWrapper>
            <ConfirmProvider>
              <Header />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </ConfirmProvider>
          </QueryClientWrapper>
        </SessionWrapper>
        <Toaster
          style={{ fontFamily: "IranSans" }}
          visibleToasts={10}
          closeButton
          richColors
          theme="light"
        />
      </body>
    </html>
  );
}
