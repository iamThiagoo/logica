import { defineStore } from 'pinia';
import { OverviewCardKey, OverviewCardsState } from '@/utils/types/overview';

const STORAGE_PREFIX = 'card:';
const ORDER_STORAGE_KEY = 'cards:order';

export const useOverviewCards = defineStore('overview-cards', () => {
  const defaultCardsState: OverviewCardsState = {
    'clients-overview-card': true,
    'leads-overview-card': true,
    'users-overview-card': true,
    'drive-overview-card': true,
    'meetings-overview-card': true,
    'onboarding-overview-card': true,
    'conversion-overview-card': true,
    'satisfaction-overview-card': true,
  };

  const cardsOrder = ref<OverviewCardKey[]>([]);
  const cards: any = ref<OverviewCardsState>({ ...defaultCardsState });

  const visibleCards = computed(() =>
    Object.entries(cards.value)
      .filter(([, visible]) => visible)
      .map(([key]) => key as OverviewCardKey)
  );

  const isVisible = (key: OverviewCardKey) => cards.value[key];

  function load() {
    for (const key in cards.value) {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (saved !== null) {
        cards.value[key] = saved === 'true';
      }
    }

    const savedOrder = localStorage.getItem(ORDER_STORAGE_KEY);
    if (savedOrder) {
      try {
        cardsOrder.value = JSON.parse(savedOrder);
      } catch (e) {
        console.error('Erro ao carregar ordem dos cards:', e);
        cardsOrder.value = Object.keys(cards.value) as OverviewCardKey[];
      }
    } else {
      cardsOrder.value = Object.keys(cards.value) as OverviewCardKey[];
    }
  }

  function saveOrder(order: OverviewCardKey[]) {
    cardsOrder.value = order;
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
  }

  function getOrderedCards(): OverviewCardKey[] {
    if (cardsOrder.value.length === 0) {
      return Object.keys(cards.value) as OverviewCardKey[];
    }

    const allCardKeys = Object.keys(cards.value) as OverviewCardKey[];
    const missingKeys = allCardKeys.filter((key) => !cardsOrder.value.includes(key));

    return [...cardsOrder.value, ...missingKeys];
  }

  function setVisibility(key: OverviewCardKey, value: boolean) {
    cards.value[key] = value;
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, String(value));
  }

  function toggle(key: OverviewCardKey) {
    setVisibility(key, !cards.value[key]);
  }

  function setFromSelect(keys: OverviewCardKey[]) {
    for (const key in cards.value) {
      const visible = keys.includes(key as OverviewCardKey);
      setVisibility(key as OverviewCardKey, visible);
    }
  }

  function resetToDefault() {
    const defaultOrder = Object.keys(defaultCardsState) as OverviewCardKey[];

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
