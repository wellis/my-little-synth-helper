import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, layout } from '../config/theme';
import { Section, CCParam } from '../config/types';
import { useMidiStore } from '../store/useMidiStore';
import { Fader } from './Fader';
import { Toggle } from './Toggle';
import { Selector } from './Selector';
import { ListPicker } from './ListPicker';

interface SectionPanelProps {
  section: Section;
  controllerId: string;
}

// Default list items for sample/pattern pickers
const SAMPLE_ITEMS = Array.from({ length: 128 }, (_, i) => `${i}`);

function ParamControl({ param, controllerId }: { param: CCParam; controllerId: string }) {
  const ccValue = useMidiStore(
    (s) => s.controllers[controllerId]?.ccValues[param.cc] ?? 0
  );
  const sendCC = useMidiStore((s) => s.sendCC);

  const handleChange = useCallback(
    (val: number) => sendCC(controllerId, param.cc, val),
    [controllerId, param.cc, sendCC]
  );

  switch (param.type) {
    case 'fader':
      return (
        <Fader label={param.label} value={ccValue} onValueChange={handleChange} />
      );
    case 'toggle':
      return (
        <Toggle
          label={param.label}
          options={(param.options as [string, string]) ?? ['Off', 'On']}
          value={ccValue}
          onValueChange={handleChange}
        />
      );
    case 'selector':
      return (
        <Selector
          label={param.label}
          options={param.options ?? []}
          value={ccValue}
          onValueChange={handleChange}
        />
      );
    case 'list':
      return (
        <ListPicker
          label={param.label}
          items={SAMPLE_ITEMS}
          value={ccValue}
          onValueChange={handleChange}
        />
      );
  }
}

export function SectionPanel({ section, controllerId }: SectionPanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{section.title}</Text>
      <View style={styles.controls}>
        {section.params.map((param) => (
          <ParamControl key={param.cc} param={param} controllerId={controllerId} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.sectionBg,
    borderRadius: layout.borderRadius,
    padding: layout.sectionPadding,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  controls: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: layout.gap,
    alignItems: 'flex-end',
  },
});
