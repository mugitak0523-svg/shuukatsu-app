import { z } from "zod";

export const memoSchema = z.object({
  key: z.string().trim().min(1, "キーを入力してください").max(100),
  value: z.string().trim().min(1, "値を入力してください").max(5000),
});
