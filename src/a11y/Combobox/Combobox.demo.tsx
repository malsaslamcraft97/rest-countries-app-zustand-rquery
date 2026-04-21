import { useState } from "react";
import { Combobox } from "./Combobox";

export function ComboboxDemo() {
  const [value, setValue] = useState("");

  const countries = [
    "India",
    "United States",
    "Germany",
    "France",
    "Japan",
    "Canada",
    "Australia",
    "Brazil",
    "United Kingdom",
    "South Korea",
  ];

  return (
    <div>
      <h2 style={{ marginBottom: "16px" }}>Country Selector (Combobox)</h2>

      <Combobox
        options={countries}
        value={value}
        onChange={setValue}
        placeholder="Search for a country..."
      />

      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        <strong>Selected:</strong> {value || "None"}
      </p>
    </div>
  );
}
