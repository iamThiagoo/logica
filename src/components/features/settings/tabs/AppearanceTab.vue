<template>
  <div class="w-full space-y-6 overflow-y-auto h-full">
    <UPageHeader
      title="Aparência & Uso"
      description="Personalize sua experiência com configurações customizadas e temas pré-configurados."
      class="mb-1"
      :ui="{
        root: 'pb-6 pt-0',
        title: 'text-xl!',
        description: 'text-sm',
      }"
    />

    <section class="space-y-4">
      <div class="grid grid-cols-[auto_1px_auto_1px_auto_1px_auto] items-end gap-x-4">
        <div class="flex flex-col gap-3">
          <p class="text-sm text-default!">Fonte</p>
          <USelect v-model="currentFont" :items="fontOptions" class="w-36" option-attribute="label" />
        </div>

        <USeparator orientation="vertical" class="h-8" />

        <div class="flex flex-col gap-3">
          <p class="text-sm text-default!">Modo</p>
          <URadioGroup
            v-model="currentMode"
            color="primary"
            indicator="hidden"
            class="cursor-pointer"
            orientation="horizontal"
            size="xs"
            variant="table"
            :ui="{
              item: 'cursor-pointer p-[8px] px-[15px]',
            }"
            :items="modeOptions"
          />
        </div>

        <USeparator orientation="vertical" class="h-8" />

        <div class="flex flex-col gap-3">
          <p class="text-sm text-default!">Layout</p>
          <URadioGroup
            v-model="currentLayout"
            color="primary"
            indicator="hidden"
            class="cursor-pointer"
            orientation="horizontal"
            size="xs"
            variant="table"
            :ui="{
              item: 'cursor-pointer p-[8px]',
            }"
            :items="layoutOptions"
          />
        </div>

        <USeparator orientation="vertical" class="h-8" />

        <div class="flex flex-col gap-3">
          <p class="text-sm text-default!">Paginação</p>
          <USelect v-model="currentPaginationSize" :items="paginationSizeOptions" class="min-w-36 w-fit" option-attribute="label" />
        </div>
      </div>

      <!-- Linha 2: Cor Primária, Cor Neutra, Descrição nas Páginas -->
      <div class="grid grid-cols-[auto_1px_auto_1px_auto_1px_auto] items-end gap-x-4">
        <div class="flex flex-col gap-3">
          <p class="text-sm text-default!">Cor Primária</p>
          <USelect v-model="currentPrimaryColor" :items="primaryColors" option-attribute="label" value-key="value" class="w-fit">
            <template #leading="{ modelValue }">
              <span
                :style="{
                  '--chip-light': `var(--color-${(modelValue as any) === 'neutral' ? 'old-neutral' : (modelValue as any)}-500)`,
                  '--chip-dark': `var(--color-${(modelValue as any) === 'neutral' ? 'old-neutral' : (modelValue as any)}-400)`,
                }"
                class="ms-1 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
              />
            </template>
            <template #item-leading="{ item }">
              <span
                :style="{
                  '--chip-light': `var(--color-${(item as any).chip}-500)`,
                  '--chip-dark': `var(--color-${(item as any).chip}-400)`,
                }"
                class="ms-0.5 size-2 mt-[7px] rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
              />
            </template>
          </USelect>
        </div>

        <USeparator orientation="vertical" class="h-8" />

        <div class="flex flex-col gap-3">
          <p class="text-sm text-default!">Cor Neutra</p>
          <USelect v-model="currentSecondaryColor" :items="neutralsColors" option-attribute="label" value-key="value" class="w-fit">
            <template #leading="{ modelValue }">
              <span
                :style="{
                  '--chip-light': `var(--color-${(modelValue as any) === 'neutral' ? 'old-neutral' : (modelValue as any)}-500)`,
                  '--chip-dark': `var(--color-${(modelValue as any) === 'neutral' ? 'old-neutral' : (modelValue as any)}-400)`,
                }"
                class="ms-1 size-2 rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
              />
            </template>
            <template #item-leading="{ item }">
              <span
                :style="{
                  '--chip-light': `var(--color-${(item as any).chip}-500)`,
                  '--chip-dark': `var(--color-${(item as any).chip}-400)`,
                }"
                class="ms-0.5 size-2 mt-[7px] rounded-full bg-(--chip-light) dark:bg-(--chip-dark)"
              />
            </template>
          </USelect>
        </div>

        <USeparator orientation="vertical" class="h-8" />

        <div class="flex flex-col gap-3">
          <p class="text-sm text-default! text-nowrap">Descrição (Páginas)</p>
          <URadioGroup
            v-model="descriptionMode"
            color="primary"
            indicator="hidden"
            class="cursor-pointer"
            orientation="horizontal"
            size="xs"
            variant="table"
            :ui="{
              item: 'cursor-pointer p-[8px] px-[15px]',
            }"
            :items="descriptionOptions"
          />
        </div>

        <USeparator orientation="vertical" class="h-8 invisible" />

        <div class="flex flex-col gap-3">
          <div class="w-40" />
        </div>
      </div>
    </section>

    <USeparator />

    <section class="space-y-4 mb-10">
      <div class="flex items-center justify-between">
        <p class="text-sm text-default!">Temas Pré-Definidos</p>
        <UButton color="neutral" variant="outline" icon="i-heroicons-arrow-path" class="w-fit" size="sm" @click="resetConfigs"> Resetar Configurações </UButton>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-1.5">
        <div v-for="[key, theme] in themeEntries" :key="key" class="relative group cursor-pointer btn-scale" @click="selectTheme(key as ThemeKey)">
          <div
            class="relative overflow-hidden rounded-lg border-1 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
            :class="{
              'border-primary ring-2 ring-primary/20': selectedPresetTheme === key,
              'border-neutral-200 dark:border-neutral-600 hover:border-primary/50 hover:border-primary/50': selectedPresetTheme !== key,
            }"
          >
            <div class="h-20 p-3" :style="getThemePreview(theme)">
              <div class="flex items-center gap-2">
                <div
                  class="w-6 h-6 rounded-full flex-shrink-0"
                  :style="{
                    backgroundColor: `var(--color-${theme.primary}-500)`,
                  }"
                />
                <div class="flex-1">
                  <div
                    class="h-2 rounded-full mb-1"
                    :style="{
                      backgroundColor: `var(--color-${theme.primary}-300)`,
                    }"
                  />
                  <div
                    class="h-1 rounded-full w-3/4"
                    :style="{
                      backgroundColor: `var(--color-${theme.neutral}-400)`,
                    }"
                  />
                </div>
              </div>
            </div>

            <div class="p-3 bg-(--ui-bg) border-t border-(--ui-border)">
              <h4 class="text-xs font-medium truncate">
                {{ theme.label }}
              </h4>
              <div class="flex items-center gap-2 mt-1">
                <span
                  class="text-xs text-muted"
                  :class="{
                    'text-blue-500': theme.mode === 'light',
                    'text-purple-500': theme.mode === 'dark',
                  }"
                >
                  <Icon :name="theme.mode === 'light' ? 'i-lucide-sun' : 'i-lucide-moon'" class="w-3 h-3 inline mr-1" />
                  {{ theme.mode === 'light' ? 'Claro' : 'Escuro' }}
                </span>
                <span class="text-xs truncate text-muted">{{ theme.font }}</span>
              </div>
            </div>

            <div v-if="selectedPresetTheme === key" class="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center bg-slate/90 shadow-lg transition-all duration-200 bg-gradient-to-br from-slate-400 to-slate-600">
              <UIcon name="i-lucide-palette" class="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import primary from '@/utils/constants/colors/primary';
