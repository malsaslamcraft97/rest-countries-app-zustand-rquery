import { useEffect, useRef, useState } from "react";
import styles from "./Combobox.module.scss";

type Props = {
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
};

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select...",
  loading = false,
}: Props) {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Filter options
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(query.toLowerCase()),
  );

  const activeId =
    highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0) {
      const el = document.getElementById(`option-${highlightedIndex}`);
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  function handleKeyDown(e: React.KeyboardEvent) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filtered.length - 1 ? prev + 1 : 0,
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filtered.length - 1,
        );
        break;

      case "Enter":
        if (highlightedIndex >= 0) {
          e.preventDefault();
          selectOption(filtered[highlightedIndex]);
        }
        break;

      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }

  function selectOption(option: string) {
    setQuery(option);
    setIsOpen(false);
    setHighlightedIndex(-1);
    onChange?.(option);
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <input
        ref={inputRef}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
          setHighlightedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="combobox-list"
        aria-activedescendant={activeId}
        className={styles.input}
      />

      {isOpen && (
        <ul
          ref={listRef}
          id="combobox-list"
          role="listbox"
          className={styles.list}
        >
          {loading && <li className={styles.status}>Loading...</li>}

          {!loading && filtered.length === 0 && (
            <li className={styles.status}>No results</li>
          )}

          {!loading &&
            filtered.map((option, index) => (
              <li
                key={option}
                id={`option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`${styles.option} ${
                  highlightedIndex === index ? styles.active : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent blur
                  selectOption(option);
                }}
              >
                {option}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
