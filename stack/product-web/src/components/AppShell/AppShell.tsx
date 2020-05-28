import { AppShell as MantineShell, Burger, Group, NavLink } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/", label: "Home" },
  { to: "/explore", label: "Explore" },
  { to: "/quote", label: "Get a quote" },
  { to: "/bookings", label: "My bookings" },
  { to: "/trust", label: "Trust" },
  { to: "/contact", label: "Contact" },
  { to: "/ops", label: "Ops" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const loc = useLocation();

  return (
    <MantineShell header={{ height: 56 }} navbar={{ width: 260, breakpoint: "sm", collapsed: { mobile: !opened } }} padding="md">
      <MantineShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <strong>Travel product</strong>
          </Group>
          <Group visibleFrom="sm" gap="lg">
            {links.slice(0, 5).map((l) => (
              <Link key={l.to} to={l.to} style={{ textDecoration: "none", color: loc.pathname === l.to ? "#228be6" : "#333" }}>
                {l.label}
              </Link>
            ))}
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
