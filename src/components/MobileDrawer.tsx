import Link from "next/link";
import { NAV_LINKS, SITE } from "@/lib/constants";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function MobileDrawer({ open, onClose }: Props) {
  if (!open) return null;

  return (
    <div
      id="lat-mobile-drawer"
      className="lat-mobile-drawer is-open"
      style={{
        background: "var(--lat-white)",
        borderBottom: "1px solid var(--lat-border)",
        padding: "12px 20px 24px",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Link
          href="/"
          onClick={onClose}
          style={{
            padding: "12px 4px",
            color: "var(--lat-ink)",
            fontWeight: 600,
            borderBottom: "1px solid var(--lat-border)",
          }}
        >
          Home
        </Link>
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            style={{
              padding: "12px 4px",
              color: "var(--lat-ink)",
              fontWeight: 500,
              borderBottom: "1px solid var(--lat-border)",
            }}
          >
            {link.label === "Business" ? "Business accounts" : link.label === "Luton local" ? "Luton local areas" : link.label === "Help" ? "Help & FAQs" : link.label}
          </Link>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <a href={`tel:${SITE.phoneTel}`} className="btn btn-primary" style={{ flex: 1, height: 44 }}>
          <i className="bi bi-telephone-fill" />
          <span className="tnum">Call</span>
        </a>
        <a
          href={`https://wa.me/${SITE.whatsappTel}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary"
          style={{ flex: 1, height: 44 }}
        >
          <i className="bi bi-whatsapp" style={{ color: "#25D366" }} />
          WhatsApp
        </a>
      </div>
    </div>
  );
}
