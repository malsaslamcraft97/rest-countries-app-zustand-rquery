import { useId, useRef, useState } from "react";
import styles from "./Tabs.module.scss";

type Tab = {
  id: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  tabs: Tab[];
  defaultIndex?: number;
};

export function Tabs({ tabs, defaultIndex = 0 }: Props) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId(); // ensures unique ids if multiple tab groups exist

  function moveFocus(nextIndex: number) {
    setActiveIndex(nextIndex);
    tabRefs.current[nextIndex]?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = tabs.length - 1;

    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(index === last ? 0 : index + 1);
        break;

      case "ArrowLeft":
        e.preventDefault();
        moveFocus(index === 0 ? last : index - 1);
        break;

      case "Home":
        e.preventDefault();
        moveFocus(0);
        break;

      case "End":
        e.preventDefault();
        moveFocus(last);
        break;

      default:
        break;
    }
  }

  return (
    <div className={styles.wrapper}>
      {/* Tab list */}
      <div role="tablist" aria-label="Sections" className={styles.tabList}>
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          const tabId = `${uid}-tab-${tab.id}`;
          const panelId = `${uid}-panel-${tab.id}`;

          return (
            <button
              key={tab.id}
              id={tabId}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1} // roving tabindex
              ref={(el) => {
                tabRefs.current[index] = el;
              }}
              onClick={() => moveFocus(index)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={styles.tab}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels */}
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        const tabId = `${uid}-tab-${tab.id}`;
        const panelId = `${uid}-panel-${tab.id}`;

        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId}
            aria-labelledby={tabId}
            hidden={!isActive}
            className={styles.panel}
          >
            {isActive && tab.content}
          </div>
        );
      })}
    </div>
  );
}
