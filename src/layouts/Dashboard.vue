<template>
  <UDashboardGroup unit="rem" storage="local">
    <UDashboardSidebar
      id="default"
      v-model:open="open"
      collapsible
      resizable
      mode="slideover"
      :default-size="17.3"
      class="bg-[#18181B] transition-all duration-500 ease-in-out"
      :class="bgByTheme"
      style="zoom: 0.95"
      :ui="{
        footer: footerClasses,
        header: 'mt-9 mb-3',
      }"
    >
      <template #resize-handle="{ onMouseDown, onTouchStart, onDoubleClick }">
        <UDashboardResizeHandle class="after:absolute after:inset-y-0 after:right-0 after:w-px hover:after:bg-(--ui-border-accented) after:transition" @mousedown="onMouseDown" @touchstart="onTouchStart" @dblclick="onDoubleClick" />
      </template>

      <template #header="{ collapsed }">
        <div class="relative w-full relative -top-1">
          <router-link v-if="!collapsed" to="/" class="px-1 grid w-full items-center gap-x-3 gap-y-0 relative transition-transform duration-300 hover:brightness-110 hover-bounce">
            <img src="@/assets/svg/logo.svg" alt="Logo" class="h-8 w-auto" />
          </router-link>
        </div>
      </template>

      <template #default="{ collapsed }">
        <UDashboardSearchButton
          :key="searchKey"
          :collapsed="collapsed"
          class="bg-transparent rounded-lg ring-neutral-600 hover:bg-zinc-800 active:bg-zinc-neutral border-neutral-800! py-2"
          :class="{ 'px-3': !collapsed }"
          :ui="{
            base: 'border-neutral-800! focus-visible:ring-0 focus-visible:border-neutral-800! active:border-neutral-800! text-neutral-300',
          }"
        />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[0]"
          orientation="vertical"
          class="mt-1"
          tooltip
          popover
          :ui="{
            link: `${dashboardMenuBase} ${dashboardMenuHover} hover:text-neutral-300`,
            linkLeadingIcon: dashboardMenuIcon,
          }"
        />

        <USeparator class="-mb-2 -mt-2" :ui="{ border: 'border-zinc-800 dark:border-default' }" />

        <UNavigationMenu
          :collapsed="collapsed"
          :items="links[1]"
          orientation="vertical"
          tooltip
          popover
          :ui="{
            link: `${dashboardMenuBase} ${dashboardMenuHover} hover:text-neutral-200`,
            linkLeadingIcon: `${dashboardMenuIcon} group-hover:text-neutral-200`,
          }"
        />
      </template>

      <template #footer="{ collapsed }">
        <UserMenu :collapsed="collapsed" />
        <div class="w-full flex justify-center">
          <UButton v-if="!collapsed" class="cursor-pointer flex btn-scale justify-center w-full text-neutral-400 active:bg-transparent hover:bg-neutral-800 hover:text-neutral-500" size="lg" :icon="colorMode === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'" color="neutral" variant="ghost" @click.stop.prevent="startViewTransition(colorMode === 'dark' ? 'light' : 'dark', $event)" />

          <UButton
            v-if="!collapsed"
            class="cursor-pointer flex btn-scale justify-center w-full text-neutral-400 active:bg-transparent hover:bg-neutral-800 hover:text-neutral-500"
            size="lg"
            icon="i-lucide-log-out"
            color="neutral"
            variant="ghost"
            @click="
              authStore.logout();
              router.push('/login');
            "
          />
          <UDashboardSidebarCollapse
            size="lg"
            :icon="collapsed ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'"
            variant="ghost"
            color="neutral"
            :ui="{
              base: 'cursor-pointer flex btn-scale justify-center w-full text-neutral-400 active:bg-transparent hover:bg-neutral-800 hover:text-neutral-500',
            }"
          />
        </div>
      </template>
    </UDashboardSidebar>

    <UDashboardSearch placeholder="Digite para pesquisar códigos / páginas ou navegue e pressione Enter..." :groups="groups" @enter="onSearchEnter" />

    <div class="w-full h-full flex flex-col min-h-0 overflow-x-auto">
      <UDashboardNavbar>
        <template #left>
          <UDashboardSidebarCollapse />
          <USeparator class="h-6" orientation="vertical" />
          <UBreadcrumb v-if="breadcrumbItems && breadcrumbItems.length > 0" :items="breadcrumbItems" size="sm" class="ml-2" />
        </template>
        <template #right>
          <div class="hidden items-center gap-6 md:flex">
            <button class="flex items-center gap-1 rounded-xl btn-feedback px-3 py-1 text-sm font-medium dark:shadow-md dark:bg-neutral-900 dark:text-white dark:hover:bg-zinc-800 bg-white text-zinc-900 hover:bg-zinc-100 border border-zinc-200 dark:border-zinc-800 transition cursor-pointer btn-scale relative" @click="openModal('sugestoes-feedback')">
              <lord-icon trigger="hover" target=".btn-feedback" :colors="`primary:${lordIconColor}`" src="/lord-icon/chat.json" class="h-6" />
              <span class="truncate text-muted dark:text-gray-300">Feedback</span>
              <UKbd v-if="keyboardShortcutsEnabled" color="neutral" class="ml-1" variant="subtle" size="md"> F </UKbd>
            </button>
            <ULink class="cursor-pointer"> Ajuda </ULink>
            <!-- <ULink
              v-if="canInstallPWA && !isRunningAsPWA()"
              class="cursor-pointer"
              @click="install"
            >
              Instalar
            </ULink> -->
          </div>
        </template>
      </UDashboardNavbar>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <div class="home-noise" />
        <UContainer>
          <RouterView @vue:mounted="onChildMounted" />
        </UContainer>
      </div>
    </div>
    <Modal />
  </UDashboardGroup>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui';
