import { Tabs } from "./Tabs";

export function TabsDemo() {
  const tabs = [
    {
      id: "profile",
      label: "Profile",
      content: <p>Your profile information goes here.</p>,
    },
    {
      id: "settings",
      label: "Settings",
      content: <p>Adjust your preferences and configuration.</p>,
    },
    {
      id: "billing",
      label: "Billing",
      content: <p>Manage payment methods and invoices.</p>,
    },
  ];

  return <Tabs tabs={tabs} />;
}
