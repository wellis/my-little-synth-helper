import { requireNativeModule } from 'expo-modules-core';
import type { EventSubscription } from 'expo-modules-core';

export interface MidiDevice {
  id: number;
  name: string;
  isSource: boolean;
  isDestination: boolean;
}

export interface MidiCCEvent {
  channel: number;
  cc: number;
  value: number;
}

export interface DevicesChangedEvent {
  devices: MidiDevice[];
}

interface ExpoMidiModule {
  initialize(): Promise<void>;
  listDevices(): MidiDevice[];
  connect(deviceId: number): Promise<boolean>;
  disconnect(): void;
  sendCC(channel: number, cc: number, value: number): void;
  addListener<T>(eventName: string, listener: (event: T) => void): EventSubscription;
}

export default requireNativeModule<ExpoMidiModule>('ExpoMidi');
