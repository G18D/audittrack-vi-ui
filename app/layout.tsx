export const metadata = {
  title: "AuditTrack VI",
  description: "AuditTrack VI — Caribbean UI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