import { RadioGroupItem, SelectItem } from '@nuxt/ui';
import neutrals from '@/utils/constants/colors/neutrals';
import { ThemeKey, themes } from '@/utils/constants/colors/themes';

const appConfig = useAppConfig();
const colorMode = useColorMode() as any;

const themeOptions = Object.entries(themes)
  .map(([key, theme]) => ({
    label: theme.label,
    value: key,
    mode: theme.mode,
  }))
  .sort((a, b) => a.label.localeCompare(b.label, 'pt-BR'));

const currentFont = ref(localStorage.getItem('nuxt-font') ?? 'Inter');
const currentLayout = ref(localStorage.getItem('layout-mode') ?? 'centered');
const currentMode = ref(localStorage.getItem('nuxt-color-mode') ?? 'dark');
const descriptionMode = ref(localStorage.getItem('nuxt-description-mode') ?? 'true');
const currentViewMode = ref(localStorage.getItem('nuxt-view-mode') ?? 'table');
const currentPrimaryColor = ref(localStorage.getItem('theme:primary') ?? 'mist');

const selectedPresetTheme = ref<ThemeKey | ''>((localStorage.getItem('theme:preset') as ThemeKey) ?? '');

const currentSecondaryColor = ref(localStorage.getItem('theme:neutral') ?? 'neutral');

const currentPaginationSize = ref(localStorage.getItem('pagination:size') ?? 'dynamic');

const primaryColors = primary.map((color) => ({
  label: color,
  value: color,
  chip: color === 'neutral' ? 'old-neutral' : color,
})) as SelectItem[];

