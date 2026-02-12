/**
 * MIDI Manager - handles device connection and CC send/receive.
 *
 * Uses the local expo-midi native module for CoreMIDI access.
 * Falls back to a no-op stub on simulator or when native module is unavailable.
 */

import ExpoMidi from 'expo-midi';
import type { MidiCCEvent, DevicesChangedEvent } from 'expo-midi';

export interface MidiDevice {
  id: string;
  name: string;
  type: 'usb' | 'ble';
}

export type CCListener = (channel: number, cc: number, value: number) => void;

class MidiManager {
  private outputDeviceId: string | null = null;
  private listeners: Set<CCListener> = new Set();
  private nativeAvailable = false;
  private ccSubscription: { remove(): void } | null = null;
  private devicesSubscription: { remove(): void } | null = null;
  private devicesChangedCallbacks: Set<() => void> = new Set();

  async initialize(): Promise<void> {
    try {
      await ExpoMidi.initialize();
      this.nativeAvailable = true;
      console.log('[MIDI] Native CoreMIDI module initialized');

      this.ccSubscription = ExpoMidi.addListener('onMidiCC', (event: MidiCCEvent) => {
        this.handleIncomingCC(event.channel, event.cc, event.value);
      });

      this.devicesSubscription = ExpoMidi.addListener('onDevicesChanged', (_event: DevicesChangedEvent) => {
        for (const cb of this.devicesChangedCallbacks) {
          cb();
        }
      });
    } catch {
      console.log('[MIDI] Native module not available — running in stub mode');
    }
  }

  async listDevices(): Promise<MidiDevice[]> {
    if (!this.nativeAvailable) {
      return [{ id: 'stub', name: 'Simulator (stub)', type: 'usb' }];
    }
    const nativeDevices = ExpoMidi.listDevices();
    return nativeDevices.map((d) => ({
      id: String(d.id),
      name: d.name,
      type: 'usb' as const,
    }));
  }

  async connect(deviceId: string): Promise<boolean> {
    if (this.nativeAvailable && deviceId !== 'stub') {
      const success = await ExpoMidi.connect(Number(deviceId));
      if (success) {
        this.outputDeviceId = deviceId;
        console.log(`[MIDI] Connected to ${deviceId}`);
        return true;
      }
      return false;
    }
    this.outputDeviceId = deviceId;
    console.log(`[MIDI] Connected to ${deviceId}`);
    return true;
  }

  disconnect(): void {
    if (this.nativeAvailable) {
      ExpoMidi.disconnect();
    }
    this.outputDeviceId = null;
    console.log('[MIDI] Disconnected');
  }

  sendCC(channel: number, cc: number, value: number): void {
    const clamped = Math.max(0, Math.min(127, Math.round(value)));

    if (this.nativeAvailable && this.outputDeviceId && this.outputDeviceId !== 'stub') {
      ExpoMidi.sendCC(channel, cc, clamped);
    }

    console.log(
      `[MIDI] CC ch${channel} cc${cc} val${clamped}` +
        (this.nativeAvailable ? '' : ' (stub)')
    );
  }

  onCC(listener: CCListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  onDevicesChanged(callback: () => void): () => void {
    this.devicesChangedCallbacks.add(callback);
    return () => this.devicesChangedCallbacks.delete(callback);
  }

  /** Called by the native receive callback */
  handleIncomingCC(channel: number, cc: number, value: number): void {
    for (const listener of this.listeners) {
      listener(channel, cc, value);
    }
  }

  get isConnected(): boolean {
    return this.outputDeviceId !== null;
  }

  get connectedDeviceId(): string | null {
    return this.outputDeviceId;
  }
}

export const midiManager = new MidiManager();
