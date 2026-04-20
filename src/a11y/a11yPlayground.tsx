import { AccessibleButtonDemo } from "./AccessibleButton/AccessibleButton.demo";

export function A11yPlayground() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>ARIA Patterns Playground</h1>

      <section>
        <h2>Accessible Button</h2>
        <AccessibleButtonDemo />
      </section>
    </main>
  );
}
