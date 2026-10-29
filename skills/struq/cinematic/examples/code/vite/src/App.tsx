import type { JSX } from 'react';
import { ExperiencePage } from './experience/ExperiencePage';
import { LenisRoot } from './LenisRoot';

export default function App(): JSX.Element {
  return (
    <LenisRoot>
      <ExperiencePage />
    </LenisRoot>
  );
}
