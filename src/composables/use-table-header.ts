import { TableHeaderComponents, UseTableHeaderOptions } from '@/utils/types/data-table';
import type { Column } from '@tanstack/table-core';

export function useTableHeader(options: UseTableHeaderOptions, components: TableHeaderComponents) {
  const { searchingMap, columnFiltersMap, onFilterChange } = options;
  const { UButton, UDropdownMenu, UInput } = components;

  function getHeader(column: Column<any>, label: string) {
    const colId = column.id;

    const isSorted = computed(() => column.getIsSorted());
    const isSearching = computed(() => searchingMap.value[colId]);
    const searchValue = ref(columnFiltersMap.value[colId] || '');

    const toggleSearch = () => {
      searchingMap.value[colId] = !searchingMap.value[colId];

      if (!searchingMap.value[colId]) {
        searchValue.value = '';
        columnFiltersMap.value[colId] = '';
        onFilterChange(colId);
      }
    };

    const handleInput = (e: Event) => {
      const value = (e.target as HTMLInputElement).value;
      searchValue.value = value;
      columnFiltersMap.value[colId] = value;
      onFilterChange(colId);
    };

    if (colId == 'actions') {
      return h('span', { class: 'sr-only' }, 'Ações');
    }

    return h('div', { class: 'flex items-center gap-2 w-full' }, [
      isSearching.value
        ? h(UInput, {
            modelValue: searchValue.value,
            placeholder: 'Buscar...',
            size: 'xs',
            autofocus: true,
            class: 'w-48',
            onInput: handleInput,
            onBlur: toggleSearch,
          })
        : h('div', { class: 'flex items-center justify-between w-full' }, [
            h('div', { class: 'flex items-center' }, [
              h(UButton, {
                icon: 'i-lucide-grip-vertical',
                size: 'xs',
                variant: 'ghost',
                color: 'neutral',
                class: 'ml-0! pl-0! cursor-grab active:cursor-grabbing',
              }),

              h(
                UDropdownMenu,
                {
                  content: { align: 'start' },
                  items: [
                    {
                      label: 'Asc',
                      type: 'checkbox',
                      checked: isSorted.value === 'asc',
                      onSelect: () => (isSorted.value === 'asc' ? column.clearSorting() : column.toggleSorting(false)),
                    },
                    {
                      label: 'Desc',
                      type: 'checkbox',
                      checked: isSorted.value === 'desc',
                      onSelect: () => (isSorted.value === 'desc' ? column.clearSorting() : column.toggleSorting(true)),
                    },
                  ],
                },
                () =>
                  h(UButton, {
                    label,
                    size: 'xs',
                    variant: 'ghost',
                    color: 'neutral',
                    icon: isSorted.value ? (isSorted.value === 'asc' ? 'i-lucide-arrow-up-narrow-wide' : 'i-lucide-arrow-down-wide-narrow') : 'i-lucide-arrow-up-down',
                    class: 'font-medium truncate',
                  })
              ),
            ]),
            h(UButton, {
              icon: 'i-fa-solid:search',
              size: 'xs',
              variant: 'ghost',
              color: 'neutral',
              onClick: toggleSearch,
            }),
          ]),
    ]);
  }

  return { getHeader };
}
