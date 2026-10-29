import type * as THREE from 'three';

export type ExperienceTargetMap = {
  cameraNarrativeRig: THREE.Group;
  cameraTargetNarrativeRig: THREE.Group;
  camera: THREE.PerspectiveCamera;
  subjectNarrativeRig: THREE.Group;
  subjectReactionRig: THREE.Group;
  subjectMesh: THREE.Mesh;
  interiorRoot: THREE.Group;
  heroTitle: HTMLElement;
  bridgePath: SVGPathElement;
};

type Key = keyof ExperienceTargetMap;
type Listener = () => void;

class ExperienceRegistry {
  private targets = new Map<Key, ExperienceTargetMap[Key]>();
  private listeners = new Set<Listener>();

  register<K extends Key>(key: K, value: ExperienceTargetMap[K]): () => void {
    this.targets.set(key, value);
    this.emit();

    return () => {
      if (this.targets.get(key) === value) {
        this.targets.delete(key);
        this.emit();
      }
    };
  }

  get<K extends Key>(key: K): ExperienceTargetMap[K] | undefined {
    return this.targets.get(key) as ExperienceTargetMap[K] | undefined;
  }

  require<K extends Key>(key: K): ExperienceTargetMap[K] {
    const value = this.get(key);
    if (!value) throw new Error(`Missing experience target: ${key}`);
    return value;
  }

  hasAll(keys: Key[]): boolean {
    return keys.every((key) => this.targets.has(key));
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(): void {
    for (const listener of this.listeners) listener();
  }
}

export const experienceRegistry = new ExperienceRegistry();
