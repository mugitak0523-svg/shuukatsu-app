import { HeaderTabSelector } from "@/components/layout/HeaderTabSelector";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-[#e5e5e5] bg-white">
      <div className="flex h-14 items-center justify-between px-4">
        <HeaderTabSelector />
        <div className="hidden md:block" />
      </div>
    </header>
  );
}
