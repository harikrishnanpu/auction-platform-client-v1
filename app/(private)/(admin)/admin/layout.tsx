export default function AdminPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const Content = (
    <div
      className={`min-h-screen flex flex-col font-sans transition-colors duration-300 dark:bg-[#0f172a] dark:text-[#f8fafc] bg-[#E9F1FA] text-[#1e293b]`}
    >
      <main className="min-h-screen mb-5 font-sans transition-colors duration-300 bg-gradient-to-b from-blue-200 via-blue-50 to-amber-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-foreground">
        {children}
      </main>
      <div className="pt-5 bg-transparent"></div>
    </div>
  );

  return Content;
}
