
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Student Results Management System | MIU",
    template: "%s | MIU Results Management System",
  },
  description:
    "Mewar International University Student Results Management System for managing academic records, course registrations, and student results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
