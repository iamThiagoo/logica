import { AnalyticsCardKey } from '@/utils/types/analytics';

export const analyticsCardsConfigMap: Record<
  AnalyticsCardKey,
  {
    label: string;
    icon?: string;
  }
> = {
  'chart-area': {
    label: 'Chart Área',
    icon: 'i-lucide-area-chart',
  },
  'chart-bar': {
    label: 'Chart Barra',
    icon: 'i-lucide-bar-chart',
  },
  'chart-line': {
    label: 'Chart Linha',
    icon: 'i-lucide-line-chart',
  },
  'chart-bar-2': {
    label: 'Chart Barra 2',
    icon: 'i-lucide-bar-chart-2',
  },
  'chart-tooltip': {
    label: 'Tooltip',
    icon: 'i-lucide-message-circle',
  },
  'chart-pie': {
    label: 'Pizza',
    icon: 'i-lucide-pie-chart',
  },
};

export type AnalyticsCardsConfigMap = typeof analyticsCardsConfigMap;
