import { ImageResponse } from "next/og";

export const alt = "SYNTHEA — Engineering What Comes Next.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#101114",
          color: "#FFFFFF",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "#FFFFFF", display: "flex" }} />
          <div style={{ fontSize: 30, letterSpacing: 8, fontWeight: 600 }}>SYNTHEA</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 80, height: 4, background: "#D71932", marginBottom: 36 }} />
          <div style={{ fontSize: 92, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>Engineering What Comes Next.</div>
          <div style={{ marginTop: 32, fontSize: 28, color: "#AEB6C2", letterSpacing: 2 }}>
            Robotics • Engineering Design • Simulation • Automation
          </div>
        </div>
      </div>
    ),
    size,
  );
}
