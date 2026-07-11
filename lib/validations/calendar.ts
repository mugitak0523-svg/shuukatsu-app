import { z } from "zod";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const calendarEventSchema = z.object({
  title: z.string().trim().min(1, "タイトルは必須です").max(100),
  startsAt: z.string().trim().min(1),
  endsAt: z.string().trim().min(1),
  allDay: z.boolean().default(false),
  type: z.enum(["EVENT", "TASK", "DEADLINE"]).default("EVENT"),
  completed: z.boolean().default(false),
  companyId: z.preprocess(emptyToUndefined, z.string().trim().optional()),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .transform((value) => value.toUpperCase())
    .default("#2563EB"),
  location: z.preprocess(emptyToUndefined, z.string().trim().max(200).optional()),
  description: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(5000).optional(),
  ),
});
