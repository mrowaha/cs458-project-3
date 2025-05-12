"use client";
import "./globals.css";
import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.light.compact.css";

import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <meta />
      <body>
        <div
          // centering div
          style={{
            height: "100dvh",
            width: "100%",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <SessionProvider>{children}</SessionProvider>
        </div>
      </body>
    </html>
  );
}