const neutralsColors = neutrals.map((color) => ({
  label: color,
  value: color,
  chip: color === 'neutral' ? 'old-neutral' : color,
})) as SelectItem[];

const modeOptions = ref<RadioGroupItem[]>([
  {
    label: 'Light',
    value: 'light',
    icon: 'i-lucide-sun',
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: 'i-lucide-moon',
  },
]);

const descriptionOptions = ref<RadioGroupItem[]>([
  {
    label: 'Não',
    value: 'false',
  },
  {
    label: 'Sim',
    value: 'true',
  },
]);

const viewModeOptions = ref<RadioGroupItem[]>([
  {
    label: 'Tabela',
    value: 'table',
  },
  {
    label: 'Cards',
    value: 'cards',
  },
]);

const layoutOptions = ref<RadioGroupItem[]>([
  {
    label: 'Full-Width',
    value: 'full',
  },
  {
    label: 'Centralizado',
    value: 'centered',
  },
]);

const paginationSizeOptions = [
  { label: 'Dinâmica', value: 'dynamic' },
  { label: '5', value: '5' },
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '50', value: '50' },
  { label: '100', value: '100' },
  { label: '200', value: '200' },
];

const fontOptions = [
  { label: 'Inter (Default)', value: 'Inter' },
  { label: 'Roboto', value: 'Roboto' },
  { label: 'Open Sans', value: 'Open Sans' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Poppins', value: 'Poppins' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Public Sans', value: 'Public Sans' },
  { label: 'Geist', value: 'Geist' },
  { label: 'Outfit', value: 'Outfit' },
  { label: 'Oxanium', value: 'Oxanium' },
];

const setTheme = (mode: 'light' | 'dark') => {
  colorMode.value = mode;
  localStorage.setItem('nuxt-color-mode', mode);
};

function applyFont(font: string) {
  const value = `"${font}", sans-serif`;
  document.documentElement.style.setProperty('--app-font', value);
  document.documentElement.style.setProperty('--font-sans', value);
}