import menu from '@/utils/constants/sidebar/index';
import { useModalStore } from '@/composables/use-modal';
import { useKeyboardShortcuts } from '@/composables/use-keyboard-shortcuts';
import { useShortcutsStore } from '@/stores/modules/shortcut.store';
import { useAuthStore } from '@/stores/modules/auth.store';
import { provideBreadcrumb } from '../composables/use-breadcrumb';
import { defineElement } from '@lordicon/element';
import { usePWAInstall } from '@/composables/pwa-install';
import { pagesIconsMap } from '@/utils/types/map/icons-map';

defineElement();

const open = ref(false);
const { openModal } = useModalStore();
const { registerShortcuts, enabled } = useKeyboardShortcuts();
const appConfig = useAppConfig();
const links = [menu] satisfies NavigationMenuItem[][];
const shortcutsStore = useShortcutsStore();
const themePreset = ref<string | null>(null);
const module = ref('Template');
const route = useRoute();
const router = useRouter();
const userStore = useAuthStore();
const me = userStore.user;
const authStore = useAuthStore();
const colorMode = useColorMode();
const currentBreadcrumb = ref<any[]>([]);
const { breadcrumbItems } = provideBreadcrumb();
const { canInstallPWA, register, install } = usePWAInstall();

const dashboardMenuBase = 'transition-colors duration-300 ease-out before:transition-colors before:duration-300 before:ease-out';
const dashboardMenuIcon = 'transition-colors duration-300 ease-out group-hover:text-neutral-300';

const dashboardMenuHover = computed(() => {
  return themePreset.value ? `hover:before:bg-primary-900` : 'hover:before:bg-neutral-800';
});

const flattenNavigationItems = (items: NavigationMenuItem[]): NavigationMenuItem[] => {
  return items.flatMap((item) => {
    const currentItem = item.to || item.href || item.onSelect ? [{ ...item, children: undefined }] : [];
    const childItems = item.children ? flattenNavigationItems(item.children as NavigationMenuItem[]) : [];
    return [...currentItem, ...childItems];
  });
};

const shortcutItems = computed(() =>
  shortcutsStore.items.map((shortcut) => ({
    id: shortcut.key,
    label: shortcut.title,
    icon: shortcut.icon,
    onSelect: () => {
      open.value = false;
      router.push(shortcut.key);
    },
  }))
);

