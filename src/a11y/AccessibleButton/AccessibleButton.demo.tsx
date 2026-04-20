import { AccessibleButton } from "./AccessibleButton";

export function AccessibleButtonDemo() {
  return (
    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
      <AccessibleButton onClick={() => alert("Clicked!")}>
        Normal Button
      </AccessibleButton>

      <AccessibleButton isLoading>Loading Button</AccessibleButton>

      <AccessibleButton disabled>Disabled Button</AccessibleButton>

      <AccessibleButton ariaLabel="Add to favorites">⭐</AccessibleButton>
    </div>
  );
}
