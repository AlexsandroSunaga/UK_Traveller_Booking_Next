import { AppShell as MantineShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";

const brand = import.meta.env.VITE_APP_TITLE ?? "Airport transfers";

const links = [
  { to: "/", label: "Home" },
  { to: "/routes", label: "Routes & airports" },
  { to: "/quote", label: "Instant quote" },
  { to: "/reservations", label: "Reservations" },
  { to: "/pay", label: "Pay & confirm" },
  { to: "/dispatch", label: "Dispatch ops" },
];

export function TransferShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const loc = useLocation();

  return (
    <MantineShell header={{ height: 56 }} navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }} padding="md">
      <MantineShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <strong>{brand}</strong>
          </Group>
        </Group>
      </MantineShell.Header>
      <MantineShell.Navbar p="md">
        {links.map((l) => (
          <NavLink key={l.to} component={Link} to={l.to} label={l.label} active={loc.pathname === l.to} />
        ))}
      </MantineShell.Navbar>
      <MantineShell.Main>{children}</MantineShell.Main>
    </MantineShell>
  );
}
