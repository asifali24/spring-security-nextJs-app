import "./globals.css";

export const metadata = {
  title: "Spring Security Playground",
  description: "Test Spring Security authentication from Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
