
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "NFT Gateway Pi Network",
  description: "Marketplace dan lelang aset Pi Network",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
