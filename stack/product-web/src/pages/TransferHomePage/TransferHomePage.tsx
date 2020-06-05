import { Button, Text, Title } from "@mantine/core";
import { Link } from "react-router-dom";
import { TransferShell } from "@/components/TransferShell/TransferShell";

const market = (import.meta.env.VITE_MARKET ?? "uk").toUpperCase();

export function TransferHomePage() {
  return (
    <TransferShell>
      <Title order={1}>{market} airport & city transfers</Title>
      <Text c="dimmed" mt="sm" maw={560}>
        Fixed-price quotes with vehicle class selection — wired to your FastAPI pricing engine (haversine + market tariffs).
      </Text>
      <Button component={Link} to="/quote" mt="lg">Get instant quote</Button>
    </TransferShell>
  );
}
