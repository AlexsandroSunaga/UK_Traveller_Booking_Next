import { Button, Table, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { TransferShell } from "@/components/TransferShell/TransferShell";
import { transferService } from "@/services/transferService";

export function ReservationsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const load = () => transferService.listReservations().then((r) => setRows(r.items)).catch(() => setRows([]));
  useEffect(() => {
    load();
  }, []);

  return (
    <TransferShell>
      <Title order={2}>Reservations</Title>
      <Button mt="md" variant="light" onClick={load}>Refresh</Button>
      <Table mt="lg" striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Reference</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows.map((r) => (
            <Table.Tr key={r.id}>
              <Table.Td>{r.reference}</Table.Td>
              <Table.Td>{r.status}</Table.Td>
              <Table.Td>
                <Button size="xs" variant="subtle" onClick={() => transferService.refund(r.id).then(load)}>
                  Refund
                </Button>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </TransferShell>
  );
}
