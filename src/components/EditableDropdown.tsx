"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Plus } from "lucide-react";

type Props = {
  value: string;
  options: string[];
  placeholder?: string;
  invalid?: boolean;
  warning?: boolean;
  onChange: (value: string) => void;
  onAddOption: (value: string) => void;
  disabled?: boolean;
};

export default function EditableDropdown({
  value,
  options,
  placeholder = "Choose an option",
  invalid = false,
  warning = false,
  onChange,
  onAddOption,
  disabled = false,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchText("");
        setIsTyping(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayedInputValue = isTyping ? searchText : value;

  const filteredOptions = useMemo(() => {
    if (!isOpen) return [];

    const query = searchText.trim().toLowerCase();

    if (!isTyping || !query) {
      return options;
    }

    return options.filter((option) => option.toLowerCase().includes(query));
  }, [isOpen, isTyping, searchText, options]);

  const trimmedSearch = searchText.trim();

  const canAdd =
    isTyping &&
    trimmedSearch !== "" &&
    !options.some(
      (option) => option.toLowerCase() === trimmedSearch.toLowerCase(),
    );

  return (
    <div ref={containerRef} className="relative">
      <div
        className={[
          "flex w-full items-center gap-2 rounded-xl border bg-zinc-950 px-3 py-2 text-sm",
          invalid
            ? "border-red-500 focus-within:border-red-400"
            : warning
              ? "border-amber-700 bg-amber-950/30 focus-within:border-amber-500"
            : "border-zinc-700 focus-within:border-zinc-500",
          disabled ? "opacity-60" : "",
        ].join(" ")}
      >
        <input
          type="text"
          value={displayedInputValue}
          disabled={disabled}
          placeholder={invalid ? "" : placeholder}
          onFocus={() => {
            setIsOpen(true);
          }}
          onChange={(e) => {
            setSearchText(e.target.value);
            setIsTyping(true);
            setIsOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();

              const typed = searchText.trim();

              if (!typed) return;

              const exactMatch = options.find(
                (option) => option.toLowerCase() === typed.toLowerCase(),
              );

              if (exactMatch) {
                onChange(exactMatch);
                setSearchText("");
                setIsTyping(false);
                setIsOpen(false);
                return;
              }

              if (canAdd) {
                onAddOption(typed);
                onChange(typed);
                setSearchText("");
                setIsTyping(false);
                setIsOpen(false);
              }
            }

            if (e.key === "Escape") {
              setSearchText("");
              setIsTyping(false);
              setIsOpen(false);
            }
          }}
          className={[
            "flex-1 bg-transparent text-white outline-none",
            warning ? "placeholder:text-amber-300/40" : "placeholder:text-zinc-500",
          ].join(" ")}
        />

        <button
          type="button"
          disabled={disabled || !canAdd}
          onClick={() => {
            const newValue = searchText.trim();
            if (!newValue) return;

            onAddOption(newValue);
            onChange(newValue);
            setSearchText("");
            setIsTyping(false);
            setIsOpen(false);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-300 transition hover:border-zinc-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          aria-label="Add option"
          title="Add option"
        >
          <Plus size={14} />
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => {
            setIsOpen((prev) => !prev);
            setSearchText("");
            setIsTyping(false);
          }}
          className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-300 transition hover:text-white"
          aria-label="Toggle options"
          title="Toggle options"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      {isOpen ? (
        <div className="absolute z-20 mt-2 max-h-64 w-full overflow-auto rounded-xl border border-zinc-700 bg-zinc-950 shadow-2xl">
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isSelected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setSearchText("");
                    setIsTyping(false);
                    setIsOpen(false);
                  }}
                  className={[
                    "block w-full px-4 py-2 text-left text-sm transition",
                    isSelected
                      ? "bg-zinc-800 text-white"
                      : "text-zinc-200 hover:bg-zinc-900",
                  ].join(" ")}
                >
                  {option}
                </button>
              );
            })
          ) : (
            <div className="px-4 py-3 text-sm text-zinc-500">No matches</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
