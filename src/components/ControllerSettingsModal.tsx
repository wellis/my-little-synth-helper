import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../config/theme';
import { useMidiStore } from '../store/useMidiStore';

interface ControllerSettingsModalProps {
  controllerId: string;
  controllerName: string;
  visible: boolean;
  onClose: () => void;
}

const CHANNELS = Array.from({ length: 16 }, (_, i) => i + 1);

export function ControllerSettingsModal({
  controllerId,
  controllerName,
  visible,
  onClose,
}: ControllerSettingsModalProps) {
  const channel = useMidiStore(
    (s) => s.controllers[controllerId]?.channel ?? 1
  );
  const setChannel = useMidiStore((s) => s.setChannel);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <Text style={styles.title}>{controllerName}</Text>
          <Text style={styles.label}>MIDI Channel</Text>
          <View style={styles.channelGrid}>
            {CHANNELS.map((ch) => (
              <Pressable
                key={ch}
                style={[
                  styles.channelButton,
                  ch === channel && styles.channelButtonActive,
                ]}
                onPress={() => setChannel(controllerId, ch)}
              >
                <Text
                  style={[
                    styles.channelText,
                    ch === channel && styles.channelTextActive,
                  ]}
                >
                  {ch}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    minWidth: 300,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  label: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 10,
  },
  channelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  channelButton: {
    width: 44,
    height: 36,
    borderRadius: 6,
    backgroundColor: colors.surfaceLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  channelButtonActive: {
    backgroundColor: colors.accentDim,
    borderColor: colors.accent,
  },
  channelText: {
    color: colors.textDim,
    fontSize: 14,
    fontWeight: '600',
  },
  channelTextActive: {
    color: colors.accent,
  },
  closeButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeText: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '600',
  },
});
