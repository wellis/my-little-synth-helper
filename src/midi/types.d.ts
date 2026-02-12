declare module '@motiz88/react-native-midi' {
  export interface MidiPort {
    id: string;
    name: string;
    type: 'input' | 'output';
  }

  export function listDevices(): Promise<MidiPort[]>;
  export function send(deviceId: string, data: number[]): void;
  export function onMessage(
    callback: (deviceId: string, data: number[]) => void
  ): () => void;
}
