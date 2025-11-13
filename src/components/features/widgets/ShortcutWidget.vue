<template>
  <section class="mb-6">
    <UCard :ui="{ body: 'p-4 sm:p-5' }" variant="soft" class="border border-default">
      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex justify-between items-start w-full">
          <div>
            <h3 class="flex items-center gap-2 text-lg font-semibold text-highlighted">
              <!-- <UIcon name="i-lucide-pin" class="size-4 text-primary" /> -->
              Meus Atalhos
              <UTooltip text="Entre nas páginas e habilite">
                <UIcon name="i-lucide-circle-question-mark" class="size-3.5 text-muted" />
              </UTooltip>
            </h3>

            <p class="text-sm text-muted">Atalhos para acesso rápido às suas páginas favoritas.</p>
          </div>
          <UButton color="neutral" variant="outline" label="Adicionar Atalho" class="cursor-pointer btn-add-link rounded-lg bg-elevated/50 hover:bg-elevated/80 hover:ring-accented relative select-none rounded-l-lg transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]" @click="openModal('novo-link')">
            <template #leading>
              <lord-icon trigger="hover" target=".btn-add-link" :colors="`primary:${lordIconColor}`" src="/lord-icon/plus.json" class="h-4 w-5" />
            </template>
          </UButton>
        </div>

        <UButton v-if="hiddenCount > 0" size="sm" color="neutral" variant="outline" :label="showAll ? 'Mostrar menos' : `Ver todos (+${hiddenCount})`" @click="showAll = !showAll" />
      </div>

      <div v-if="hasShortcuts">
        <TransitionGroup name="shortcut-list" tag="div" class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3">
          <button
            v-for="(shortcut, index) in visibleShortcuts"
            :key="shortcut.id"
            type="button"
            class="shortcut-card group relative bg-elevated/50 cursor-pointer rounded-xl border border-default p-3 text-left transition-all hover:border-primary/40 hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            :style="{ animationDelay: `${index * 40}ms` }"
            :aria-label="`Atalho: ${shortcut.title}`"
            :data-shortcut-key="shortcut.key"
            data-shortcut-item
            @click="navigateToShortcut(shortcut)"
          >
            <div class="flex items-center gap-3">
              <UButton color="info" variant="soft" class="flex size-10 shrink-0 items-center justify-center rounded-lg border border-default transition-colors group-hover:border-primary/30">
                <UIcon :name="shortcut.icon || 'i-lucide-link-2'" class="w-14 h-14" />
              </UButton>

              <div class="min-w-0 flex-1">
                <div class="flex items-start justify-between gap-2">
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-highlighted truncate">
                      {{ shortcut.original }}
                    </p>
                    <p class="mt-0.5 text-xs text-muted truncate">
                      {{ shortcut.kind === 'quick-link' ? 'Link externo' : 'Atalho do sistema' }}
                    </p>
                  </div>
                  <div class="relative top-0.5 shrink-0">
                    <div class="flex items-center gap-1.5 transition-opacity group-hover:opacity-0 group-focus-within:opacity-0">
                      <UIcon v-if="shortcut.kind === 'quick-link'" name="i-lucide-external-link" class="size-6 text-primary/80" aria-hidden="true" />
                      <UIcon v-else name="i-lucide-badge-check" class="size-6 text-primary/80" aria-hidden="true" />
                    </div>

                    <div class="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none transition-opacity group-hover:opacity-100 group-hover:pointer-events-auto group-focus-within:opacity-100 group-focus-within:pointer-events-auto">
                      <UTooltip text="Excluir">
                        <UButton size="xs" color="error" variant="ghost" class="rounded-md" aria-label="Excluir atalho" @click.stop="removeShortcut(shortcut)">
                          <template #leading>
                            <UIcon name="i-lucide-trash-2" class="size-4" />
                          </template>
                        </UButton>
                      </UTooltip>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </button>
        </TransitionGroup>
      </div>

      <div v-else class="flex min-h-36 flex-col items-center justify-center rounded-xl border border-dashed border-default bg-elevated/40 p-6 text-center">
        <UIcon name="i-lucide-pin-off" class="mb-2 size-7 text-muted" />
        <p class="text-sm font-medium text-highlighted">Nenhum atalho fixado ainda</p>
        <p class="mt-1 text-xs text-muted">Fixe atalhos nas páginas para aparecerem aqui ou adicione manualmente.</p>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import { useQuickLinksStore } from '@/composables/use-quick-links';
import { useModalStore } from '@/composables/use-modal';
import { useShortcutsStore } from '@/stores/modules/shortcut.store';

const MAX_VISIBLE_SHORTCUTS = 60;
const { openModal } = useModalStore();

const router = useRouter();
const shortcutsStore = useShortcutsStore();
const { links, deleteLink } = useQuickLinksStore();
const showAll = ref(false);
const colorMode = useColorMode();

type UnifiedShortcut = {
  id: string;
  key: string;
  title: string;
  original: string;
  icon: string;
  kind: 'shortcut' | 'quick-link';
  url?: string;
};

const allShortcuts = computed<UnifiedShortcut[]>(() => {
  const pinned = (shortcutsStore.items || []).map((shortcut) => ({
    ...shortcut,
    id: `shortcut:${shortcut.key}`,
    kind: 'shortcut' as const,
  }));

  const quick = (links.value || []).map((link) => ({
    id: `quick-link:${link.id}`,
    key: link.id,
    title: link.title || link.url,
    original: link.title || link.url,
    icon: 'i-lucide-link',
    kind: 'quick-link' as const,
    url: link.url,
  }));

  return [...pinned, ...quick];
});

const hasShortcuts = computed(() => allShortcuts.value.length > 0);
const visibleShortcuts = computed(() => (showAll.value ? allShortcuts.value : allShortcuts.value.slice(0, MAX_VISIBLE_SHORTCUTS)));
const hiddenCount = computed(() => Math.max(allShortcuts.value.length - MAX_VISIBLE_SHORTCUTS, 0));

const lordIconColor = computed(() => (colorMode.value === 'dark' ? '#fff' : '#1e293b'));

const navigateToShortcut = (shortcut: UnifiedShortcut) => {
  if (shortcut.kind === 'quick-link' && shortcut.url) {
    window.open(shortcut.url, '_blank', 'noopener,noreferrer');
    return;
  }

  if (!shortcut.key) return;
  router.push(shortcut.key);
};

const removeShortcut = (shortcut: UnifiedShortcut) => {
  if (shortcut.kind === 'quick-link') {
    deleteLink(shortcut.key);
    return;
  }

  shortcutsStore.remove(shortcut.key);
};

onMounted(() => {
  shortcutsStore.load();
});
</script>

<style scoped>
.shortcut-card {
  animation: shortcut-enter 280ms ease both;
}

@keyframes shortcut-enter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
