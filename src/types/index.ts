export type StrobeMode = 'static' | 'ramp' | 'stochastic' | 'cycle';

export interface StrobePreset {
  id: string;
  name: string;
  targetState: string;
  mode: StrobeMode;
  frequency: number;
  duration_sec: number;
  color: string;
  description: string;
  safetyGate: 'none' | 'opt_in';
}

export const PRESETS: StrobePreset[] = [
  {
    id: 'joy',
    name: 'Joyful Activation',
    targetState: 'Flow State',
    mode: 'static',
    frequency: 12.5,
    duration_sec: 600,
    color: '#FFD700',
    description: 'Alpha/Beta border for energized focus.',
    safetyGate: 'none',
  },
  {
    id: 'wonder',
    name: 'Wonder',
    targetState: 'Theta Gateway',
    mode: 'static',
    frequency: 6.8,
    duration_sec: 900,
    color: '#9B59B6',
    description: 'Deep relaxation and hypnagogic imagery.',
    safetyGate: 'none',
  },
  {
    id: 'transcend',
    name: 'Transcendence',
    targetState: 'Gamma Entrainment',
    mode: 'static',
    frequency: 40.0,
    duration_sec: 300,
    color: '#00f3ff',
    description: 'High-frequency gamma for non-ordinary awareness.',
    safetyGate: 'opt_in',
  },
  {
    id: 'chaos',
    name: 'Chaos Mode',
    targetState: 'Signal Diversity',
    mode: 'stochastic',
    frequency: 10.0,
    duration_sec: 300,
    color: '#FF2D55',
    description: 'Stochastic flicker to increase EEG complexity.',
    safetyGate: 'opt_in',
  },
];
