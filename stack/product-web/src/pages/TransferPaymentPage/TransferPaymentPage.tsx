import { Button, TextInput, Title } from "@mantine/core";
import { useState } from "react";
import { TransferShell } from "@/components/TransferShell/TransferShell";
import { transferService } from "@/services/transferService";

export function TransferPaymentPage() {
  const [email, setEmail] = useState("guest@example.com");
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <TransferShell>
      <Title order={2}>Pay & confirm (Phase 2 — Stripe)</Title>
      <TextInput label="Email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} mt="md" />
      <Button
        mt="lg"
        onClick={async () => {
          const currency = import.meta.env.VITE_MARKET === "brazil" ? "brl" : "gbp";
          const session = await transferService.checkoutSession({
            amount_cents: currency === "brl" ? 8900 : 4500,
            currency,
            email,
            description: "Airport transfer",
          });
          if (session.url.startsWith("http")) window.location.href = session.url;
          else setMsg(`${session.provider}: ${session.session_id}`);
        }}
      >
        Stripe Checkout
      </Button>
      {msg && <p style={{ marginTop: 12 }}>{msg}</p>}
    </TransferShell>
  );
}
