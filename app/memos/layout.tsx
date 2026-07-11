import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AppHeader } from "@/components/layout/AppHeader";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function MemosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar user={session.user} />
      <div className="min-w-0 flex-1">
        <AppHeader />
        <main className="min-w-0 flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
