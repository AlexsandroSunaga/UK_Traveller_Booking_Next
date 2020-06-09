import { Badge, Card, Group, Text, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { bookingService } from "@/services/bookingService";

export function TrustPage() {
  const [status, setStatus] = useState<Record<string, { enabled: boolean }>>({});

  useEffect(() => {
    bookingService.integrationStatus().then(setStatus).catch(() => setStatus({}));
  }, []);

  return (
    <AppShell>
      <Title order={2}>Trust & integrations</Title>
      <Text c="dimmed" mt="xs">Stripe, SendGrid, Maps, and analytics wiring surface here for demos.</Text>
      <Group mt="lg" grow>
        {Object.entries(status).map(([k, v]) => (
          <Card key={k} withBorder padding="md">
            <Group justify="space-between">
              <Text fw={600}>{k}</Text>
              <Badge color={v.enabled ? "green" : "gray"}>{v.enabled ? "live" : "mock"}</Badge>
            </Group>
          </Card>
        ))}
      </Group>
    </AppShell>
  );
}
