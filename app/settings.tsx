import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useMidiStore } from '../src/store/useMidiStore';
import { colors } from '../src/config/theme';

export default function SettingsScreen() {
  const devices = useMidiStore((s) => s.devices);
  const connectedDeviceId = useMidiStore((s) => s.connectedDeviceId);
  const connectDevice = useMidiStore((s) => s.connectDevice);
  const disconnectDevice = useMidiStore((s) => s.disconnectDevice);
  const refreshDevices = useMidiStore((s) => s.refreshDevices);
  const controllers = useMidiStore((s) => s.controllers);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>MIDI Connection</Text>
        <Text style={styles.info}>
          Status: {connectedDeviceId ? 'Connected' : 'Disconnected'}
        </Text>

        <Pressable style={styles.button} onPress={refreshDevices}>
          <Text style={styles.buttonText}>Refresh Devices</Text>
        </Pressable>

        <View style={styles.deviceList}>
          {devices.map((device) => {
            const isConnected = device.id === connectedDeviceId;
            return (
              <Pressable
                key={device.id}
                style={[
                  styles.deviceItem,
                  isConnected && styles.deviceItemActive,
                ]}
                onPress={() =>
                  isConnected
                    ? disconnectDevice()
                    : connectDevice(device.id)
                }
              >
                <View>
                  <Text
                    style={[
                      styles.deviceName,
                      isConnected && styles.deviceNameActive,
                    ]}
                  >
                    {device.name}
                  </Text>
                  <Text style={styles.deviceType}>{device.type.toUpperCase()}</Text>
                </View>
                <Text style={styles.deviceStatus}>
                  {isConnected ? 'Tap to disconnect' : 'Tap to connect'}
                </Text>
              </Pressable>
            );
          })}

          {devices.length === 0 && (
            <Text style={styles.emptyText}>
              No MIDI devices found. Tap Refresh to scan.
            </Text>
          )}
        </View>

        {Object.keys(controllers).length > 0 && (
          <View style={styles.controllerSummary}>
            <Text style={styles.subTitle}>Controllers</Text>
            {Object.entries(controllers).map(([id, ctrl]) => (
              <View key={id} style={styles.controllerRow}>
                <Text style={styles.controllerName}>{id}</Text>
                <Text style={styles.controllerChannel}>Ch {ctrl.channel}</Text>
              </View>
            ))}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.info}>My Little Synth Helper v1.0.0</Text>
        <Text style={styles.info}>
          Fader-based MIDI controller interface for hardware synths.
        </Text>
        <Text style={styles.infoNote}>
          Connect your synth via USB adapter or Bluetooth MIDI.
          Native MIDI requires a dev client build (expo prebuild).
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 24,
    flexDirection: 'row',
    gap: 24,
  },
  section: {
    flex: 1,
    backgroundColor: colors.sectionBg,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  subTitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  info: {
    color: colors.text,
    fontSize: 14,
    marginBottom: 6,
  },
  infoNote: {
    color: colors.textDim,
    fontSize: 12,
    marginTop: 8,
    lineHeight: 18,
  },
  button: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    marginBottom: 16,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: colors.border,
  },
  buttonText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
  deviceList: {
    gap: 8,
  },
  deviceItem: {
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  deviceItemActive: {
    borderColor: colors.accent,
    backgroundColor: colors.accentDim + '22',
  },
  deviceName: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  deviceNameActive: {
    color: colors.accent,
  },
  deviceType: {
    color: colors.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  deviceStatus: {
    color: colors.textDim,
    fontSize: 12,
  },
  emptyText: {
    color: colors.textDim,
    fontSize: 13,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  controllerSummary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  controllerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  controllerName: {
    color: colors.text,
    fontSize: 13,
  },
  controllerChannel: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
