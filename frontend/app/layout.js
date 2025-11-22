import "./globals.css";

export const metadata = {
  title: "TinyLink",
  description: "URL Shortener"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui" }}>
        {children}
      </body>
    </html>
  );
}
