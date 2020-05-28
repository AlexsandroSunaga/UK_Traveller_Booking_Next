import { MantineProvider } from "@mantine/core";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import theme from "@/theme";
import { TransferHomePage } from "@/pages/TransferHomePage/TransferHomePage";
import { AirportRoutesPage } from "@/pages/AirportRoutesPage/AirportRoutesPage";
import { TransferQuotePage } from "@/pages/TransferQuotePage/TransferQuotePage";
import { ReservationsPage } from "@/pages/ReservationsPage/ReservationsPage";
import { TransferPaymentPage } from "@/pages/TransferPaymentPage/TransferPaymentPage";
import { DispatchOpsPage } from "@/pages/DispatchOpsPage/DispatchOpsPage";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TransferHomePage />} />
          <Route path="/routes" element={<AirportRoutesPage />} />
          <Route path="/quote" element={<TransferQuotePage />} />
          <Route path="/reservations" element={<ReservationsPage />} />
          <Route path="/pay" element={<TransferPaymentPage />} />
          <Route path="/dispatch" element={<DispatchOpsPage />} />
        </Routes>
      </BrowserRouter>
    </MantineProvider>
  );
}
