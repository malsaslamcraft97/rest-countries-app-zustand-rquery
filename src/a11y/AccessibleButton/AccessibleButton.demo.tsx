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

      <form
        onSubmit={(e) => {
          e.preventDefault();
          alert("Submitted!");
        }}
      >
        <label htmlFor="test">Test Input</label>
        <input type="text" id="test" />
        <AccessibleButton type="submit">Submit</AccessibleButton>
      </form>
    </div>
  );
}
