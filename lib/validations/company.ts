import { CompanyPriority, CompanyStatus } from "@prisma/client";
import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const colorSchema = z
  .string()
  .trim()
  .regex(/^#[0-9A-Fa-f]{6}$/, "色はHEX形式で選択してください")
  .transform((value) => value.toUpperCase());

export const companySchema = z.object({
  name: z.string().trim().min(1, "企業名は必須です").max(100),
  industry: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(100).optional(),
  ),
  jobType: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(100).optional(),
  ),
  status: z.nativeEnum(CompanyStatus).default(CompanyStatus.INTERESTED),
  priority: z.preprocess(emptyToUndefined, z.nativeEnum(CompanyPriority).optional()),
  color: colorSchema.default("#2563EB"),
  mypageId: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  mypageUrl: z.preprocess(
    emptyToUndefined,
    z.string().trim().url("URL形式で入力してください").optional(),
  ),
  memo: z.preprocess(emptyToUndefined, z.string().trim().max(5000).optional()),
});

export type CompanyInput = z.infer<typeof companySchema>;
