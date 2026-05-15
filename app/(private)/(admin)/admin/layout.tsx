export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Content = (
    <div className="flex min-h-screen flex-col font-sans text-foreground transition-colors duration-300">
      <main className="bg-app-shell min-h-screen flex-1">{children}</main>
    </div>
  );

  return Content;
}
