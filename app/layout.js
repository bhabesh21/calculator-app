import "./globals.css";

export const metadata = {
  title: "Moneta — Personal Finance",
  description: "A calm, clear view of your personal finances.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
