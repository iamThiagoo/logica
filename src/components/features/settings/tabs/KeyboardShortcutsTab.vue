<template>
  <div class="w-full space-y-6 h-full">
    <UPageHeader
      title="Atalhos de Teclado"
      description="Acelere sua navegação com atalhos globais e ações rápidas em tabelas."
      class="mb-1"
      :ui="{
        root: 'pb-6 pt-0',
        title: 'text-xl!',
        description: 'text-sm',
      }"
    />

    <UCard :ui="{ body: 'p-4 sm:p-5' }" class="border-0 border-default">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-base font-medium text-highlighted">Atalhos Globais</p>
          <p class="text-xs text-muted">Desative se preferir usar apenas a navegação visual.</p>
        </div>

        <USwitch :model-value="keyboardShortcutsEnabled" label="Ativar" @update:model-value="handleToggle" />
      </div>
    </UCard>

    <Transition name="fade-slide">
      <div v-if="keyboardShortcutsEnabled" class="space-y-6">
        <UCard :ui="{ body: 'p-4 sm:p-5' }" class="border-0 border-default">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-base font-medium text-highlighted">Personalização de Atalhos</p>
              <p class="text-xs text-muted">Clique em "Redefinir" e pressione a nova combinação no teclado.</p>
            </div>

            <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-rotate-ccw" label="Restaurar padrões" @click="handleResetAll" />
          </div>
        </UCard>

        <section v-for="group in shortcutGroups" :key="group.category" class="rounded-xl border border-default bg-elevated/40 p-4">
          <div class="mb-3">
            <h3 class="text-base font-semibold text-highlighted">
              {{ group.title }}
            </h3>
            <p class="text-xs text-muted">
              {{ group.description }}
            </p>
          </div>

          <div class="space-y-2">
            <div
              v-for="shortcut in group.shortcuts"
              :key="shortcut.id"
              :class="[
                'flex flex-col gap-3 rounded-lg border border-default/60 px-3 py-2 sm:flex-row sm:items-center sm:justify-between',
                {
                  'border-success/60 bg-success/10': shortcut.id === highlightedId,
                },
              ]"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-medium text-highlighted flex items-center gap-2">
                  {{ shortcut.label }}
                  <UBadge v-if="shortcut.id === recordingShortcutId" label="Gravando..." color="warning" variant="soft" size="xs" />
                </p>
                <p class="truncate text-xs text-muted">
                  {{ shortcut.description }}
                </p>
                <p v-if="errorByShortcutId[shortcut.id]" class="mt-1 text-xs text-error">
                  {{ errorByShortcutId[shortcut.id] }}
                </p>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <div v-if="keyboardShortcutsEnabled" class="flex items-center gap-1.5">
                  <template v-for="(token, index) in getShortcutKeysDisplay(shortcut)" :key="`${shortcut.id}-${index}`">
                    <div class="flex items-center gap-1">
                      <template v-for="(part, partIndex) in splitToken(token)" :key="`${shortcut.id}-${index}-${partIndex}`">
                        <UKbd v-if="keyboardShortcutsEnabled" :value="formatKey(part)" size="sm" />
                        <span v-if="partIndex < splitToken(token).length - 1" class="text-xs text-muted" aria-hidden="true"> + </span>
                      </template>
                    </div>
                    <span v-if="index < getShortcutKeysDisplay(shortcut).length - 1" class="text-xs text-muted" aria-hidden="true"> then </span>
                  </template>
                </div>

                <UButton size="xs" color="neutral" variant="ghost" :label="recordingShortcutId === shortcut.id ? 'Cancelar' : 'Redefinir'" @click="toggleShortcutRecording(shortcut.id)" />

                <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-rotate-ccw" @click="resetShortcut(shortcut.id)" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useKeyboardShortcuts } from '@/composables/use-keyboard-shortcuts';
import { keyboardEventToToken, KEYBOARD_SHORTCUT_CATALOG } from '@/utils/constants/keyboard-shortcuts';
import { showToast } from '@/utils/helpers/app/toast';
import type { KeyboardShortcutResolvableId } from '@/utils/types/keyboard-shortcuts';

const { enabled, setEnabled, getCatalogShortcutKeys, setShortcutKeys, resetShortcutKeys, resetAllShortcutKeys } = useKeyboardShortcuts();

const keyboardShortcutsEnabled = computed(() => enabled.value);
const shortcutGroups = KEYBOARD_SHORTCUT_CATALOG;
const recordingShortcutId = ref<KeyboardShortcutResolvableId | null>(null);
const highlightedId = ref<KeyboardShortcutResolvableId | null>(null);
const errorByShortcutId = ref<Record<string, string>>({});
let highlightTimer: number | null = null;
let recordSequenceTimer: number | null = null;
const recordBuffer = ref<string[]>([]);

const handleToggle = (value: boolean | 'indeterminate') => {
  setEnabled(Boolean(value));
};

