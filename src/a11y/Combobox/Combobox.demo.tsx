import { useState } from "react";
import { Combobox } from "./Combobox";

export function ComboboxDemo() {
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

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
        label="Search for countries"
        value={inputValue}
        onInputChange={setInputValue}
        onSelect={(val) => {
          setSelectedValue(val);
          setInputValue(val); // sync on selection
        }}
        placeholder="Search for a country..."
      />

      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        <strong>Selected:</strong> {selectedValue || "None"}
      </p>
    </div>
  );
}
