import { Button, NumberInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { TransferShell } from "@/components/TransferShell/TransferShell";
import { transferService } from "@/services/transferService";

export function TransferQuotePage() {
  const [result, setResult] = useState<string | null>(null);
  const [pickupDate, setPickupDate] = useState("2026-07-01");
  const [pickupTime, setPickupTime] = useState("14:30");

  return (
    <TransferShell>
      <Title order={2}>Transfer quote</Title>
      <TextInput label="Pickup date" value={pickupDate} onChange={(e) => setPickupDate(e.currentTarget.value)} mt="md" />
      <TextInput label="Pickup time" value={pickupTime} onChange={(e) => setPickupTime(e.currentTarget.value)} mt="md" />
      <NumberInput label="Pickup lat" defaultValue={51.47} mt="md" decimalScale={4} />
      <NumberInput label="Pickup lng" defaultValue={-0.45} mt="md" decimalScale={4} />
      <NumberInput label="Dropoff lat" defaultValue={51.51} mt="md" decimalScale={4} />
      <NumberInput label="Dropoff lng" defaultValue={-0.12} mt="md" decimalScale={4} />
      <Button
        mt="lg"
        onClick={() =>
          transferService
            .quote({
              pickupLat: 51.47,
              pickupLng: -0.45,
              dropoffLat: 51.51,
              dropoffLng: -0.12,
              pickupDate,
              pickupTime,
            })
            .then((r) => setResult(JSON.stringify(r, null, 2)))
            .catch(() => setResult("Start booking API on :8010"))
        }
      >
        Calculate
      </Button>
      {result && <pre style={{ marginTop: 16, fontSize: 12 }}>{result}</pre>}
    </TransferShell>
  );
}
