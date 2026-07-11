import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { SignInButton } from "@/components/auth/SignInButton";
import { buttonClasses } from "@/components/ui/Button";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/calendar");
  }

  return (
    <main className="min-h-screen bg-white">
      <header className="flex h-16 items-center justify-between border-b border-[#e5e5e5] px-6">
        <Link className="text-sm font-semibold" href="/">
          就活管理
        </Link>
        <Link className={buttonClasses({ variant: "secondary" })} href="/signin">
          ログイン
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[1fr_520px] lg:items-center">
        <div>
          <p className="text-sm font-medium text-[#666666]">企業応募管理ツール</p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-normal text-[#111111] sm:text-5xl">
            就活の応募企業を，シンプルに一元管理．
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-[#666666]">
            Googleでログインして、自分専用の企業リスト、選考ステータス、志望度を管理できます。
          </p>
          <div className="mt-8">
            <SignInButton />
          </div>
        </div>

        <div className="rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-4">
          <div className="rounded-md border border-[#e5e5e5] bg-white">
            <div className="border-b border-[#e5e5e5] px-4 py-3">
              <p className="text-sm font-medium">企業一覧</p>
            </div>
            <div className="divide-y divide-[#f0f0f0]">
              {[
                ["丸紅", "選考中", "S"],
                ["サイバーエージェント", "応募済み", "A"],
                ["東レ", "気になる", "B"],
              ].map(([name, status, priority]) => (
                <div key={name} className="grid grid-cols-[1fr_80px_40px] items-center gap-4 px-4 py-3 text-sm">
                  <span className="font-medium">{name}</span>
                  <span className="rounded-full border border-[#e5e5e5] px-2 py-0.5 text-center text-xs">
                    {status}
                  </span>
                  <span className="rounded-full border border-[#e5e5e5] px-2 py-0.5 text-center text-xs">
                    {priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
