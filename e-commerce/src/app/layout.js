import localFont from "next/font/local";
import "./globals.css";
import Nav from "@/components/Nav";
import { ThemeProvider } from "@/components/theme-provider";
import { SavedItemsProvider } from "@/context/SavedItems";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Comic E-commerce",
  description: "This is a portfolio project that displays multiple comics for e-commerce",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SavedItemsProvider>
          <Nav />
          {children}
          </SavedItemsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
