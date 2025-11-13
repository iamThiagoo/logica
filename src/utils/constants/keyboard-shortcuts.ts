import type { KeyboardShortcutCatalogGroup, KeyboardShortcutCatalogItem, KeyboardShortcutId, KeyboardShortcutResolvableId } from '@/utils/types/keyboard-shortcuts';

export const KEYBOARD_SHORTCUT_SEQUENCE_TIMEOUT_MS = 1000;

const MODIFIER_ALIASES: Record<string, string> = {
  control: 'ctrl',
  command: 'meta',
  cmd: 'meta',
  option: 'alt',
};

const KEY_ALIASES: Record<string, string> = {
  delete: 'del',
  esc: 'escape',
  return: 'enter',
  ' ': 'space',
};

export const RESERVED_SHORTCUT_TOKENS = new Set<string>([
  // Navegador/sistema: evitamos permitir override para nao degradar UX global.
  'ctrl+r',
  'ctrl+t',
  'ctrl+w',
  'ctrl+n',
  'ctrl+l',
  'ctrl+shift+t',
  'ctrl+tab',
  'ctrl+shift+tab',
  'ctrl+1',
  'ctrl+2',
  'ctrl+3',
  'ctrl+4',
  'ctrl+5',
  'ctrl+6',
  'ctrl+7',
  'ctrl+8',
  'ctrl+9',
  'meta+r',
  'meta+t',
  'meta+w',
  'meta+n',
  'meta+l',
  'meta+q',
]);

export const normalizeShortcutToken = (token: string): string => {
  const raw = token.trim().toLowerCase();
  if (!raw) return '';

  if (raw === '?') return '?';
  if (raw === '/') return '/';

  const parts = raw
    .split('+')
    .map((part) => part.trim())
    .filter(Boolean);
  if (!parts.length) return '';

  const mapped = parts.map((part) => MODIFIER_ALIASES[part] || KEY_ALIASES[part] || part);
  const modifiers = ['ctrl', 'meta', 'alt', 'shift'].filter((modifier) => mapped.includes(modifier));
  const key = mapped.find((part) => !['ctrl', 'meta', 'alt', 'shift'].includes(part)) || '';

  return key ? [...modifiers, key].join('+') : [...modifiers].join('+');
};

export const normalizeShortcutKeys = (keys: string[]): string[] => keys.map((key) => normalizeShortcutToken(key)).filter(Boolean);

export const serializeShortcutKeys = (keys: string[]): string => normalizeShortcutKeys(keys).join(' ');

export const isReservedShortcut = (keys: string[]): boolean => {
  const normalized = normalizeShortcutKeys(keys);
  if (normalized.length !== 1) return false;
  return RESERVED_SHORTCUT_TOKENS.has(normalized[0]);
};

export const keyboardEventToToken = (event: KeyboardEvent): string => {
  const key = event.key;

  if (key === '?') return '?';
  if (key === '/') return '/';

  const lowered = key.toLowerCase();
  if (['control', 'shift', 'alt', 'meta'].includes(lowered)) return '';

  const baseKey = normalizeShortcutToken(lowered);
  if (!baseKey) return '';

  const modifiers: string[] = [];
  if (event.ctrlKey) modifiers.push('ctrl');
  if (event.metaKey) modifiers.push('meta');
  if (event.altKey) modifiers.push('alt');
  // "?" ja vem com shift aplicado no event.key em layouts comuns.
  if (event.shiftKey && baseKey !== '?') modifiers.push('shift');

  return normalizeShortcutToken([...modifiers, baseKey].join('+'));
};

export const KEYBOARD_SHORTCUT_CATALOG: KeyboardShortcutCatalogGroup[] = [
  {
    category: 'navigation',
    title: 'Navegação',
    description: 'Acesso rápido entre áreas principais do sistema.',
    shortcuts: [
      {
        id: 'nav-dashboard',
        category: 'navigation',
        label: 'Ir para Dashboard',
        description: 'Abre a página inicial do dashboard.',
        defaultKeys: ['shift+d'],
      },
      {
        id: 'nav-settings',
        category: 'navigation',
        label: 'Abrir Configurações',
        description: 'Abre as configurações da aplicação.',
        defaultKeys: ['shift+g'],
      },
      {
        id: 'nav-meetings',
        category: 'navigation',
        label: 'Ir para Sala de Reuniões',
        description: 'Navega para Agenda de Reuniões.',
        defaultKeys: ['shift+r'],
      },
    ],
  },
  {
    category: 'form',
    title: 'Formulários',
    description: 'Salve ou envie formulários rapidamente.',
    shortcuts: [
      {
        id: 'form-save',
        category: 'form',
        label: 'Salvar formulário',
        description: 'Aciona o salvamento do formulário ativo.',
        defaultKeys: ['shift+s'],
      },
    ],
  },
  {
    category: 'table',
    title: 'Ações em Tabela',
    description: 'Ações rápidas em páginas baseadas em tabela.',
    shortcuts: [
      {
        id: 'table-search',
        category: 'table',
        label: 'Focar busca',
        description: 'Foca no campo de pesquisa da tabela.',
        defaultKeys: ['/'],
      },
      {
        id: 'table-create',
        category: 'table',
        label: 'Adicionar novo registro',
        description: 'Aciona o botão de criação da página.',
        defaultKeys: ['a'],
      },
      {
        id: 'table-focus-filters',
        category: 'table',
        label: 'Focar filtros',
        description: 'Foca no primeiro controle de filtro disponível.',
        defaultKeys: ['shift+f'],
      },
      {
        id: 'table-focus-favorites',
        category: 'table',
        label: 'Focar favoritos',
        description: 'Foca no controle de favoritos quando disponível.',
        defaultKeys: ['shift+c'],
      },
    ],
  },
  {
    category: 'system',
    title: 'Sistema',
    description: 'Atalhos utilitários da interface.',
    shortcuts: [
      {
        id: 'system-cheatsheet',
        category: 'system',
        label: 'Abrir cheatsheet',
        description: 'Mostra a lista completa de atalhos.',
        defaultKeys: ['?'],
      },
      {
        id: 'system-feedback',
        category: 'system',
        label: 'Abrir Feedback',
        description: 'Abre o formulário de sugestões e feedback.',
        defaultKeys: ['f'],
      },
      {
        id: 'system-logout',
        category: 'system',
        label: 'Sair da conta',
        description: 'Faz logout e redireciona para a tela de login.',
        defaultKeys: ['shift+e'],
      },
    ],
  },
];

export const KEYBOARD_SHORTCUTS_BY_ID = KEYBOARD_SHORTCUT_CATALOG.flatMap((group) => group.shortcuts).reduce<Record<string, KeyboardShortcutCatalogItem>>((acc, shortcut) => {
  acc[shortcut.id] = shortcut;
  return acc;
}, {});

export const KEYBOARD_SHORTCUT_DEFAULTS_BY_ID = Object.entries(KEYBOARD_SHORTCUTS_BY_ID).reduce<Record<string, string[]>>((acc, [id, shortcut]) => {
  acc[id] = normalizeShortcutKeys(shortcut.defaultKeys);
  return acc;
}, {});

export const getShortcutDefaultKeys = (id: KeyboardShortcutResolvableId): string[] | null => {
  const keys = KEYBOARD_SHORTCUT_DEFAULTS_BY_ID[id];
  if (!keys) return null;
  return [...keys];
};

export const isCatalogShortcut = (id: string): id is KeyboardShortcutId => id in KEYBOARD_SHORTCUT_DEFAULTS_BY_ID;
