import { Button, Container, List, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { AppShell } from "@/components/AppShell/AppShell";

export function LandingPage() {
  return (
    <AppShell>
      <Container py="xl" px={0}>
        <Title order={1}>Travel & commerce product surface</Title>
        <Text c="dimmed" mt="sm" maw={640}>
          Production-style SPA aligned with{" "}
          <a href="https://github.com/kombai-io/webbuilder">kombai-io/webbuilder</a> — multi-page flows, service layer,
          and live FastAPI integrations (quote, bookings, Stripe/SendGrid status).
        </Text>
        <List mt="lg" spacing="xs">
          <List.Item>Explore curated inventory</List.Item>
          <List.Item>Instant quote + checkout handoff</List.Item>
          <List.Item>Ops console for operators</List.Item>
        </List>
        <Button component={Link} to="/quote" mt="lg">Get a quote</Button>
      </Container>
    </AppShell>
  );
}
