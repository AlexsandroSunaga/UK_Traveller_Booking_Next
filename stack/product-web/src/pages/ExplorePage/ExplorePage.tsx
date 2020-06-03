import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import { AppShell } from "@/components/AppShell/AppShell";

const destinations = [
  { name: "Scottish Highlands", nights: 7, from: 1299 },
  { name: "Amalfi Coast", nights: 5, from: 1890 },
  { name: "Kyoto & Osaka", nights: 10, from: 2100 },
  { name: "Patagonia", nights: 12, from: 3400 },
];

export function ExplorePage() {
  return (
    <AppShell>
      <Title order={2}>Curated departures</Title>
      <Text c="dimmed" mt="xs">Inventory synced from PMS + channel manager integrations.</Text>
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="lg">
        {destinations.map((d) => (
          <Card key={d.name} shadow="sm" padding="lg" radius="md" withBorder>
            <Title order={4}>{d.name}</Title>
            <Text size="sm" mt="sm">{d.nights} nights · from £{d.from}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </AppShell>
  );
}