const searchKey = computed(() => shortcutsStore.items.map((s) => s.key).join('|'));
const keyboardShortcutsEnabled = computed(() => enabled.value);

links[0] = links[0].map((item: any) => {
  item = processMenuItem(item, openModal);
  return item;
});

links[1] = [
  {
    label: 'Configurações',
    icon: 'i-lucide-settings',
    class: 'cursor-pointer',
    onSelect: () => openModal('configuracoes', { tab: 'meu-perfil' }),
  },
] as any;

const groups = computed(() => [
  {
    id: 'actions',
    label: 'Meus Atalhos',
    items: [
      ...shortcutItems.value,
      {
        label: 'Personalizar',
        icon: 'i-lucide-footprints',
        onSelect: () => {
          openModal('configuracoes', { tab: 'meu-perfil' });
        },
      },
    ],
  },
  {
    id: 'links',
    label: 'Navegação',
    items: flattenNavigationItems(links.flat() as NavigationMenuItem[]),
  },
]);

function processMenuItem(item: any, openModal?: any) {
  if (item.comingSoon) {
    item.class = 'opacity-50 cursor-not-allowed hover:bg-transparent';
    item.iconClass = 'opacity-50';
    item.badge = {
      label: 'Em breve',
      color: 'success',
      variant: 'soft',
      size: 'xs',
    };

    item.to = undefined;
    item.href = undefined;
    item.onSelect = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      return false;
    };
  }

  if (item.permissionDenied) {
    item.badge = {
      icon: 'i-lucide-lock-keyhole',
      color: 'warning',
      variant: 'subtle',
      size: 'xs',
    };

    item.to = undefined;
    item.href = undefined;
    item.onSelect = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      openModal?.('acesso-negado', {
        permission: item.label,
      });
      return false;
    };
  }

  if (item.children) {
    item.children = item.children.map((child: any) => processMenuItem(child, openModal));
  }

  return item;
}

const lordIconColor = computed(() => (colorMode.value === 'dark' ? '#fff' : '#1e293b'));

const onSearchEnter = (selectedItem: any) => {
  if (!selectedItem) return;
  if (selectedItem.onSelect) selectedItem.onSelect();
  else if (selectedItem.to) router.push(selectedItem.to);
};

const onChildMounted = (component: any) => {
  nextTick(() => {
    if (component?.breadcrumbItems) {
      currentBreadcrumb.value = component.breadcrumbItems;
    }
  });
};

watch(
  () => route.path,
  async () => {
    await nextTick();
    setTimeout(() => {
      const routerView = document.querySelector('[data-breadcrumb]');
      if (routerView) {
        const breadcrumb = (routerView as any)?.__vueParentComponent?.exposed?.breadcrumbItems;
        if (breadcrumb) {
          currentBreadcrumb.value = breadcrumb;
        }
      }
    }, 100);
  }
);

const applyLayout = () => {
  const savedFont = localStorage.getItem('nuxt-font');
  const savedNeutral = localStorage.getItem('theme:neutral');
  const savedPrimary = localStorage.getItem('theme:primary');
  const savedMode = localStorage.getItem('nuxt-color-mode');
  const savedLayout = localStorage.getItem('layout-mode');

  if (savedFont) document.documentElement.style.setProperty('--app-font', savedFont);
  if (savedPrimary) appConfig.ui.colors.primary = savedPrimary;
  if (savedNeutral) appConfig.ui.colors.neutral = savedNeutral;
  if (savedMode) {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(savedMode);
  }

  const panels = document.querySelectorAll('.max-w-8xl');
  panels.forEach((panel) => {
    (panel as HTMLElement).style.maxWidth = savedLayout === 'full' ? '100%' : '100rem';
  });
};

const isElementVisible = (el: HTMLElement) => {
  if (!el.isConnected) return false;

  const style = window.getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;

  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
};

const isElementDisabled = (el: HTMLElement) => {
  if (el.getAttribute('aria-disabled') === 'true') return true;
  if (el instanceof HTMLButtonElement) return el.disabled;

  const button = el.querySelector('button');
  return button ? button.disabled : false;
};

