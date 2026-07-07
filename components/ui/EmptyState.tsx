export function EmptyState({ action }: { action?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-[#d4d4d4] bg-white px-6 py-16 text-center">
      <h2 className="text-lg font-semibold text-[#111111]">企業がまだ登録されていません</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-[#666666]">
        最初の企業を追加して、応募状況の管理を始めましょう。
      </p>
      {action}
    </div>
  );
}
