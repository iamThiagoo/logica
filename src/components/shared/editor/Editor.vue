<template>
  <UEditor ref="editorRef" v-slot="{ editor }" :model-value="modelValue" :handlers="handlers" :extensions="allExtensions" :content-type="contentType" :ui="editorUi" :placeholder="placeholder" class="w-full min-h-full" @update:model-value="$emit('update:modelValue', $event)">
    <UEditorToolbar :editor="editor" :items="toolbarItems" :class="toolbarClass">
      <template #link>
        <EditorLinkPopover :editor="editor" auto-open />
      </template>
    </UEditorToolbar>

    <UEditorSuggestionMenu :editor="editor" :items="itemsSuggestions" :append-to="appendToBody" />
  </UEditor>
</template>

<script setup lang="ts">
import TextAlign from '@tiptap/extension-text-align';
import { items as editorItems, itemsSuggestions, customHandlers } from '@/utils/helpers/app/editor';
import ImageUpload from '@/components/shared/editor/EditorImageUpload';
import { useEditorCompletion } from '@/composables/use-editor-completion';
import { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui';
import EditorLinkPopover from '@/components/shared/editor/EditorLinkPopover.vue';

interface Props {
  modelValue?: string;
  placeholder?: string;
  contentType?: 'html' | 'markdown';
  includeImageUpload?: boolean;
  includeTextAlign?: boolean;
  includeAiTools?: boolean;
  minHeight?: string;
  toolbarClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Digite aqui...',
  contentType: 'html',
  includeImageUpload: true,
  includeTextAlign: true,
  includeAiTools: true,
  minHeight: '36',
  toolbarClass: 'border border-default rounded-t-lg py-2 px-3 w-auto overflow-x-auto',
});

defineEmits<{
  'update:modelValue': [value: string];
}>();

const appendToBody = undefined;
const editorRef = useTemplateRef('editorRef');
const allExtensions = computed(() => {
  const extensions = [];
  if (props.includeImageUpload) {
    extensions.push(ImageUpload);
  }

  extensions.push(
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    })
  );

  return extensions;
});

const editorUi = computed(() => ({
  base: `px-5! py-3 min-h-${props.minHeight} border border-default rounded-b-lg`,
}));

const {
  extension: completionExtension,
  handlers: aiHandlers,
  isLoading: aiLoading,
} = useEditorCompletion(editorRef, {
  api: 'http://localhost:3000/write',
});

const handlers = computed(() => {
  if (props.includeAiTools) {
    return { ...aiHandlers, ...customHandlers } satisfies EditorCustomHandlers;
  }
  return { ...customHandlers } satisfies EditorCustomHandlers;
});

const aiToolbarItems = computed<EditorToolbarItem<typeof handlers.value>[][]>(() => [
  [
    {
      icon: 'i-lucide-sparkles',
      label: 'Aprimorar',
      variant: 'soft',
      loading: aiLoading.value,
      content: { align: 'start' },
      items: [
        {
          kind: 'aiFix',
          icon: 'i-lucide-spell-check',
          label: 'Corrigir ortografia e gramática',
        },
        {
          kind: 'aiExtend',
          icon: 'i-lucide-unfold-vertical',
          label: 'Expandir texto',
        },
        {
          kind: 'aiReduce',
          icon: 'i-lucide-fold-vertical',
          label: 'Reduzir texto',
        },
        {
          kind: 'aiSimplify',
          icon: 'i-lucide-lightbulb',
          label: 'Simplificar texto',
        },
        {
          kind: 'aiContinue',
          icon: 'i-lucide-text',
          label: 'Continuar frase',
        },
        { kind: 'aiSummarize', icon: 'i-lucide-list', label: 'Resumir' },
        {
          icon: 'i-lucide-languages',
          label: 'Traduzir',
          children: [
            { kind: 'aiTranslate', language: 'English', label: 'Inglês' },
            { kind: 'aiTranslate', language: 'French', label: 'Francês' },
            { kind: 'aiTranslate', language: 'Spanish', label: 'Espanhol' },
            { kind: 'aiTranslate', language: 'German', label: 'Alemão' },
          ],
        },
      ],
    },
  ],
]);

function filterImageUpload<T extends EditorToolbarItem[]>(items: T) {
  if (props.includeImageUpload) return items;
  return items.filter((item: any) => item.kind !== 'imageUpload');
}

const filteredEditorItems = computed(() => filterImageUpload(editorItems));

const toolbarItems = computed<EditorToolbarItem<typeof handlers.value>[][]>(() => {
  const base = [filteredEditorItems.value];

  if (props.includeAiTools) {
    return [...base, ...aiToolbarItems.value];
  }

  return base;
});
</script>
