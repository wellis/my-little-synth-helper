import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SectionPanel } from '../src/components/SectionPanel';
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

  useEffect(() => {
    registerController(p6GranularController);
  }, [registerController]);

  return (
    <View style={styles.container}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: layout.screenPadding,
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
