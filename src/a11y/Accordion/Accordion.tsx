import { useState } from "react";
import styles from "./Accordion.module.scss";

type Item = {
  id: string;
  title: string;
  content: React.ReactNode;
};

type Props = {
  items: Item[];
};

export function Accordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(index: number) {
    setOpenIndex((prev) => (prev === index ? null : index));
  }

  return (
    <div className={styles.wrapper}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div key={item.id} className={styles.item}>
            {/* HEADER BUTTON */}
            <button
              className={styles.header}
              aria-expanded={isOpen}
              aria-controls={`panel-${item.id}`}
              id={`accordion-${item.id}`}
              onClick={() => toggle(index)}
            >
              {item.title}
              <span className={styles.icon}>{isOpen ? "−" : "+"}</span>
            </button>

            {/* CONTENT PANEL */}
            <div
              id={`panel-${item.id}`}
              role="region"
              aria-labelledby={`accordion-${item.id}`}
              hidden={!isOpen}
              className={styles.panel}
            >
              {item.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}
