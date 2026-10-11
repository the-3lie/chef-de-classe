"use client";

import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { useChefUser, useRequireAuth } from "@/providers/UserProvider";
import { Spinner } from "@/components/ui/primitives";

export default function ChefClasseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useChefUser();
  useRequireAuth();

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col">
      <Header />
      <main className="flex-1 px-5 pb-28 pt-2">{children}</main>
      <BottomNav />
    </div>
  );
}
