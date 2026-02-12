import { ControllerConfig, Section } from './types';

export type { ControlType, CCParam, Section } from './types';

export const granularSection: Section = {
  title: 'Granular',
  params: [
    { label: 'Coarse Tune', cc: 76, type: 'fader' },
    { label: 'Fine Tune', cc: 18, type: 'fader' },
    { label: 'Detune', cc: 13, type: 'fader' },
    { label: 'Grains', cc: 21, type: 'fader' },
    { label: 'Grain Shape', cc: 15, type: 'fader' },
    { label: 'Grain Size', cc: 23, type: 'fader' },
    { label: 'Spread', cc: 25, type: 'fader' },
    { label: 'Head Position', cc: 19, type: 'fader' },
    { label: 'Head Speed', cc: 20, type: 'fader' },
    { label: 'Grain Time Key Follow', cc: 16, type: 'fader' },
    { label: 'Grain Rev Prob', cc: 3, type: 'fader' },
    { label: 'Grain Timing Jitter', cc: 68, type: 'fader' },
    { label: 'Start Mode', cc: 79, type: 'toggle', options: ['Cold', 'Hot'] },
    { label: 'Sample', cc: 88, type: 'list' },
    { label: 'Pattern', cc: 0, type: 'list' },
  ],
};

export const filterSection: Section = {
  title: 'Filter',
  params: [
    { label: 'Cutoff Freq', cc: 74, type: 'fader' },
    { label: 'Resonance', cc: 71, type: 'fader' },
    { label: 'Envelope Depth', cc: 24, type: 'fader' },
    { label: 'Key Follow', cc: 26, type: 'fader' },
    { label: 'Velocity Sens', cc: 78, type: 'fader' },
    { label: 'Filter Type', cc: 12, type: 'selector', options: ['Off', 'LPF', 'BPF', 'HPF', 'Peak'] },
  ],
};

export const ampEnvSection: Section = {
  title: 'Amp Envelope',
  params: [
    { label: 'Attack', cc: 73, type: 'fader' },
    { label: 'Decay', cc: 75, type: 'fader' },
    { label: 'Sustain', cc: 30, type: 'fader' },
    { label: 'Release', cc: 72, type: 'fader' },
    { label: 'Env Mode', cc: 29, type: 'selector', options: ['ADSR', 'ADR', 'Cyclic'] },
    { label: 'Time Key Follow', cc: 77, type: 'fader' },
    { label: 'Amp Switch', cc: 28, type: 'toggle', options: ['Off', 'On'] },
  ],
};

export const effectsSection: Section = {
  title: 'Effects / Output',
  params: [
    { label: 'Lo-Fi Switch', cc: 87, type: 'toggle', options: ['Off', 'On'] },
    { label: 'Lo-Fi Intensity', cc: 17, type: 'fader' },
    { label: 'Reverb Time', cc: 89, type: 'fader' },
    { label: 'Reverb Level', cc: 91, type: 'fader' },
    { label: 'Delay Time', cc: 90, type: 'fader' },
    { label: 'Delay Level', cc: 92, type: 'fader' },
    { label: 'Send Reverb', cc: 86, type: 'fader' },
    { label: 'Send Delay', cc: 85, type: 'fader' },
    { label: 'Output Bus', cc: 84, type: 'selector', options: ['A', 'B', 'Effect'] },
    { label: 'Auto Pan', cc: 9, type: 'selector', options: ['Off', 'Alt', 'Swing', 'Rnd'] },
    { label: 'Pan', cc: 10, type: 'fader' },
    { label: 'Level', cc: 7, type: 'fader' },
    { label: 'Level Jitter', cc: 14, type: 'fader' },
  ],
};

export const allSections: Section[] = [
  granularSection,
  filterSection,
  ampEnvSection,
  effectsSection,
];

export const p6GranularController: ControllerConfig = {
  id: 'p6-granular',
  name: 'P-6 Granular Engine',
  defaultChannel: 5,
  sections: allSections,
};
