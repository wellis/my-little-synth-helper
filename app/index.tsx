import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SectionPanel } from '../src/components/SectionPanel';
import { ControllerSettingsModal } from '../src/components/ControllerSettingsModal';
import {
  p6GranularController,
  granularSection,
  filterSection,
  ampEnvSection,
  effectsSection,
} from '../src/config/p6-granular';
import { colors, layout } from '../src/config/theme';
import { useMidiStore } from '../src/store/useMidiStore';

const CONTROLLER_ID = p6GranularController.id;

export default function P6GranularScreen() {
  const registerController = useMidiStore((s) => s.registerController);
  const [settingsVisible, setSettingsVisible] = useState(false);

  useEffect(() => {
    registerController(p6GranularController);
  }, [registerController]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{p6GranularController.name}</Text>
        <Pressable
          style={styles.gearButton}
          onPress={() => setSettingsVisible(true)}
        >
          <Text style={styles.gearText}>&#x2699;</Text>
        </Pressable>
      </View>

      <View style={styles.columns}>
        {/* Left column: Granular (large) */}
        <View style={styles.column}>
          <SectionPanel section={granularSection} controllerId={CONTROLLER_ID} />
        </View>

        {/* Middle column: Filter + Amp Envelope stacked */}
        <View style={styles.column}>
          <SectionPanel section={filterSection} controllerId={CONTROLLER_ID} />
          <SectionPanel section={ampEnvSection} controllerId={CONTROLLER_ID} />
        </View>

        {/* Right column: Effects / Output */}
        <View style={styles.column}>
          <SectionPanel section={effectsSection} controllerId={CONTROLLER_ID} />
        </View>
      </View>

      <ControllerSettingsModal
        controllerId={CONTROLLER_ID}
        controllerName={p6GranularController.name}
        visible={settingsVisible}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: layout.screenPadding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: layout.sectionGap,
  },
  headerTitle: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  gearButton: {
    padding: 6,
  },
  gearText: {
    color: colors.textDim,
    fontSize: 20,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
    gap: layout.sectionGap,
  },
  column: {
    flex: 1,
    gap: layout.sectionGap,
  },
});
