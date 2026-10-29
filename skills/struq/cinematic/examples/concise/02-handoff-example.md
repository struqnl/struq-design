# Concise Handoff Example: Ring to Portal

**From:** `disassembly`

**To:** `interior`

**Window:** global progress `0.51 to 0.60`

**Bridge:** the product's outer ring.

**Continuity:** screen-space center, apparent scale, ring rotation, and camera target must match at transfer.

**Sequence:**

1. At handoff progress `0.00`, disable ring hover and reduce pointer camera yaw from `0.045` to `0.008`.
2. From `0.00 to 0.42`, align the ring normal to the camera and dolly toward it.
3. At `0.28`, start rendering the interior scene behind the ring mask.
4. At `0.68`, the ring covers at least `95%` of the central viewport safe area.
5. At `0.72`, disable outgoing layers and change environment ownership under full cover.
6. At `0.78`, transfer camera target ownership to the interior tunnel anchor.
7. From `0.78 to 1.00`, restore pointer influence to the interior value `0.025` and reveal depth fog.

**Reverse:** retain outgoing product layers until global progress exceeds `0.66`; all visibility is derived from progress, not one-time callbacks.

**Completion:** camera is inside the tunnel, no ring edge is visible, interior lighting is authoritative, and incoming chapter local progress equals `0`.
