import { useEffect, useId, useRef, useState } from "react";
import styles from "./Combobox.module.scss";
import { useDebounce } from "../../hooks/useDebounce";
import { highlightMatch } from "../../utils/highlightMatch";

type Props = {
  options: string[];
  value?: string; // input value
  onInputChange?: (value: string) => void;
  onSelect?: (value: string) => void;
  placeholder?: string;
  loading?: boolean;
};

export function Combobox({
  options,
  value,
  onInputChange,
  onSelect,
  placeholder = "Select...",
  loading = false,
}: Props) {
  const [query, setQuery] = useState(value || "");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const listId = useId(); // avoids duplicate IDs
  const debouncedQuery = useDebounce(query, 300);

  // Sync controlled value
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value);
    }
  }, [value]);

  // Filter options
  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(debouncedQuery.toLowerCase()),
  );

  const activeId =
    highlightedIndex >= 0 ? `${listId}-option-${highlightedIndex}` : undefined;

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
        setHighlightedIndex(-1);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (highlightedIndex >= 0) {
      const el = document.getElementById(
        `${listId}-option-${highlightedIndex}`,
      );
      el?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex, listId]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (filtered.length === 0) return;

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
    onSelect?.(option);
  }

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <input
        ref={inputRef}
        value={query}
        placeholder={placeholder}
        onChange={(e) => {
          const val = e.target.value;

          setQuery(val);
          setIsOpen(true);
          setHighlightedIndex(-1);

          onInputChange?.(val);

          // Optional UX: clear selection when user edits
          if (!val) {
            onSelect?.("");
          }
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-activedescendant={activeId}
        aria-autocomplete="list"
        className={styles.input}
      />

      {isOpen && (
        <ul id={listId} role="listbox" className={styles.list}>
          {loading && <li className={styles.status}>Loading...</li>}

          {!loading && filtered.length === 0 && (
            <li className={styles.status}>No results</li>
          )}

          {!loading &&
            filtered.map((option, index) => (
              <li
                key={option}
                id={`${listId}-option-${index}`}
                role="option"
                aria-selected={highlightedIndex === index}
                className={`${styles.option} ${
                  highlightedIndex === index ? styles.active : ""
                }`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault(); // prevent input blur
                  selectOption(option);
                }}
              >
                {highlightMatch(option, debouncedQuery)}
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
