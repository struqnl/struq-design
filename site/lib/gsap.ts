import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Only the plugins this build uses (setup.md §1, performance.md §1).
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// The baseline entrance inside the reveal band.
gsap.defaults({ ease: "expo.out", duration: 0.9 });

export { gsap, ScrollTrigger, SplitText, useGSAP };
