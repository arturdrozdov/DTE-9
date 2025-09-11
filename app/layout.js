import "./globals.css";

import { DM_Sans } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],  // choose the character subset you need
  weight: ["400", "500", "700"], // choose font weights
  display: "swap", // recommended
});

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={dmSans.className}
      >
        {children}
      </body>
    </html>
  );
}
