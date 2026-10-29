# Handoff Contract

## Identity

**ID:**

**From:**

**To:**

**Global or local progress window:**

## Bridge

**Bridge element(s):**

**Continuity type:** object / screen-space / world-space / typography / vector / light / texture / motion

**Why the viewer understands the bridge:**

## Outgoing state

| Property | Value | Coordinate space | Owner |
|---|---|---|---|

## Incoming state

| Property | Value | Coordinate space | Owner |
|---|---|---|---|

## State equality requirements

| Shared property | Outgoing final | Incoming initial | Tolerance |
|---|---|---|---|

## Ownership transfer

| Property | Outgoing owner | Transfer cue | Transition owner | Incoming cue | Incoming owner |
|---|---|---|---|---|---|

## Choreography

| Handoff progress | Action | Visual purpose | Owner |
|---:|---|---|---|
| 0.00 | | | |
| 0.25 | | | |
| 0.50 | | | |
| 0.75 | | | |
| 1.00 | | | |

## Camera continuity

**Method:** continuous path / match pose / cut under cover / render blend / subject-relative

**Position and target behavior:**

**FOV and focus behavior:**

## Cover or compositing

**Occlusion strategy:**

**Coverage condition:**

**Scene or asset swap condition:**

## Lighting and typography

**Lighting continuity:**

**Typography continuity:**

## Interaction gating

**Pointer:**

**Scroll velocity effects:**

**Click or hover:**

## Readiness

- Required assets:
- Prefetch cue:
- Fallback if unavailable:

## Reverse behavior

[Describe exact reverse thresholds, retained assets, and owner restoration.]

## Completion condition

[Measurable state proving that the incoming chapter is authoritative.]

## Validation

- [ ] Shared values match.
- [ ] Cover condition works on all viewport classes.
- [ ] No frame exposes an invalid mixed state.
- [ ] Reverse behavior reconstructs the outgoing chapter.
- [ ] Interaction ownership transfers cleanly.
- [ ] Assets remain alive for reversal.
