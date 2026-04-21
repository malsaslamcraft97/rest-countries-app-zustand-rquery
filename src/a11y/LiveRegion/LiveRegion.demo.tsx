import { useState } from "react";
import { LiveRegion } from "./LiveRegion";

export function LiveRegionDemo() {
  const [announcement, setAnnouncement] = useState<{
    message: string;
    type: "polite" | "assertive";
  }>({
    message: "",
    type: "polite",
  });

  return (
    <div>
      <button
        onClick={() =>
          setAnnouncement({
            message: "Saved successfully!",
            type: "polite",
          })
        }
      >
        Save
      </button>

      <button
        onClick={() =>
          setAnnouncement({
            message: "Error occurred!",
            type: "assertive",
          })
        }
      >
        Trigger Error
      </button>

      <LiveRegion message={announcement.message} type={announcement.type} />
    </div>
  );
}