const startViewTransition = (mode: string, event: MouseEvent) => {
  if (!document.startViewTransition) {
    setTheme(mode as 'light' | 'dark');
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
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

function resetTheme() {
  selectedPresetTheme.value = '';
  localStorage.removeItem('theme:preset');

  currentPrimaryColor.value = 'mist';
  currentSecondaryColor.value = 'neutral';
  appConfig.ui.colors.primary = 'mist';
  appConfig.ui.colors.neutral = 'neutral';

  localStorage.setItem('theme:primary', 'mist');
  localStorage.setItem('theme:neutral', 'neutral');
  localStorage.removeItem('font:custom');
  currentFont.value = 'Inter';

  applyFont('Inter');
}

function resetConfigs() {
  resetTheme();

  currentLayout.value = 'centered';
  localStorage.setItem('layout-mode', 'centered');
  const panels = document.querySelectorAll('.max-w-8xl');
  panels.forEach((panel) => {
    (panel as HTMLElement).style.maxWidth = '100rem';
  });

  currentPaginationSize.value = 'dynamic';
  localStorage.setItem('pagination:size', 'dynamic');

  descriptionMode.value = 'true';
  localStorage.setItem('nuxt-description-mode', 'true');

  currentViewMode.value = 'table';
  localStorage.setItem('nuxt-view-mode', 'table');

  currentMode.value = 'dark';
  setTheme('dark');
}

onMounted(() => {
  applyFont(currentFont.value);
  const savedPrimary = localStorage.getItem('theme:primary');
  const savedNeutral = localStorage.getItem('theme:neutral');

  if (savedPrimary) appConfig.ui.colors.primary = savedPrimary;
  if (savedNeutral) appConfig.ui.colors.neutral = savedNeutral;

  const panels = document.querySelectorAll('.max-w-8xl');
  panels.forEach((panel) => {
    (panel as HTMLElement).style.maxWidth = currentLayout.value === 'full' ? '100%' : '100rem';
  });

  const savedTheme = localStorage.getItem('theme:preset') as ThemeKey | null;
  const customFont = localStorage.getItem('font:custom');

  if (savedTheme && themes[savedTheme]) {
    selectedPresetTheme.value = savedTheme;

    const t = themes[savedTheme];
    appConfig.ui.colors.primary = t.primary;
    appConfig.ui.colors.neutral = t.neutral;

    if (!customFont) {
      currentFont.value = t.font;
      applyFont(t.font);
    }
  }
});

const exportTheme = () => {
  const themeData = {
    primary: currentPrimaryColor.value,
    neutral: currentSecondaryColor.value,
    font: currentFont.value,
    mode: colorMode.value,
  };

  const blob = new Blob([JSON.stringify(themeData, null, 2)], {
    type: 'application/json',
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `theme-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

const importTheme = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const themeData = JSON.parse(e.target?.result as string);

        currentPrimaryColor.value = themeData.primary || 'neutral';
        currentSecondaryColor.value = themeData.neutral || 'neutral';
        currentFont.value = themeData.font || 'Inter';

        appConfig.ui.colors.primary = themeData.primary || 'neutral';
        appConfig.ui.colors.neutral = themeData.neutral || 'neutral';

        localStorage.setItem('theme:primary', themeData.primary || 'mist');
        localStorage.setItem('theme:neutral', themeData.neutral || 'neutral');
        localStorage.setItem('nuxt-font', themeData.font || 'Inter');
        localStorage.setItem('font:custom', '1');

        applyFont(themeData.font || 'Inter');
        setThemeMode(themeData.mode || 'dark');

        selectedPresetTheme.value = '';
      } catch (error) {
        console.error('Erro ao importar tema:', error);
      }
    };

    reader.readAsText(file);
  };

  input.click();
};

const getThemePreview = (theme: any) => {
  const isDark = theme.mode === 'dark';
  return {
    backgroundColor: isDark ? '#18181b' : '#ffffff',
    color: isDark ? '#ffffff' : '#000000',
  };
};

const selectTheme = (key: ThemeKey) => {
  const theme = themes[key];

  selectedPresetTheme.value = key;
  currentPrimaryColor.value = theme.primary;
  currentSecondaryColor.value = theme.neutral;
  currentFont.value = theme.font;

  appConfig.ui.colors.primary = theme.primary;
  appConfig.ui.colors.neutral = theme.neutral;

  localStorage.setItem('theme:preset', key);
  localStorage.setItem('theme:primary', theme.primary);
  localStorage.setItem('theme:neutral', theme.neutral);
  localStorage.setItem('nuxt-font', theme.font);
  localStorage.removeItem('font:custom');

  applyFont(theme.font);
  setThemeMode(theme.mode);
};

const themeEntries = computed(() => {
  return Object.entries(themes).sort(([, a], [, b]) => {
    if (a.mode !== b.mode) {
      return a.mode === 'light' ? -1 : 1;
    }

    return a.label.localeCompare(b.label, 'pt-BR');
  });
});

const setThemeMode = (mode: 'light' | 'dark') => {
  colorMode.value = mode;
  currentMode.value = mode;
  localStorage.setItem('nuxt-color-mode', mode);
};

watch(
  currentFont,
  (font) => {
    localStorage.setItem('nuxt-font', font);
    applyFont(font);
  },
  { immediate: true }
);

watch(currentMode, (mode) => {
  setTheme(mode as 'light' | 'dark');
});

watch(currentPrimaryColor, (newColor) => {
  localStorage.setItem('theme:primary', newColor);
  appConfig.ui.colors.primary = newColor;
});

watch(currentSecondaryColor, (newColor) => {
  localStorage.setItem('theme:neutral', newColor);
  appConfig.ui.colors.neutral = newColor;
});

watch(currentPaginationSize, (value) => {
  localStorage.setItem('pagination:size', value);
});

watch(currentLayout, (value) => {
  localStorage.setItem('layout-mode', value);
  const panels = document.querySelectorAll('.max-w-8xl');

  panels.forEach((panel) => {
    if (value === 'full') {
      (panel as HTMLElement).style.maxWidth = '100%';
    } else {
      (panel as HTMLElement).style.maxWidth = '100rem';
    }
  });
});

watch(currentFont, (font) => {
  localStorage.setItem('nuxt-font', font);
  localStorage.setItem('font:custom', '1');
  applyFont(font);
});

watch(descriptionMode, (value) => {
  localStorage.setItem('nuxt-description-mode', value);
});

watch(currentViewMode, (value) => {
  localStorage.setItem('nuxt-view-mode', value);
});

watch(selectedPresetTheme, (key) => {
  if (!key) return;
  const theme = themes[key];

  currentPrimaryColor.value = theme.primary;
  appConfig.ui.colors.primary = theme.primary;
  localStorage.setItem('theme:primary', theme.primary);

  currentSecondaryColor.value = theme.neutral;
  appConfig.ui.colors.neutral = theme.neutral;
  localStorage.setItem('theme:neutral', theme.neutral);

  localStorage.setItem('theme:preset', key);
  localStorage.removeItem('font:custom');

  currentFont.value = theme.font;
  applyFont(theme.font);
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
</style>
