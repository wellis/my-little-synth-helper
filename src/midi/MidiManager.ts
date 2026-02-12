/**
 * MIDI Manager - handles device connection and CC send/receive.
 *
 * Uses a pluggable transport so we can swap in the real native MIDI library
 * (@motiz88/react-native-midi or similar) once the dev client is built.
 * In dev/simulator mode, falls back to a no-op stub that logs to console.
 */

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

  async initialize(): Promise<void> {
    try {
      // Try to import native MIDI module
      const mod = await import('@motiz88/react-native-midi').catch(() => null);
      if (mod) {
        this.nativeAvailable = true;
        console.log('[MIDI] Native MIDI module available');
      } else {
        console.log('[MIDI] Native MIDI not available — running in stub mode');
      }
    } catch {
      console.log('[MIDI] Running in stub mode');
    }
  }

  async listDevices(): Promise<MidiDevice[]> {
    if (!this.nativeAvailable) {
      return [{ id: 'stub', name: 'Simulator (stub)', type: 'usb' }];
    }
    // TODO: enumerate real CoreMIDI devices
    return [];
  }

  async connect(deviceId: string): Promise<boolean> {
    this.outputDeviceId = deviceId;
    console.log(`[MIDI] Connected to ${deviceId}`);
    return true;
  }

  disconnect(): void {
    this.outputDeviceId = null;
    console.log('[MIDI] Disconnected');
  }

  sendCC(channel: number, cc: number, value: number): void {
    const clamped = Math.max(0, Math.min(127, Math.round(value)));
    const statusByte = 0xb0 | ((channel - 1) & 0x0f);

    if (this.nativeAvailable && this.outputDeviceId) {
      // TODO: send via native module
      // NativeMidi.send(this.outputDeviceId, [statusByte, cc, clamped]);
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
