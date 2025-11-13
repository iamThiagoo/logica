import { defineStore } from 'pinia';
import type { RouteLocationNormalizedLoaded } from 'vue-router';
import sidebarOptions from '@/utils/constants/sidebar';

export type Shortcut = {
  key: string;
  title: string;
  original: string;
  icon: string;
};

type SidebarOption = {
  label?: string;
  to?: string;
  icon?: string;
  comingSoon?: boolean;
  children?: SidebarOption[];
};

function extractShortcutPages(options: SidebarOption[], path: string[] = []): Shortcut[] {
  return options.flatMap((option) => {
    const hasChildren = Array.isArray(option.children) && option.children.length > 0;

    if (hasChildren) {
      return extractShortcutPages(option.children!, [...path, option.label || '']);
    }

    if (option.label && option.icon && option.to && typeof option.to === 'string' && !option.comingSoon) {
      return [
        {
          key: option.to,
          title: [...path, option.label].filter(Boolean).join(' ➜ ') || option.label,
          original: option.label,
          icon: option.icon,
        },
      ];
    }

    return [];
  });
}

const shortcutsByKey = new Map(extractShortcutPages(sidebarOptions as SidebarOption[]).map((shortcut) => [shortcut.key, shortcut]));

export const useShortcutsStore = defineStore('shortcuts', {
  persist: true,
  state: () => ({
    items: [] as Shortcut[],
  }),
  getters: {
    isPinned: (state) => (key: string) => state.items.some((item) => item.key === key),
  },
  actions: {
    load() {
      const raw = this.items.length ? JSON.stringify(this.items) : localStorage.getItem('shortcuts');

      try {
        const parsed = raw ? JSON.parse(raw) : [];
        this.items = Array.isArray(parsed) ? parsed : [];
      } catch {
        this.items = [];
      }
    },
    set(items: Shortcut[]) {
      this.items = Array.isArray(items) ? items : [];
      localStorage.setItem('shortcuts', JSON.stringify(this.items));
    },
    clear() {
      this.items = [];
      localStorage.removeItem('shortcuts');
    },
    createFromRoute(route: RouteLocationNormalizedLoaded, options?: { title?: string; icon?: string }) {
      const key = route.path;
      if (!key) return null;

      const routeMeta = route.meta as Record<string, unknown>;
      const shortcutFromSidebar = shortcutsByKey.get(key);
      const metaTitle = typeof routeMeta.title === 'string' ? routeMeta.title : undefined;
      const metaIcon = typeof routeMeta.icon === 'string' ? routeMeta.icon : undefined;
      const fallbackTitle = options?.title || metaTitle || String(route.name || key);

      return {
        key,
        title: shortcutFromSidebar?.title || fallbackTitle,
        original: shortcutFromSidebar?.original || options?.title || fallbackTitle,
        icon: shortcutFromSidebar?.icon || options?.icon || metaIcon || 'i-lucide-pin',
      } as Shortcut;
    },
    toggle(shortcut: Shortcut) {
      if (!shortcut?.key) return false;

      const alreadyPinned = this.isPinned(shortcut.key);

      if (alreadyPinned) {
        this.set(this.items.filter((item) => item.key !== shortcut.key));
        return false;
      }

      this.set([...this.items, shortcut]);
      return true;
    },
    remove(key: string) {
      if (!key) return;
      this.set(this.items.filter((item) => item.key !== key));
    },
    toggleRoute(route: RouteLocationNormalizedLoaded, options?: { title?: string; icon?: string }) {
      const shortcut = this.createFromRoute(route, options);
      if (!shortcut) return false;
      return this.toggle(shortcut);
    },
  },
});
