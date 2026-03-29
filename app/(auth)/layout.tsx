export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      data-testid="auth-layout"
      className="min-h-screen flex items-center justify-center bg-surface-page p-4"
    >
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
