import { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui';

export const customHandlers = {
  imageUpload: {
    canExecute: (editor: any) => editor.can().insertContent({ type: 'imageUpload' }),
    execute: (editor: any) => editor.chain().focus().insertContent({ type: 'imageUpload' }),
    isActive: (editor: any) => editor.isActive('imageUpload'),
    isDisabled: undefined,
  },
} satisfies EditorCustomHandlers;

export const itemsSuggestions: EditorToolbarItem[] = [
  { kind: 'undo', icon: 'i-lucide-undo', label: 'Desfazer' },
  { kind: 'redo', icon: 'i-lucide-redo', label: 'Refazer' },
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', label: 'Negrito' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', label: 'Itálico' },
  { kind: 'heading', level: 1, icon: 'i-lucide-heading-1', label: 'Título 1' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', label: 'Título 2' },
  {
    kind: 'textAlign',
    align: 'left',
    icon: 'i-lucide-align-left',
    label: 'Alinhar à esquerda',
  },
  {
    kind: 'textAlign',
    align: 'center',
    icon: 'i-lucide-align-center',
    label: 'Centralizar',
  },
  { kind: 'bulletList', icon: 'i-lucide-list', label: 'Lista com marcadores' },
  {
    kind: 'orderedList',
    icon: 'i-lucide-list-ordered',
    label: 'Lista numerada',
  },
  { kind: 'blockquote', icon: 'i-lucide-quote', label: 'Citação' },
  { slot: 'link' as const },
  { kind: 'codeBlock', icon: 'i-lucide-code', label: 'Bloco de código' },
  { kind: 'imageUpload', icon: 'i-lucide-image', label: 'Inserir imagem' },
];

export const items: EditorToolbarItem[] = [
  { kind: 'undo', icon: 'i-lucide-undo' },
  { kind: 'redo', icon: 'i-lucide-redo' },
  { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
  { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
  { kind: 'heading', level: 1, icon: 'i-lucide-heading-1' },
  { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
  { kind: 'textAlign', align: 'left', icon: 'i-lucide-align-left' },
  { kind: 'textAlign', align: 'center', icon: 'i-lucide-align-center' },
  { kind: 'bulletList', icon: 'i-lucide-list' },
  { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
  { kind: 'blockquote', icon: 'i-lucide-quote' },
  { slot: 'link' as const },
  { kind: 'codeBlock', icon: 'i-lucide-code' },
  { kind: 'imageUpload', icon: 'i-lucide-image', label: 'Inserir imagem' },
];
