import { Button, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { bookingService } from "@/services/bookingService";

export function CheckoutPage() {
  const [email, setEmail] = useState("guest@example.com");
  const [ref, setRef] = useState<string | null>(null);

  return (
    <AppShell>
      <Title order={2}>Checkout</Title>
      <TextInput label="Email for confirmation" value={email} onChange={(e) => setEmail(e.currentTarget.value)} mt="md" />
      <Button
        mt="lg"
        onClick={() =>
          bookingService
            .createBooking({ destination: "Amalfi Coast", travelers: 2, start_date: "2026-07-01", email })
            .then((r: { reference: string }) => setRef(r.reference))
        }
      >
        Confirm booking (demo)
      </Button>
      {ref && <p style={{ marginTop: 16 }}>Reference {ref} — confirmation via SendGrid when configured.</p>}
    </AppShell>
  );
}
