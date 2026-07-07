"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ChevronsUpDownIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";

type DropdownOption = {
  value: string;
  label: string;
};

type DropdownProps = {
  name?: string;
  options: readonly (string | DropdownOption)[];
  defaultValue?: string | null;
  placeholder?: string;
  emptyLabel?: string;
  searchable?: boolean;
  allowCustomValue?: boolean;
  required?: boolean;
  maxLength?: number;
};

export function Dropdown({
  name,
  options,
  defaultValue,
  placeholder = "選択してください",
  emptyLabel,
  searchable,
  allowCustomValue,
  required,
  maxLength,
}: DropdownProps) {
  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string" ? { value: option, label: option } : option,
      ),
    [options],
  );
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue ?? "");
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    normalizedOptions.find((option) => option.value === value)?.label ?? value;
  const query = searchable ? value.trim().toLowerCase() : "";
  const filteredOptions = useMemo(() => {
    const source = query
      ? normalizedOptions.filter(
          (option) =>
            option.label.toLowerCase().includes(query) ||
            option.value.toLowerCase().includes(query),
        )
      : normalizedOptions;

    return source.slice(0, 50);
  }, [normalizedOptions, query]);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  if (searchable || allowCustomValue) {
    return (
      <div ref={rootRef} className="relative">
        <div className="relative">
          <input
            autoComplete="off"
            className="h-10 w-full rounded-md border border-[#e5e5e5] bg-white px-3 pr-9 text-sm text-[#111111] outline-none transition-colors placeholder:text-[#999999] focus:border-[#111111]"
            maxLength={maxLength}
            name={name}
            placeholder={placeholder}
            required={required}
            type="text"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
          />
          <button
            aria-label="候補を開く"
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-[#666666] hover:text-[#111111]"
            type="button"
            onClick={() => setOpen((current) => !current)}
          >
            <ChevronsUpDownIcon className="h-4 w-4" />
          </button>
        </div>
        <DropdownMenu
          emptyLabel={emptyLabel}
          filteredOptions={filteredOptions}
          open={open}
          setOpen={setOpen}
          setValue={setValue}
          value={value}
        />
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      {name ? <input name={name} type="hidden" value={value} /> : null}
      <button
        aria-expanded={open}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-[#e5e5e5] bg-white px-3 text-left text-sm outline-none transition-colors hover:bg-[#f5f5f5] focus:border-[#111111]",
          value ? "text-[#111111]" : "text-[#999999]",
        )}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{selectedLabel || placeholder}</span>
        <ChevronsUpDownIcon className="ml-3 h-4 w-4 text-[#666666]" />
      </button>
      <DropdownMenu
        emptyLabel={emptyLabel}
        filteredOptions={filteredOptions}
        open={open}
        setOpen={setOpen}
        setValue={setValue}
        value={value}
      />
    </div>
  );
}

function DropdownMenu({
  emptyLabel,
  filteredOptions,
  open,
  setOpen,
  setValue,
  value,
}: {
  emptyLabel?: string;
  filteredOptions: DropdownOption[];
  open: boolean;
  setOpen: (open: boolean) => void;
  setValue: (value: string) => void;
  value: string;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-md border border-[#e5e5e5] bg-white p-1 shadow-sm">
      {emptyLabel ? (
        <button
          className="block w-full rounded px-3 py-2 text-left text-sm text-[#999999] hover:bg-[#f5f5f5]"
          type="button"
          onClick={() => {
            setValue("");
            setOpen(false);
          }}
        >
          {emptyLabel}
        </button>
      ) : null}
      {filteredOptions.length > 0 ? (
        filteredOptions.map((option) => (
          <button
            key={option.value}
            className={cn(
              "block w-full rounded px-3 py-2 text-left text-sm hover:bg-[#f5f5f5]",
              value === option.value
                ? "bg-[#f5f5f5] font-medium text-[#111111]"
                : "text-[#111111]",
            )}
            type="button"
            onClick={() => {
              setValue(option.value);
              setOpen(false);
            }}
          >
            {option.label}
          </button>
        ))
      ) : (
        <div className="px-3 py-2 text-sm text-[#999999]">候補なし</div>
      )}
    </div>
  );
}
