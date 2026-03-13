export default function UserLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      <main className="flex-1">{children}</main>
    </section>
  );
}
