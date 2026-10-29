# Agent Workflows

## General behavior

The agent should direct the experience before generating large amounts of code. It should maintain a live model of:

- experience thesis,
- chapters and progress ranges,
- active state owners,
- camera shots,
- handoff contracts,
- implementation status,
- unresolved risks,
- tuning decisions.

When new information conflicts with an earlier decision, update the relevant artifacts and identify downstream effects.

## Workflow A: Design from a brief

### Step 1: Extract usable facts

Separate:

- content facts,
- visual references,
- emotional goals,
- required interactions,
- technical constraints,
- unknowns that materially affect design.

### Step 2: Propose the experience thesis

Provide one strong default thesis rather than many vague directions. State assumptions.

### Step 3: Establish the experience contract

Define:

- persistent-stage model,
- chapter count,
- transition language,
- camera character,
- typography language,
- input ownership,
- responsive strategy,
- prohibited patterns.

### Step 4: Map chapters

Create a chapter table. Each row must describe a state transformation, not merely content.

Weak:

```text
Chapter 2, Features: show three features.
```

Strong:

```text
Chapter 2, Disassembly: the hero object separates into three functional layers. The camera trucks left to reveal depth; each layer becomes the spatial anchor for one feature statement. The outer ring remains as the bridge into the systems chapter.
```

### Step 5: Specify handoffs

Do not leave handoffs as “transition TBD.” At minimum define the bridge and continuity principle.

### Step 6: Produce the implementation architecture

Only after direction is coherent, assign responsibilities to GSAP, ScrollTrigger, Lenis, R3F, Motion, and plugins.

### Step 7: Define acceptance criteria

Use observable outcomes.

## Workflow B: Guide implementation

### Step 1: Establish current state

Inspect or ask for:

- relevant files,
- current scene graph,
- timeline construction,
- scrolling setup,
- route lifecycle,
- known bugs,
- a recording or screenshots when perceptual timing matters.

### Step 2: Choose one vertical slice

Select the smallest slice that proves the architecture, normally one chapter plus its handoff.

### Step 3: Explain the target behavior

Before code, state:

- starting state,
- ending state,
- owners,
- labels,
- phase windows,
- responsive behavior,
- validation method.

### Step 4: Implement by responsibility

Identify which files own:

- direction data,
- registry,
- timeline,
- scene rig,
- DOM layer,
- lifecycle,
- debug controls.

### Step 5: Validate

Check forward, reverse, resize, route leave, reduced motion, and the target device class.

### Step 6: Record tuning decisions

When values change, update the direction register rather than only changing local code.

### Step 7: Move to the next slice

Carry the established patterns forward. Do not create a new architecture for every chapter.

## Workflow C: Audit and improve

### Step 1: Observe symptoms

Examples:

- “each section feels separate,”
- “camera movement feels floaty,”
- “the page is impressive but tiring,”
- “mobile composition breaks,”
- “reverse scroll jumps,”
- “the Three.js scene requires constant patching.”

### Step 2: Trace causes

Classify as:

- experience architecture,
- state ownership,
- timeline structure,
- handoff design,
- camera composition,
- input conflict,
- responsive direction,
- performance,
- lifecycle.

### Step 3: Build a continuity map

For each chapter boundary, record:

- persistent elements,
- reset elements,
- bridge,
- camera relation,
- handoff quality,
- visible discontinuity.

### Step 4: Build a property-conflict map

Find properties written by several systems.

```text
camera.position:
- GSAP chapter timeline
- pointer effect in useFrame
- route transition
Result: visible drift and non-deterministic final pose
Correction: nested narrative/reaction/route rigs
```

### Step 5: Prioritize structural fixes

Fix in this order:

1. state continuity,
2. ownership conflicts,
3. camera and target architecture,
4. handoff coverage,
5. timeline hierarchy,
6. responsive behavior,
7. performance,
8. decorative polish.

### Step 6: Specify before/after behavior

Do not merely say “refactor the timeline.” State what the viewer should experience after the correction.

### Step 7: Provide a staged remediation plan

Each stage should be independently testable and preserve a working page.

## Agent session protocol

At the beginning of a substantial session, maintain a short status block:

```text
Mode: Design / Implementation / Audit
Current chapter or slice:
Active decision artifacts:
Known constraints:
Unresolved risks:
```

At the end, report:

- decisions made,
- files or artifacts changed,
- values requiring visual tuning,
- validation completed,
- next recommended slice.

## Agent anti-patterns

The agent must not:

- generate a generic hero/features/projects/contact structure unless the brief requires it,
- equate “cinematic” with constant camera movement,
- suggest pinning every section without a stage-continuity plan,
- produce a monolithic component containing scene, timelines, state, and copy,
- add post-processing before the composition works,
- use vague words instead of progress ranges and states,
- ignore reverse scroll,
- ignore route cleanup,
- let GSAP and Motion own the same transform,
- assume desktop choreography scales directly to mobile,
- hide uncertainty about untested visual values.

## How the agent should handle visual tuning

The agent should distinguish:

- **architectural certainty:** ownership, lifecycle, state boundaries, cleanup;
- **direction hypothesis:** likely camera path, timing, ease, phase range;
- **visual tuning value:** exact position, FOV, scale, light intensity, shader amount.

It should provide strong starting values and identify which values require in-browser judgment. It should not pretend that exact composition can be finalized without seeing the running result.
