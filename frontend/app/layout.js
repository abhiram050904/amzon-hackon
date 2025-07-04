import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { ThemeProvider } from "@mui/material";
// import Theme from "@/Theme";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Amazon clone",
  description: "E-commerce website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* <ThemeProvider theme={Theme}> */}
        {children}
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
