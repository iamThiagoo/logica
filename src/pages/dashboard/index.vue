<template>
  <UDashboardPanel id="index">
    <template #body>
      <Transition name="fade-left">
        <div v-if="showContent">
          <UPageHeader
            :title="`${greetings()} ${user.firstname},`"
            :ui="{
              links: 'flex items-center relative gap-3 overflow-visible',
            }"
          >
            <template #links>
              <Transition name="fade-left" mode="out-in">
                <div :key="currentTab" class="relative left-0">
                  <component :is="linksComponent" />
                </div>
              </Transition>
            </template>
          </UPageHeader>

          <Transition name="fade-left" mode="out-in">
            <div :key="currentTab">
              <UTabs v-model="currentTab" color="neutral" variant="link" :items="items" :unmount-on-hide="false" class="w-full mb-6">
                <template #overview>
                  <DashboardStats :period="period" :range="range" class="mt-2" />
                </template>
                <template #analytics>
                  <DashboardAnalytics class="mt-4" />
                </template>
              </UTabs>
              <DashboardWidgetsGrid class="pb-2" />
            </div>
          </Transition>
        </div>
      </Transition>
    </template>

    <template #footer>
      <Transition name="fade-left">
        <div v-if="showContent" class="flex items-center justify-between gap-3 p-5 px-2 mx-5 border-t border-default">
          <div class="flex gap-3">
            <div class="flex flex-wrap items-center gap-4 text-sm text-muted">
              <a href="https://github.com/iamThiagoo" target="_blank" class="underline hover:opacity-80"> @iamThiagoo </a> - Todos os Direitos Reservados ©
              {{ new Date().getFullYear() }}
            </div>
          </div>

          <div class="flex items-center gap-2 text-sm text-muted">
            Versão do Sistema:
            <span class="underline flex items-center gap-1 cursor-pointer hover:opacity-50" @click="openModal('configuracoes', { tab: 'changelog' })">
              {{ appVersion }}
            </span>
          </div>
        </div>
      </Transition>
    </template>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { useModalStore } from '@/composables/use-modal';
import { IRange, TPeriod } from '@/utils/types/stats';
import { TabsItem } from '@nuxt/ui';
import { greetings } from '@/utils/helpers/shared/date';
import { getFirstName } from '@/utils/helpers/shared/string';
import { useAuthStore } from '@/stores/modules/auth.store';
import ExportDropdownMenu from '@/components/features/dashboard/dropdown-menu/ExportDropdownMenu.vue';
import DashboardAnalytics from '@/components/features/dashboard/analytics/DashboardAnalytics.vue';
import OverviewDropdownMenu from '@/components/features/dashboard/dropdown-menu/OverviewDropdownMenu.vue';
import ShortcutWidget from '@/components/features/dashboard/ShortcutWidget.vue';
import wave from '@/assets/images/wave.png';
import { sub } from 'date-fns';
import { useBreadcrumb } from '../../composables/use-breadcrumb';

const appVersion = __APP_VERSION__;
const { openModal } = useModalStore();
const showWave = ref(false);
const showContent = ref(false);
const period = ref<TPeriod>('daily');
const currentTab = ref('overview');
const range = shallowRef<IRange>({
  start: sub(new Date(), { days: 14 }),
  end: new Date(),
});
const { setBreadcrumb } = useBreadcrumb();

const userStore = useAuthStore();
const me = userStore.user;
const user = ref({
  firstname: getFirstName(me?.nome as string),
});

const items = ref<TabsItem[]>([
  {
    label: 'Visão Geral',
    slot: 'overview',
    value: 'overview',
    icon: 'i-hugeicons-cells',
  },
  {
    label: 'Principais Indicadores',
    slot: 'analytics',
    value: 'analytics',
    icon: 'i-hugeicons-analytics-01',
  },
]);

const headerDescription = computed(() => {
  const hour = new Date().getHours();

  const morningMessages = [
    'Espero que seu dia comece leve e produtivo.',
    'Café já foi? Se não, ainda dá tempo.',
    'Vamos começar organizando tudo com calma.',
    'Hora perfeita pra colocar as prioridades em dia.',
    'Que hoje renda bem e sem imprevistos.',
    'Começando mais um dia com foco e boas decisões.',
    'Vamos deixar tudo alinhado e bem encaminhado.',
    'Apenas faça acontecer e do melhor jeito.',
    'Vamos iniciar com clareza e sem correria.',
    'Um passo de cada vez e tudo flui.',
    'Comece com o básico bem feito: o resto vem junto.',
  ];

  const afternoonMessages = [
    'Vamos ver como estão as coisas e ajustar o que for preciso.',
    'Se o dia estiver corrido, respira… e vamos por partes.',
    'Agora é um ótimo momento pra acompanhar resultados e progresso.',
    'Aqui é o lugar certo pra manter tudo sob controle.',
    'Se algo saiu do plano, tudo bem… se reorganize.',
    'Hora de revisar o andamento e seguir com confiança.',
    'Vamos alinhar as prioridades e deixar tudo em ordem.',
    'Organizar agora evita dor de cabeça depois.',
    'Mais clareza e menos retrabalho.',
    'Vamos deixar o dia mais leve com tudo bem encaminhado.',
    'Vamos deixar preparado pra amanhã ser ainda melhor.',
  ];

  const nightMessages = [
    'Hora perfeita pra revisar e deixar tudo redondo.',
    'Vamos fechar as pendências com calma e clareza.',
    'Uma última conferida e o dia fica completo.',
    'Tudo certo pra encerrar o dia com tranquilidade.',
    'Vamos deixar preparado pra amanhã ser ainda melhor.',
    'Se o dia foi puxado, pelo menos a organização fica em dia.',
    'Agora é o momento ideal pra checar os detalhes.',
    'Vamos revisar os números e garantir que está tudo certo.',
    'Mais um passo e você pode descansar em paz.',
    'Fechando o dia com organização, como manda o manual.',
    'Se ainda estiver aqui, força! Já já dá pra respirar.',
  ];

  let selectedList = nightMessages;
  if (hour >= 5 && hour < 12) selectedList = morningMessages;
  else if (hour >= 12 && hour < 18) selectedList = afternoonMessages;
  const randomIndex = Math.floor(Math.random() * selectedList.length);

  return selectedList[randomIndex];
});

const linksComponent = computed(() => {
  if (currentTab.value === 'overview') return OverviewDropdownMenu;
  return ExportDropdownMenu;
});

onMounted(() => {
  showContent.value = true;
  // const now = Date.now();
  // const lastSeen = Number(localStorage.getItem('wave'));
  // const shouldShowWave = !lastSeen || now - lastSeen >= 5 * 60 * 60 * 1000;

  // if (shouldShowWave) {
  showWave.value = true;
  // localStorage.setItem('wave', String(now));
  setTimeout(() => {
    showWave.value = false;
  }, 2500);
  // }

  setBreadcrumb([]);
});
</script>
