import { Accordion } from "./Accordion";

export function AccordionDemo() {
  const items = [
    {
      id: "faq1",
      title: "What is this app?",
      content: <p>This is an accessibility playground.</p>,
    },
    {
      id: "faq2",
      title: "Is it production ready?",
      content: <p>Yes, with proper ARIA patterns.</p>,
    },
    {
      id: "faq3",
      title: "Why accessibility matters?",
      content: <p>Because everyone should be able to use your app.</p>,
    },
  ];

  return <Accordion items={items} />;
}
