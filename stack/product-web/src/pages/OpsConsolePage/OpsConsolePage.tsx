import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import { AppShell } from "@/components/AppShell/AppShell";

export function OpsConsolePage() {
  return (
    <AppShell>
      <Title order={2}>Operations console</Title>
      <SimpleGrid cols={{ base: 1, sm: 3 }} mt="lg">
        <Card withBorder padding="lg"><Text fw={600}>Gross bookings</Text><Title order={3}>128</Title></Card>
        <Card withBorder padding="lg"><Text fw={600}>Refund rate</Text><Title order={3}>1.2%</Title></Card>
        <Card withBorder padding="lg"><Text fw={600}>API p95</Text><Title order={3}>210ms</Title></Card>
      </SimpleGrid>
    </AppShell>
  );
}
