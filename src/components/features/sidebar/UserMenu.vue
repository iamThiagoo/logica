<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'end' }"
    :ui="{
      content: collapsed ? 'w-48' : 'w-(--reka-dropdown-menu-trigger-width)',
      item: 'flex items-center',
    }"
    :item-label="'text-base'"
  >
    <UButton
      v-bind="{
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="transition-all duration-300 ease-in-out data-[state=open]:bg-neutral-800 hover:bg-neutral-800 active:bg-neutral-800 text-base py-1.5 text-gray-200"
      :class="getBgByTheme()"
      :ui="{ trailingIcon: 'text-gray-500' }"
    >
      <template #leading>
        <UAvatar :size="!collapsed ? 'md' : 'xs'" class="rounded-none squircle transition-all duration-300 ease-in-out relative" :class="[!collapsed ? '-left-1 scale-100 opacity-100' : 'scale-90 opacity-80']" :src="user.avatar.src" />
      </template>

      <template #default>
        <Transition name="fade-slide">
          <div v-if="!collapsed" class="flex flex-col flex-start text-left -ml-0.5 overflow-x-hidden transition-all duration-300 ease-in-out">
            <span>{{ user.name }}</span>
            <p class="text-xs text-muted ml-0.5">
              {{ user.email }}
            </p>
          </div>
        </Transition>
      </template>
    </UButton>

    <template #chip-leading="{ item }">
      <span
        :style="{
          '--chip-light': `var(--color-${(item as any).chip}-500)`,
          '--chip-dark': `var(--color-${(item as any).chip}-400)`,
        }"
        class="ms-0.5 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
      />
    </template>
  </UDropdownMenu>
</template>

<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';
import { useModalStore } from '@/composables/use-modal';
import { getUserMenuDropdownItems } from '@/utils/constants/sidebar/modules/user-menu';
import { useAuthStore } from '@/stores/modules/auth.store';
import { simplifyNames } from '@/utils/helpers/shared/string';

defineProps<{
  collapsed?: boolean;
}>();

const { openModal } = useModalStore();
const appConfig = useAppConfig();
const userStore = useAuthStore();
const me = userStore.user;

const user = ref({
  name: simplifyNames(me?.nome as string),
  email: me?.email,
  avatar: {
    src: `https://avatars.githubusercontent.com/u/69599810?v=4`,
    alt: me?.nome,
  },
});

const getBgByTheme = () => {
  const savedMode = localStorage.getItem('theme:preset');
  if (savedMode) return `dark:data-[state=open]:bg-default! dark:hover:bg-default! dark:active:bg-default!`;
  return '';
};

const items = computed<DropdownMenuItem[][]>(() => getUserMenuDropdownItems(user.value, openModal));

onMounted(() => {
  const savedPrimary = localStorage.getItem('theme:primary');
  const savedNeutral = localStorage.getItem('theme:neutral');
  if (savedPrimary) appConfig.ui.colors.primary = savedPrimary;
  if (savedNeutral) appConfig.ui.colors.neutral = savedNeutral;
});

watch(
  () => appConfig.ui.colors.primary,
  (newVal) => localStorage.setItem('theme:primary', newVal)
);
watch(
  () => appConfig.ui.colors.neutral,
  (newVal) => localStorage.setItem('theme:neutral', newVal)
);
</script>
