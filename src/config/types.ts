export type ControlType = 'fader' | 'toggle' | 'selector' | 'list';

export interface CCParam {
  label: string;
  cc: number;
  type: ControlType;
  options?: string[];
  defaultValue?: number;
}

export interface Section {
  title: string;
  params: CCParam[];
}

export interface ControllerConfig {
  id: string;
  name: string;
  defaultChannel: number;
  sections: Section[];
}
