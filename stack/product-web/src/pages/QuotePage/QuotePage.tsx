import { Button, NumberInput, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { bookingService } from "@/services/bookingService";

export function QuotePage() {
  const [destination, setDestination] = useState("Scottish Highlands");
  const [travelers, setTravelers] = useState(2);
  const [nights, setNights] = useState(7);
  const [result, setResult] = useState<string | null>(null);

  return (
    <AppShell>
      <Title order={2}>Instant quote</Title>
      <TextInput label="Destination" value={destination} onChange={(e) => setDestination(e.currentTarget.value)} mt="md" />
      <NumberInput label="Travelers" value={travelers} onChange={(v) => setTravelers(Number(v) || 1)} mt="md" />
      <NumberInput label="Nights" value={nights} onChange={(v) => setNights(Number(v) || 1)} mt="md" />
      <Button
        mt="lg"
        onClick={() =>
          bookingService.quote({ destination, travelers, nights }).then((r) => setResult(`${r.currency} ${r.total}`)).catch(() => setResult("API offline — start backend on :8010"))
        }
      >
        Calculate
      </Button>
      {result && <p style={{ marginTop: 16 }}>Total: {result}</p>}
    </AppShell>
  );
}
