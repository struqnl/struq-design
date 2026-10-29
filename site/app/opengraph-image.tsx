import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Struq: design taste for your coding agent";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// A poster from the site's own system: paper, Comfortaa for the line, the mark at the edge.
export default async function Image() {
  const [brand, ui] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/comfortaa-latin-400-normal.woff")),
    readFile(join(process.cwd(), "assets/fonts/urbanist-latin-500-normal.woff")),
  ]);

  const bar = (w: number, color: string, opacity = 1) => (
    <div style={{ width: w, height: 54, borderRadius: 27, background: color, opacity }} />
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#fbf8f2",
          color: "#221d15",
          padding: 72,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          <div style={{ display: "flex", fontFamily: "Urbanist", fontSize: 24, letterSpacing: "0.14em", color: "#5c5546" }}>
            OPEN-SOURCE DESIGN SKILL
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "Comfortaa",
              fontSize: 92,
              lineHeight: 1.04,
              letterSpacing: "-0.03em",
              maxWidth: 700,
            }}
          >
            Design taste for your coding agent.
          </div>
          <div style={{ display: "flex", fontFamily: "Urbanist", fontSize: 26, color: "#5c5546" }}>
            npx skills add deckdot/struq-design -g
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: -70,
            bottom: 70,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 3,
          }}
        >
          {bar(192, "#221d15", 0.7)}
          {bar(288, "#221d15")}
          {bar(384, "#e4572e")}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Comfortaa", data: brand, weight: 400, style: "normal" },
        { name: "Urbanist", data: ui, weight: 500, style: "normal" },
      ],
    }
  );
}
