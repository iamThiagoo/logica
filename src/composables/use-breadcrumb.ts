// composables/use-breadcrumb.ts
import { ref, provide, inject, type Ref } from 'vue';

const BREADCRUMB_KEY = Symbol('breadcrumb');

export interface BreadcrumbItem {
  label: string;
  icon?: string;
  to?: string;
}

export function provideBreadcrumb() {
  const breadcrumbItems = ref<BreadcrumbItem[]>([]);

  const setBreadcrumb = (items: BreadcrumbItem[]) => {
    breadcrumbItems.value = items;
  };

  provide(BREADCRUMB_KEY, {
    breadcrumbItems,
    setBreadcrumb,
  });

  return {
    breadcrumbItems,
    setBreadcrumb,
  };
}

export function useBreadcrumb() {
  const breadcrumb = inject<{
    breadcrumbItems: Ref<BreadcrumbItem[]>;
    setBreadcrumb: (items: BreadcrumbItem[]) => void;
  }>(BREADCRUMB_KEY);

  if (!breadcrumb) {
    throw new Error('useBreadcrumb deve ser usado dentro de um componente que usa provideBreadcrumb');
  }

  return breadcrumb;
}
