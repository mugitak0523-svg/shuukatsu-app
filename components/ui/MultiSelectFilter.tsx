"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronsUpDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type MultiSelectOption = {
  value: string;
  label: string;
};

type MultiSelectFilterProps = {
  label: string;
  options: readonly (string | MultiSelectOption)[];
  value: string[];
  onValueChange: (value: string[]) => void;
};

export function MultiSelectFilter({
  label,
  onValueChange,
  options,
  value,
}: MultiSelectFilterProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option,
      ),
    [options],
  );
  const selectedValues = new Set(value);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function toggleValue(nextValue: string) {
    if (selectedValues.has(nextValue)) {
      onValueChange(value.filter((current) => current !== nextValue));
      return;
    }

    onValueChange([...value, nextValue]);
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        aria-expanded={open}
        className="flex h-10 w-full cursor-pointer items-center justify-between rounded-md border border-[#e5e5e5] bg-white px-3 text-left text-sm text-[#111111] outline-none transition-colors hover:bg-[#f5f5f5] focus:border-[#111111]"
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">
          {value.length > 0 ? `${label} ${value.length}/${normalizedOptions.length}` : `${label} 全て`}
        </span>
        <ChevronsUpDownIcon className="ml-3 h-4 w-4 text-[#666666]" />
      </button>

      {open ? (
        <div className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-[#e5e5e5] bg-white p-1 shadow-sm">
          <button
            className="block w-full cursor-pointer rounded px-3 py-2 text-left text-sm text-[#999999] hover:bg-[#f5f5f5]"
            type="button"
            onClick={() => onValueChange([])}
          >
            全て
          </button>
          {normalizedOptions.map((option) => {
            const checked = selectedValues.has(option.value);

            return (
              <button
                key={option.value}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded px-3 py-2 text-left text-sm hover:bg-[#f5f5f5]",
                  checked ? "bg-[#f5f5f5] font-medium text-[#111111]" : "text-[#111111]",
                )}
                type="button"
                onClick={() => toggleValue(option.value)}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px]",
                    checked
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-[#d4d4d4] bg-white text-transparent",
                  )}
                >
                  ✓
                </span>
                <span className="truncate">{option.label}</span>
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
