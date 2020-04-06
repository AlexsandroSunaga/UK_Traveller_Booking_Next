import "../booking.css";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return <div className="booking-app min-h-screen">{children}</div>;
}
