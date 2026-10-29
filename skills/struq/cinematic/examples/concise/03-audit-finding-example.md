# Concise Audit Finding Example

## Finding: Camera drift during chapter transitions

**Symptom:** The camera never lands on the same composition twice. Fast scroll produces a different final framing than slow scroll.

**Cause:** The ScrollTrigger timeline writes directly to `camera.position`, while `useFrame` lerps the same position toward a pointer-based target. A route transition also animates the camera directly.

**Perceptual consequence:** Key poses feel soft and unintentional. Handoffs expose small jumps because the outgoing final pose is unstable.

**Correction:** Introduce `cameraNarrativeRig`, `cameraReactionRig`, and `cameraRouteRig`. Assign the chapter timeline to the narrative rig, pointer damping to the reaction rig, and route transitions to a temporary parent route rig. The physical camera only resolves look-at and projection.

**Validation:** Scrub the chapter forward and backward ten times with pointer at different positions. The narrative rig must end at identical values, and the final subject screen position must remain within one pixel before reactive modulation is applied.
