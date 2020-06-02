import { Button, Textarea, TextInput, Title } from "@mantine/core";
import { AppShell } from "@/components/AppShell/AppShell";

export function ContactPage() {
  return (
    <AppShell>
      <Title order={2}>Contact concierge</Title>
      <TextInput label="Email" mt="md" placeholder="you@example.com" />
      <Textarea label="Trip brief" mt="md" minRows={4} />
      <Button mt="lg">Send (demo)</Button>
    </AppShell>
  );
}
