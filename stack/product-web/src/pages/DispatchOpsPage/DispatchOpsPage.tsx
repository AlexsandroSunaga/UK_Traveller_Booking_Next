import { Card, SimpleGrid, Title } from "@mantine/core";
import { TransferShell } from "@/components/TransferShell/TransferShell";

export function DispatchOpsPage() {
  return (
    <TransferShell>
      <Title order={2}>Dispatch operations</Title>
      <SimpleGrid cols={{ base: 1, sm: 3 }} mt="lg">
        <Card withBorder padding="lg"><strong>Active jobs</strong><div>18</div></Card>
        <Card withBorder padding="lg"><strong>On-time %</strong><div>96.2</div></Card>
        <Card withBorder padding="lg"><strong>Drivers online</strong><div>42</div></Card>
      </SimpleGrid>
    </TransferShell>
  );
}
