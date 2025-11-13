import { defineStore } from 'pinia';
import { AnalyticsCardKey, AnalyticsCardsState } from '@/utils/types/analytics';

const STORAGE_PREFIX = 'analytics-card:';
const ORDER_STORAGE_KEY = 'analytics-cards:order';

export const useAnalyticsCards = defineStore('analytics-cards', () => {
  const defaultCardsState: AnalyticsCardsState = {
    'chart-area': true,
    'chart-bar': true,
    'chart-line': true,
    'chart-bar-2': true,
    'chart-tooltip': true,
    'chart-pie': true,
  };

  const cardsOrder = ref<AnalyticsCardKey[]>([]);
  const cards = ref<AnalyticsCardsState>({ ...defaultCardsState });

  const visibleCards = computed(() =>
    Object.entries(cards.value)
      .filter(([, visible]) => visible)
      .map(([key]) => key as AnalyticsCardKey)
  );

  const isVisible = (key: AnalyticsCardKey) => cards.value[key];

  function load() {
    (Object.keys(cards.value) as AnalyticsCardKey[]).forEach((key) => {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (saved !== null) {
        cards.value[key] = saved === 'true';
      }
    });

    const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    if (savedOrder) {
      try {
        cardsOrder.value = JSON.parse(savedOrder);
      } catch (e) {
        console.error('Erro ao carregar ordem dos cards:', e);
        cardsOrder.value = Object.keys(cards.value) as AnalyticsCardKey[];
      }
    } else {
      cardsOrder.value = Object.keys(cards.value) as AnalyticsCardKey[];
    }
  }

  function saveOrder(order: AnalyticsCardKey[]) {
    cardsOrder.value = order;
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  }

  function getOrderedCards(): AnalyticsCardKey[] {
    if (cardsOrder.value.length === 0) {
      return Object.keys(cards.value) as AnalyticsCardKey[];
    }

    const allCardKeys = Object.keys(cards.value) as AnalyticsCardKey[];
    const missingKeys = allCardKeys.filter((key) => !cardsOrder.value.includes(key));

    return [...cardsOrder.value, ...missingKeys];
  }

  function setVisibility(key: AnalyticsCardKey, value: boolean) {
    cards.value[key] = value;
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, String(value));
  }

  function toggle(key: AnalyticsCardKey) {
    setVisibility(key, !cards.value[key]);
  }

  function setFromSelect(keys: AnalyticsCardKey[]) {
    for (const key in cards.value) {
      const visible = keys.includes(key as AnalyticsCardKey);
      setVisibility(key as AnalyticsCardKey, visible);
    }
  }

  function resetToDefault() {
    const defaultOrder = Object.keys(defaultCardsState) as AnalyticsCardKey[];

    cards.value = { ...defaultCardsState };
    cardsOrder.value = [...defaultOrder];

    defaultOrder.forEach((key) => {
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, 'true');
    });
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(defaultOrder));
  }

  return {
    cards,
    cardsOrder,
    visibleCards,
    isVisible,
    load,
    saveOrder,
    getOrderedCards,
    setVisibility,
    toggle,
    setFromSelect,
    resetToDefault,
  };
});
