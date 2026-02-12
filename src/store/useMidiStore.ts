import { create } from 'zustand';
import { midiManager, MidiDevice } from '../midi/MidiManager';
import { ControllerConfig } from '../config/types';

interface ControllerState {
  channel: number;
  ccValues: Record<number, number>;
}

interface MidiState {
  controllers: Record<string, ControllerState>;
  devices: MidiDevice[];
  connectedDeviceId: string | null;
  initialized: boolean;

  initialize: () => Promise<void>;
  refreshDevices: () => Promise<void>;
  connectDevice: (deviceId: string) => Promise<void>;
  disconnectDevice: () => void;
  registerController: (config: ControllerConfig) => void;
  setChannel: (controllerId: string, channel: number) => void;
  sendCC: (controllerId: string, cc: number, value: number) => void;
}

export const useMidiStore = create<MidiState>((set, get) => ({
  controllers: {},
  devices: [],
  connectedDeviceId: null,
  initialized: false,

  initialize: async () => {
    await midiManager.initialize();

    midiManager.onCC((channel, cc, value) => {
      const { controllers } = get();
      for (const [id, ctrl] of Object.entries(controllers)) {
        if (ctrl.channel === channel) {
          set((state) => ({
            controllers: {
              ...state.controllers,
              [id]: {
                ...state.controllers[id],
                ccValues: { ...state.controllers[id].ccValues, [cc]: value },
              },
            },
          }));
        }
      }
    });

    const devices = await midiManager.listDevices();
    set({ initialized: true, devices });
  },

  refreshDevices: async () => {
    const devices = await midiManager.listDevices();
    set({ devices });
  },

  connectDevice: async (deviceId: string) => {
    const success = await midiManager.connect(deviceId);
    if (success) {
      set({ connectedDeviceId: deviceId });
    }
  },

  disconnectDevice: () => {
    midiManager.disconnect();
    set({ connectedDeviceId: null });
  },

  registerController: (config: ControllerConfig) => {
    const { controllers } = get();
    if (controllers[config.id]) return;
    set((state) => ({
      controllers: {
        ...state.controllers,
        [config.id]: {
          channel: config.defaultChannel,
          ccValues: {},
        },
      },
    }));
  },

  setChannel: (controllerId: string, channel: number) => {
    set((state) => ({
      controllers: {
        ...state.controllers,
        [controllerId]: {
          ...state.controllers[controllerId],
          channel,
        },
      },
    }));
  },

  sendCC: (controllerId: string, cc: number, value: number) => {
    const ctrl = get().controllers[controllerId];
    if (!ctrl) return;
    midiManager.sendCC(ctrl.channel, cc, value);
    set((state) => ({
      controllers: {
        ...state.controllers,
        [controllerId]: {
          ...state.controllers[controllerId],
          ccValues: { ...state.controllers[controllerId].ccValues, [cc]: value },
        },
      },
    }));
  },
}));
