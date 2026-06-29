import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MoneyMitra — Free Financial Calculators for India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0D9488 0%, #0F766E 60%, #134e4a 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Subtle grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        {/* Rupee symbol accent */}
        <div style={{ fontSize: 140, color: "rgba(255,255,255,0.08)", position: "absolute", top: 40, right: 80, lineHeight: 1 }}>
          ₹
        </div>
        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 72, color: "white", fontWeight: 800, letterSpacing: "-2px" }}>
              MoneyMitra
            </div>
          </div>
          <div style={{ fontSize: 30, color: "#A7F3D0", fontWeight: 400, letterSpacing: "2px" }}>
            Your Money Friend
          </div>
          <div
            style={{
              marginTop: 24,
              display: "flex",
              gap: 20,
            }}
          >
            {["EMI Calculator", "SIP Calculator", "Tax Comparator", "Prepayment"].map((t) => (
              <div
                key={t}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 18,
                  color: "white",
                }}
              >
                {t}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, color: "rgba(255,255,255,0.6)", marginTop: 8 }}>
            Free · Instant · No signup · Built for India
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
