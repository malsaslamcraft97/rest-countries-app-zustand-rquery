import { AccessibleButtonDemo } from "./AccessibleButton/AccessibleButton.demo";
import { AccordionDemo } from "./Accordion/Accordion.demo";
import { FormDemo } from "./Form/Form.demo";
import { ModalDemo } from "./Modal/Modal.demo";
import { TabsDemo } from "./Tabs/Tabs.demo";

export function A11yPlayground() {
  return (
    <main style={{ padding: "40px" }}>
      <h1>ARIA Patterns Playground</h1>

      <section>
        <h2>Accessible Button</h2>
        <AccessibleButtonDemo />
      </section>

      <section>
        <h2>Accessible Modal dialog with focus traps</h2>
        <ModalDemo />
      </section>

      <section>
        <h2>Accessible Tabs</h2>
        <TabsDemo />
      </section>

      <section>
        <h2>Accessible Accordion (Disclosure)</h2>
        <AccordionDemo />
      </section>

      <section>
        <h2>Accessible Form with validation and error announcements</h2>
        <FormDemo />
      </section>
    </main>
  );
}
