export const themes: Record<
  string,
  {
    label: string;
    primary: string;
    neutral: string;
    font: string;
    mode: 'light' | 'dark';
  }
> = {
  controlRoomDark: {
    label: 'Control Room Dark',
    primary: 'arc-teal',
    neutral: 'obsidian-grid',
    font: 'Geist',
    mode: 'dark',
  },
  navyCadDark: {
    label: 'Navy CAD Dark',
    primary: 'blueprint-cyan',
    neutral: 'navy-steel',
    font: 'Public Sans',
    mode: 'dark',
  },
  foundryDark: {
    label: 'Foundry Dark',
    primary: 'alloy-orange',
    neutral: 'gunmetal',
    font: 'Roboto',
    mode: 'dark',
  },
  indigoCommandDark: {
    label: 'Indigo Command Dark',
    primary: 'indigo-draft',
    neutral: 'obsidian-grid',
    font: 'Geist',
    mode: 'dark',
  },
  engineeringPaperLight: {
    label: 'Engineering Paper Light',
    primary: 'cerulean-tech',
    neutral: 'porcelain-gray',
    font: 'Nunito',
    mode: 'light',
  },
  processLabLight: {
    label: 'Process Lab Light',
    primary: 'petro-teal',
    neutral: 'mist-steel',
    font: 'Raleway',
    mode: 'light',
  },
  executiveDraftLight: {
    label: 'Executive Draft Light',
    primary: 'indigo-draft',
    neutral: 'paper-stone',
    font: 'Inter',
    mode: 'light',
  },
  aeroGridLight: {
    label: 'Aero Grid Light',
    primary: 'aero-blue',
    neutral: 'ice-panel',
    font: 'Open Sans',
    mode: 'light',
  },
  copperFieldLight: {
    label: 'Copper Field Light',
    primary: 'copper-accent',
    neutral: 'linen-tech',
    font: 'Montserrat',
    mode: 'light',
  },
  quartzLight: {
    label: 'Quartz Light',
    primary: 'quartz-violet',
    neutral: 'smoke-silver',
    font: 'Inter',
    mode: 'light',
  },
  supabase: {
    label: 'Supabase',
    primary: 'supabase-green',
    neutral: 'supabase-slate',
    font: 'Outfit',
    mode: 'dark',
  },
  doom: {
    label: 'Doom',
    primary: 'doom-red',
    neutral: 'doom-neutral',
    font: 'Oxanium',
    mode: 'dark',
  },
};

export type ThemeKey = keyof typeof themes;

export const themeRoleMap: Record<
  ThemeKey,
  {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    accent: string;
    border: string;
    muted: string;
    danger: string;
    warning: string;
    success: string;
  }
> = {
  controlRoomDark: {
    background: '--color-obsidian-grid-950',
    surface: '--color-obsidian-grid-900',
    primary: '--color-arc-teal-500',
    secondary: '--color-obsidian-grid-700',
    accent: '--color-blueprint-cyan-400',
    border: '--color-obsidian-grid-700',
    muted: '--color-obsidian-grid-400',
    danger: '--color-red-500',
    warning: '--color-amber-500',
    success: '--color-green-500',
  },
  navyCadDark: {
    background: '--color-navy-steel-950',
    surface: '--color-navy-steel-900',
    primary: '--color-blueprint-cyan-500',
    secondary: '--color-navy-steel-700',
    accent: '--color-arc-teal-400',
    border: '--color-navy-steel-700',
    muted: '--color-navy-steel-400',
    danger: '--color-red-500',
    warning: '--color-amber-500',
    success: '--color-green-500',
  },
  foundryDark: {
    background: '--color-gunmetal-950',
    surface: '--color-gunmetal-900',
    primary: '--color-alloy-orange-500',
    secondary: '--color-gunmetal-700',
    accent: '--color-blueprint-cyan-400',
    border: '--color-gunmetal-700',
    muted: '--color-gunmetal-400',
    danger: '--color-red-500',
    warning: '--color-amber-500',
    success: '--color-green-500',
  },
  indigoCommandDark: {
    background: '--color-obsidian-grid-950',
    surface: '--color-obsidian-grid-900',
    primary: '--color-indigo-draft-500',
    secondary: '--color-obsidian-grid-700',
    accent: '--color-blueprint-cyan-400',
    border: '--color-obsidian-grid-700',
    muted: '--color-obsidian-grid-400',
    danger: '--color-red-500',
    warning: '--color-amber-500',
    success: '--color-green-500',
  },
  engineeringPaperLight: {
    background: '--color-porcelain-gray-50',
    surface: '--color-porcelain-gray-100',
    primary: '--color-cerulean-tech-600',
    secondary: '--color-porcelain-gray-300',
    accent: '--color-petro-teal-500',
    border: '--color-porcelain-gray-300',
    muted: '--color-porcelain-gray-600',
    danger: '--color-red-600',
    warning: '--color-amber-700',
    success: '--color-green-700',
  },
  processLabLight: {
    background: '--color-mist-steel-50',
    surface: '--color-mist-steel-100',
    primary: '--color-petro-teal-600',
    secondary: '--color-mist-steel-300',
    accent: '--color-cerulean-tech-500',
    border: '--color-mist-steel-300',
    muted: '--color-mist-steel-600',
    danger: '--color-red-600',
    warning: '--color-amber-700',
    success: '--color-green-700',
  },
  executiveDraftLight: {
    background: '--color-paper-stone-50',
    surface: '--color-paper-stone-100',
    primary: '--color-indigo-draft-600',
    secondary: '--color-paper-stone-300',
    accent: '--color-cerulean-tech-500',
    border: '--color-paper-stone-300',
    muted: '--color-paper-stone-600',
    danger: '--color-red-600',
    warning: '--color-amber-700',
    success: '--color-green-700',
  },
  aeroGridLight: {
    background: '--color-ice-panel-50',
    surface: '--color-ice-panel-100',
    primary: '--color-aero-blue-600',
    secondary: '--color-ice-panel-300',
    accent: '--color-arc-teal-500',
    border: '--color-ice-panel-300',
    muted: '--color-ice-panel-600',
    danger: '--color-red-600',
    warning: '--color-amber-700',
    success: '--color-green-700',
  },
  copperFieldLight: {
    background: '--color-linen-tech-50',
    surface: '--color-linen-tech-100',
    primary: '--color-copper-accent-600',
    secondary: '--color-linen-tech-300',
    accent: '--color-cerulean-tech-500',
    border: '--color-linen-tech-300',
    muted: '--color-linen-tech-600',
    danger: '--color-red-600',
    warning: '--color-amber-700',
    success: '--color-green-700',
  },
  quartzLight: {
    background: '--color-smoke-silver-50',
    surface: '--color-smoke-silver-100',
    primary: '--color-quartz-violet-600',
    secondary: '--color-smoke-silver-300',
    accent: '--color-aero-blue-500',
    border: '--color-smoke-silver-300',
    muted: '--color-smoke-silver-600',
    danger: '--color-red-600',
    warning: '--color-amber-700',
    success: '--color-green-700',
  },
};
