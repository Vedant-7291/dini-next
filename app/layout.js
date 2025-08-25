// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'remixicon/fonts/remixicon.css'
import { CartProvider } from './CartContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SmartDini - Digital Menu",
  description: "Scan. Order. Enjoy. Where Menus Go Digital.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  );
}