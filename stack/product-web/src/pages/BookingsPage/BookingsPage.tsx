import { Button, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/AppShell/AppShell";
import { bookingService } from "@/services/bookingService";

export function BookingsPage() {
  const [rows, setRows] = useState<any[]>([]);

  const load = () => bookingService.listBookings().then((r) => setRows(r.items)).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, []);

  return (
    <AppShell>
      <Title order={2}>My bookings</Title>
      <Button mt="md" variant="light" onClick={() => bookingService.createBooking({
        destination: "Demo trip", travelers: 2, start_date: "2026-06-01", email: "guest@example.com",
      }).then(load)}>
        Create demo booking
      </Button>
      <Table mt="lg" striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Reference</Table.Th>
            <Table.Th>Destination</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => (
            <Table.Tr key={r.id}>
              <Table.Td>{r.reference}</Table.Td>
              <Table.Td>{r.destination}</Table.Td>
              <Table.Td>{r.status}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </AppShell>
  );
}
