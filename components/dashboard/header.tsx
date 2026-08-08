type HeaderProps = {
  email: string;
};

export function Header({ email }: HeaderProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-8 py-5">
      <div>
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <p className="text-gray-500">Welcome back, {email}</p>
      </div>
    </header>
  );
}
