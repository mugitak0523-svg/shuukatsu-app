import { CompanyPriority, CompanyStatus } from "@prisma/client";

import companies from "@/data/companies.json";
import industries from "@/data/industries.json";
import jobTypes from "@/data/job-types.json";

export const COMPANY_STATUS_OPTIONS = [
  { value: CompanyStatus.INTERESTED, label: "気になる" },
  { value: CompanyStatus.APPLIED, label: "応募済み" },
  { value: CompanyStatus.IN_PROGRESS, label: "選考中" },
  { value: CompanyStatus.OFFER, label: "内定" },
  { value: CompanyStatus.REJECTED, label: "落選" },
  { value: CompanyStatus.DECLINED, label: "辞退" },
] as const;

export const COMPANY_PRIORITY_OPTIONS = [
  { value: CompanyPriority.S, label: "S" },
  { value: CompanyPriority.A, label: "A" },
  { value: CompanyPriority.B, label: "B" },
  { value: CompanyPriority.C, label: "C" },
] as const;

export const COMPANY_NAME_OPTIONS = companies;

export const COMPANY_INDUSTRY_OPTIONS = industries;

export const COMPANY_JOB_TYPE_OPTIONS = jobTypes;

export const DEFAULT_COMPANY_COLOR = "#2563EB";

export const COMPANY_COLOR_OPTIONS = [
  "#2563EB",
  "#DC2626",
  "#16A34A",
  "#D97706",
  "#7C3AED",
  "#0891B2",
  "#DB2777",
  "#4F46E5",
  "#65A30D",
  "#EA580C",
  "#0D9488",
  "#9333EA",
] as const;

export function normalizeCompanyColor(color?: string | null) {
  const value = color?.trim().toUpperCase();

  if (!value || !/^#[0-9A-F]{6}$/.test(value)) {
    return DEFAULT_COMPANY_COLOR;
  }

  return value;
}

export function getAvailableCompanyColor(colors: readonly (string | null | undefined)[]) {
  const usedColors = new Set(colors.map(normalizeCompanyColor));
  const presetColor = COMPANY_COLOR_OPTIONS.find((color) => !usedColors.has(color));

  if (presetColor) {
    return presetColor;
  }

  for (let index = 0; index < 360; index += 1) {
    const color = hslToHex((colors.length * 47 + index * 37) % 360, 64, 48);

    if (!usedColors.has(color)) {
      return color;
    }
  }

  return DEFAULT_COMPANY_COLOR;
}

function hslToHex(hue: number, saturation: number, lightness: number) {
  const normalizedSaturation = saturation / 100;
  const normalizedLightness = lightness / 100;
  const chroma =
    (1 - Math.abs(2 * normalizedLightness - 1)) * normalizedSaturation;
  const second = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = normalizedLightness - chroma / 2;
  const [red, green, blue] =
    hue < 60
      ? [chroma, second, 0]
      : hue < 120
        ? [second, chroma, 0]
        : hue < 180
          ? [0, chroma, second]
          : hue < 240
            ? [0, second, chroma]
            : hue < 300
              ? [second, 0, chroma]
              : [chroma, 0, second];

  return `#${[red, green, blue]
    .map((value) =>
      Math.round((value + match) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")
    .toUpperCase()}`;
}

export const COMPANY_STATUS_LABELS = Object.fromEntries(
  COMPANY_STATUS_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CompanyStatus, string>;

export const COMPANY_PRIORITY_LABELS = Object.fromEntries(
  COMPANY_PRIORITY_OPTIONS.map((option) => [option.value, option.label]),
) as Record<CompanyPriority, string>;
