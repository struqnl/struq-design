'use client';

import type { JSX } from 'react';
import { ExperiencePage } from '@/experience/ExperiencePage';
import { LenisRoot } from './components/LenisRoot';

export function CinematicExperience(): JSX.Element {
  return (
    <LenisRoot>
      <ExperiencePage />
    </LenisRoot>
  );
}
