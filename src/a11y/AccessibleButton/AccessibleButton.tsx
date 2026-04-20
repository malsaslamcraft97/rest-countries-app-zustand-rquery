import React from "react";
import styles from "./AccessibleButton.module.scss";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  ariaLabel?: string;
  type?: "button" | "submit" | "reset";
};

export function AccessibleButton({
  children,
  onClick,
  isLoading = false,
  disabled = false,
  ariaLabel,
  type = "button",
}: Props) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      className={styles.button}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={ariaLabel}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? "Loading..." : children}
    </button>
  );
}
