"use client";

import { useState } from "react";

type ColorPickerProps = {
  name: string;
  defaultValue: string;
};

export function ColorPicker({ defaultValue, name }: ColorPickerProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="flex h-10 items-center gap-3 rounded-md border border-[#e5e5e5] bg-white px-3">
      <input
        aria-label="色を選択"
        className="h-6 w-6 cursor-pointer rounded border-0 bg-transparent p-0"
        name={name}
        type="color"
        value={value}
        onChange={(event) => setValue(event.target.value.toUpperCase())}
      />
      <span className="text-sm text-[#111111]">{value}</span>
    </div>
  );
}