const getShortcutKeysDisplay = (shortcut: (typeof KEYBOARD_SHORTCUT_CATALOG)[number]['shortcuts'][number]) => {
  return getCatalogShortcutKeys(shortcut);
};

const splitToken = (token: string) => token.split('+');

const formatKey = (part: string) => {
  const labels: Record<string, string> = {
    del: 'Del',
    ctrl: 'Ctrl',
    shift: 'Shift',
    alt: 'Alt',
    meta: 'Cmd',
    escape: 'Esc',
    enter: 'Enter',
    space: 'Space',
    '/': '/',
    '?': '?',
  };

  return labels[part] || part.toUpperCase();
};

const clearError = (shortcutId: KeyboardShortcutResolvableId) => {
  const nextErrors = { ...errorByShortcutId.value };
  delete nextErrors[shortcutId];
  errorByShortcutId.value = nextErrors;
};

const flashShortcut = (shortcutId: KeyboardShortcutResolvableId) => {
  highlightedId.value = shortcutId;
  if (highlightTimer !== null) {
    window.clearTimeout(highlightTimer);
  }

  highlightTimer = window.setTimeout(() => {
    highlightedId.value = null;
    highlightTimer = null;
  }, 1800);
};

const clearRecordSequenceTimer = () => {
  if (recordSequenceTimer === null) return;
  window.clearTimeout(recordSequenceTimer);
  recordSequenceTimer = null;
};

const finalizeRecording = () => {
  const shortcutId = recordingShortcutId.value;
  if (!shortcutId || !recordBuffer.value.length) return;

  applyShortcut(shortcutId, [...recordBuffer.value]);
  recordingShortcutId.value = null;
  recordBuffer.value = [];
  clearRecordSequenceTimer();
};

const applyShortcut = (shortcutId: KeyboardShortcutResolvableId, keys: string[]) => {
  const result = setShortcutKeys(shortcutId, keys);
  if (!result.valid) {
    if (result.reason === 'reserved') {
      errorByShortcutId.value[shortcutId] = 'Combinação reservada pelo navegador/sistema. Escolha outra.';
      return;
    }

    if (result.reason === 'conflict') {
      errorByShortcutId.value[shortcutId] = result.conflictWith ? `Conflito com "${result.conflictWith.label}".` : 'Atalho inválido. Tente novamente.';
      return;
    }
  }

  clearError(shortcutId);
  flashShortcut(shortcutId);
  showToast({
    type: 'success',
    title: 'Atalho atualizado',
    message: 'A nova combinação foi salva com sucesso.',
  });
};

const handleRecordingKeydown = (event: KeyboardEvent) => {
  const shortcutId = recordingShortcutId.value;
  if (!shortcutId) return;

  event.preventDefault();
  event.stopPropagation();

  if (event.key === 'Escape' && !event.ctrlKey && !event.altKey && !event.metaKey) {
    recordingShortcutId.value = null;
    recordBuffer.value = [];
    clearRecordSequenceTimer();
    clearError(shortcutId);
    return;
  }

  const token = keyboardEventToToken(event);
  if (!token) return;

  recordBuffer.value = [...recordBuffer.value, token].slice(0, 2);

  const usesModifier = token.includes('+');
  if (usesModifier || recordBuffer.value.length >= 2) {
    finalizeRecording();
    return;
  }

  clearRecordSequenceTimer();
  recordSequenceTimer = window.setTimeout(() => {
    finalizeRecording();
  }, 700);
};

const toggleShortcutRecording = (shortcutId: KeyboardShortcutResolvableId) => {
  if (recordingShortcutId.value === shortcutId) {
    recordingShortcutId.value = null;
    recordBuffer.value = [];
    clearRecordSequenceTimer();
    clearError(shortcutId);
    return;
  }

  recordBuffer.value = [];
  clearRecordSequenceTimer();
  recordingShortcutId.value = shortcutId;
};

const resetShortcut = (shortcutId: KeyboardShortcutResolvableId) => {
  resetShortcutKeys(shortcutId);
  clearError(shortcutId);
  flashShortcut(shortcutId);
  showToast({
    type: 'success',
    title: 'Atalho restaurado',
    message: 'O atalho voltou ao padrão.',
  });
};

const handleResetAll = () => {
  resetAllShortcutKeys();
  errorByShortcutId.value = {};
  highlightedId.value = null;
  recordingShortcutId.value = null;

  showToast({
    type: 'success',
    title: 'Atalhos restaurados',
    message: 'Todos os atalhos padrão foram restaurados.',
  });
};

watch(recordingShortcutId, (id) => {
  window.removeEventListener('keydown', handleRecordingKeydown);

  if (id) {
    window.addEventListener('keydown', handleRecordingKeydown, {
      passive: false,
    });
  }
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleRecordingKeydown);
  clearRecordSequenceTimer();

  if (highlightTimer !== null) {
    window.clearTimeout(highlightTimer);
  }

  highlightTimer = null;
  highlightedId.value = null;
});
</script>
