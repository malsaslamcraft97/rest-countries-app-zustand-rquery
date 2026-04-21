import { useEffect, useState } from "react";

type Props = {
  message: string;
  type?: "polite" | "assertive";
};

export function LiveRegion({ message, type = "polite" }: Props) {
  const [announcement, setAnnouncement] = useState("");

  useEffect(() => {
    if (message) {
      setAnnouncement("");

      // small delay ensures screen reader re-announces
      const timeout = setTimeout(() => {
        setAnnouncement(message);
      }, 50);

      return () => clearTimeout(timeout);
    }
  }, [message]);

  return (
    <div
      aria-live={type}
      style={{
        position: "absolute",
        width: "1px",
        height: "1px",
        overflow: "hidden",
        clip: "rect(0 0 0 0)",
      }}
    >
      {announcement}
    </div>
  );
}
