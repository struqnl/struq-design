import { useRef } from 'react';
import { ExperienceCanvas } from './ExperienceCanvas';
import { ExperienceDirector } from './ExperienceDirector';
import { ExperienceOverlay } from './ExperienceOverlay';
import { useExperienceInput } from './useExperienceInput';
import './styles.css';

export function ExperiencePage(): JSX.Element {
  const scopeRef = useRef<HTMLDivElement>(null);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useExperienceInput();

  return (
    <div ref={scopeRef} className="experience-root">
      <div ref={narrativeRef} className="experience-narrative">
        <div ref={stageRef} className="experience-stage">
          <ExperienceCanvas />
          <ExperienceOverlay />
        </div>

        <div className="experience-scroll-space" aria-hidden="true" />

        <div className="experience-semantic-content">
          <section aria-labelledby="arrival-heading">
            <h2 id="arrival-heading">Arrival</h2>
            <p>The object is introduced as one stable composition.</p>
          </section>
          <section aria-labelledby="material-heading">
            <h2 id="material-heading">Material</h2>
            <p>The same subject transforms instead of being replaced.</p>
          </section>
          <section aria-labelledby="interior-heading">
            <h2 id="interior-heading">Interior</h2>
            <p>The subject becomes the bridge into a new spatial state.</p>
          </section>
        </div>
      </div>

      <footer className="experience-footer">
        Normal document flow resumes after the persistent experience.
      </footer>

      <ExperienceDirector
        scopeRef={scopeRef}
        narrativeRef={narrativeRef}
        stageRef={stageRef}
      />
    </div>
  );
}
