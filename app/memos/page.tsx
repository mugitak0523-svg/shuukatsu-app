import { MemosClient } from "@/components/memos/MemosClient";
import { getMemos } from "@/server/queries/memo";

export default async function MemosPage() {
  const memos = await getMemos();

  return (
    <MemosClient
      memos={memos.map((memo) => ({
        id: memo.id,
        key: memo.key,
        value: memo.value,
      }))}
    />
  );
}