const getFormSaveTarget = () => {
  if (typeof document === 'undefined') return null;

  const candidates = Array.from(document.querySelectorAll<HTMLElement>('[data-form-save]'));

  for (let i = candidates.length - 1; i >= 0; i -= 1) {
    const candidate = candidates[i];
    if (!isElementVisible(candidate)) continue;
    if (isElementDisabled(candidate)) continue;
    return candidate;
  }

  return null;
};

const startViewTransition = (mode: string, event: MouseEvent) => {
  if (!document.startViewTransition) {
    setTheme(mode as 'light' | 'dark');
    return;
  }

  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();

  const x = rect.left + 220 + rect.width / 2;
  const y = rect.top + rect.height / 2;

  const endRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

  const transition = document.startViewTransition(() => {
    setTheme(mode as 'light' | 'dark');
  });

  transition.ready.then(() => {
    const duration = 600;
    document.documentElement.animate(
      {
        clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`],
      },
      {
        duration: duration,
        easing: 'cubic-bezier(.76,.32,.29,.99)',
        pseudoElement: '::view-transition-new(root)',
      }
    );
  });
};

const setTheme = (mode: 'light' | 'dark') => {
  colorMode.value = mode;
  localStorage.setItem('nuxt-color-mode', mode);
};

const bgByTheme = computed(() => {
  return themePreset.value ? 'dark:bg-default' : '';
});

const bgByThemeFooter = computed(() => {
  return themePreset.value ? 'dark:bg-default!' : '';
});

const footerClasses = computed(() => {
  const base = 'lg:border-t border-neutral-700 dark:border-default';
  const themeSpecific = themePreset.value ? 'from-[#18181B] dark:from-default dark:bg-default' : 'from-[#18181B] to-neutral-900';
  return `${base} ${bgByThemeFooter.value} ${themeSpecific}`;
});

let unregisterKeyboardShortcuts: (() => void) | null = null;

onMounted(async () => {
  if (!me || !userStore.token) {
    authStore.logout();
    router.push('/login');
  }

  applyLayout();
  await nextTick();
  themePreset.value = localStorage.getItem('theme:preset');

  const sidebar = document.getElementById('dashboard-sidebar-default');
  sidebar!.style.display = 'flex';

  unregisterKeyboardShortcuts = registerShortcuts([
    {
      id: 'nav-dashboard',
      handler: () => {
        router.push('/');
      },
    },
    {
      id: 'form-save',
      allowInEditable: true,
      allowWhenModalOpen: true,
      when: () => Boolean(getFormSaveTarget()),
      handler: () => {
        const target = getFormSaveTarget();
        if (target) target.click();
      },
    },
    {
      id: 'nav-settings',
      handler: () => {
        openModal('configuracoes', { tab: 'meu-perfil' });
      },
    },
    {
      id: 'nav-meetings',
      handler: () => {
        router.push('/agenda-reunioes');
      },
    },
    {
      id: 'system-cheatsheet',
      handler: () => {
        openModal('configuracoes', { tab: 'atalhos-teclado' });
      },
    },
    {
      id: 'system-feedback',
      handler: () => {
        openModal('sugestoes-feedback');
      },
    },
    {
      id: 'system-logout',
      handler: () => {
        authStore.logout();
        router.push('/login');
      },
    },
  ]);
  register();
});

onUnmounted(() => {
  unregisterKeyboardShortcuts?.();
  unregisterKeyboardShortcuts = null;
});

watch(
  () => route.fullPath,
  () => {
    setTimeout(() => applyLayout(), 0);
  }
);

watchEffect(() => {
  themePreset.value = localStorage.getItem('theme:preset');
});
</script>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(root) {
  z-index: 9999;
}
::view-transition-old(root) {
  z-index: 1;
}

.lottie-light {
  filter: brightness(0.5) saturate(0.8);
}

.lottie-dark {
  filter: brightness(1.2) invert(1);
}
</style>
