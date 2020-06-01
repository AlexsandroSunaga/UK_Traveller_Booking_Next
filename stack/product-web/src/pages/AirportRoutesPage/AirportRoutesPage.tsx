import { Card, SimpleGrid, Text, Title } from "@mantine/core";
import { TransferShell } from "@/components/TransferShell/TransferShell";

const routes =
  import.meta.env.VITE_MARKET === "brazil"
    ? [
        { from: "GRU", to: "São Paulo Centro", eta: "45 min" },
        { from: "GIG", to: "Copacabana", eta: "35 min" },
      ]
    : [
        { from: "LHR", to: "Central London", eta: "55 min" },
        { from: "LGW", to: "Brighton", eta: "50 min" },
        { from: "STN", to: "Cambridge", eta: "48 min" },
      ];

export function AirportRoutesPage() {
  return (
    <TransferShell>
      <Title order={2}>Popular routes</Title>
      <SimpleGrid cols={{ base: 1, sm: 2 }} mt="lg">
        {routes.map((r) => (
          <Card key={r.from + r.to} withBorder padding="md">
            <Text fw={600}>{r.from} → {r.to}</Text>
            <Text size="sm" c="dimmed">Typical {r.eta}</Text>
          </Card>
        ))}
      </SimpleGrid>
    </TransferShell>
  );
}
