import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/SignInButton";

export default async function SignInPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/companies");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-6">
      <div className="w-full max-w-sm rounded-lg border border-[#e5e5e5] bg-white p-8">
        <p className="text-sm font-semibold text-[#111111]">就活管理</p>
        <h1 className="mt-6 text-2xl font-semibold tracking-normal">ログイン</h1>
        <p className="mt-2 text-sm leading-6 text-[#666666]">
          Googleアカウントで続けて、応募企業を管理します。
        </p>
        <div className="mt-6">
          <SignInButton />
        </div>
      </div>
    </main>
  );
}
