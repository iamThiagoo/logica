<template>
  <div class="flex flex-row">
    <div class="flex w-full">
      <draggable v-model="state.data" item-key="cardKey" :animation="200" class="grid flex-1 lg:grid-cols-4 sm:gap-y-3! lg:gap-px w-full auto-rows-fr" @end="onDragEnd">
        <template #item="{ element, index }">
          <div class="w-full h-full">
            <UPageCard
              :to="element.to"
              :icon="element.icon"
              :title="element.title"
              variant="subtle"
              :ui="{
                root: `relative h-full flex flex-col drag-handle select-none my-1.5 ${cardRoundedClass(index)}`,
                container: 'gap-y-0 sm:p-6 sm:pb-1! sm:pt-4 flex-1',
                wrapper: 'items-start flex-none!',
                leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25',
                title: 'font-normal text-muted text-xs uppercase',
                body: 'mb-0! pb-0! flex-none!',
              }"
              class="btn-scale transform hover:-translate-y-0.5"
            >
              <div class="cursor-grab! active:cursor-grabbing! absolute top-4 right-3 z-10">
                <GripVertical class="size-6 text-neutral-600" />
              </div>

              <div class="flex items-center gap-2">
                <NumberFlowGroup>
                  <div style="--number-flow-char-height: 1.25rem" class="flex items-center gap-4 font-semibold">
                    <NumberFlow :value="element.value" class="text-xl font-semibold text-highlighted relative -top-1.5" />
                    <div class="flex items-center gap-2">
                      <NumberFlow
                        :value="element.diff"
                        locales="en-US"
                        :format="{
                          style: 'percent',
                          minimumFractionDigits: 1,
                          maximumFractionDigits: 2,
                          signDisplay: 'always',
                        }"
                        :class="['text-sm transition-colors duration-300 relative -top-1.5', element.diff < 0 ? 'text-red-500' : 'text-emerald-500']"
                      />
                      <span class="text-xs font-medium text-muted relative -top-1.5"> comparado ao período anterior </span>
                    </div>
                  </div>
                </NumberFlowGroup>
              </div>
            </UPageCard>
          </div>
        </template>
      </draggable>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useOverviewCards } from '@/stores/modules/overview-cards.store';
import { overviewCardsConfigMap } from '@/utils/types/map/overview-cards.map';
import { randomInt } from '@/utils/helpers/shared';
import NumberFlow from '@number-flow/vue';
import { GripVertical } from 'lucide-vue-next';
import draggable from 'vuedraggable';

const state = reactive({
  data: [] as any[],
});

const overviewCards = useOverviewCards();
const allStatsConfig = reactive([
  {
    cardKey: 'clients-overview-card',
    title: 'Clientes ativos na base',
    icon: overviewCardsConfigMap['clients-overview-card'].icon,
    to: '/clientes',
    minValue: 80,
    maxValue: 180,
    minVariation: -5,
    maxVariation: 18,
  },
  {
    cardKey: 'leads-overview-card',
    title: 'Leads em acompanhamento',
    icon: overviewCardsConfigMap['leads-overview-card'].icon,
    to: '/leads',
    minValue: 20,
    maxValue: 70,
    minVariation: -8,
    maxVariation: 24,
  },
  {
    cardKey: 'users-overview-card',
    title: 'Usuários habilitados',
    icon: overviewCardsConfigMap['users-overview-card'].icon,
    to: '/usuarios',
    minValue: 10,
    maxValue: 40,
    minVariation: -2,
    maxVariation: 12,
  },
  {
    cardKey: 'drive-overview-card',
    title: 'Arquivos compartilhados',
    icon: overviewCardsConfigMap['drive-overview-card'].icon,
    to: '/drive',
    minValue: 35,
    maxValue: 120,
    minVariation: -10,
    maxVariation: 16,
  },
  {
    cardKey: 'meetings-overview-card',
    title: 'Reuniões agendadas',
    icon: overviewCardsConfigMap['meetings-overview-card'].icon,
    to: '/agenda-reunioes',
    minValue: 8,
    maxValue: 26,
    minVariation: -12,
    maxVariation: 20,
  },
  {
    cardKey: 'onboarding-overview-card',
    title: 'Onboarding em andamento',
    icon: overviewCardsConfigMap['onboarding-overview-card'].icon,
    to: '/clientes',
    minValue: 3,
    maxValue: 18,
    minVariation: -10,
    maxVariation: 15,
  },
  {
    cardKey: 'conversion-overview-card',
    title: 'Conversões recentes',
    icon: overviewCardsConfigMap['conversion-overview-card'].icon,
    to: '/leads',
    minValue: 4,
    maxValue: 16,
    minVariation: -6,
    maxVariation: 14,
  },
  {
    cardKey: 'satisfaction-overview-card',
    title: 'Satisfação média',
    icon: overviewCardsConfigMap['satisfaction-overview-card'].icon,
    to: '/',
    minValue: 86,
    maxValue: 98,
    minVariation: -3,
    maxVariation: 8,
  },
]);

function buildStats() {
  const orderedKeys = overviewCards.getOrderedCards();
  const statsMap = new Map(allStatsConfig.map((stat) => [stat.cardKey, stat]));

  state.data = orderedKeys
    .filter((key) => overviewCards.isVisible(key))
    .map((key) => {
      const stat = statsMap.get(key);
      if (!stat) return null;

      const finalValue = randomInt(stat.minValue, stat.maxValue);
      const variation = randomInt(stat.minVariation, stat.maxVariation);

      return {
        cardKey: stat.cardKey,
        title: stat.title,
        icon: stat.icon,
        to: stat.to,
        value: 0,
        diff: 0,
        finalValue,
        finalDiff: variation / 100,
      };
    })
    .filter(Boolean);

  setTimeout(() => {
    state.data.forEach((item) => {
      item.value = item.finalValue;
      item.diff = item.finalDiff;
    });
  }, 100);
}

function onDragEnd() {
  const newOrder = state.data.map((item) => item.cardKey);
  overviewCards.saveOrder(newOrder);
}

onMounted(() => {
  overviewCards.load();
  buildStats();
});

watch(
  () => overviewCards.visibleCards,
  () => buildStats(),
  { deep: true }
);

function cardRoundedClass(index: number) {
  const pos = (index + 1) % 4;
  if (pos === 1) return 'rounded-l-lg rounded-r-none';
  if (pos === 0) return 'rounded-r-lg rounded-l-none';
  return 'rounded-none';
}
</script>
