<template>
  <Card class="flex flex-col">
    <CardHeader class="items-center pb-0">
      <CardTitle>Pie Chart</CardTitle>
      <CardDescription>January - June 2024</CardDescription>
    </CardHeader>
    <CardContent class="aspect-auto h-[220px] w-full">
      <ChartContainer
        :config="chartConfig"
        class="mx-auto aspect-auto h-[220px] w-full"
        :style="{
          '--vis-donut-central-label-font-size': 'var(--text-3xl)',
          '--vis-donut-central-label-font-weight': 'var(--font-weight-bold)',
          '--vis-donut-central-label-text-color': 'var(--ui-text-muted)',
          '--vis-donut-central-sub-label-text-color': 'var(--ui-text-muted)',
        }"
      >
        <VisSingleContainer :data="chartData" :margin="{ top: 30, bottom: 30 }">
          <VisDonut :value="(d: Data) => d.visitors" :color="(d: Data) => chartConfig[d.browser as keyof typeof chartConfig].color" :arc-width="30" :central-label-offset-y="10" :central-label="totalVisitors.toLocaleString()" central-sub-label="Visitors" />
          <ChartTooltip
            :triggers="{
              [Donut.selectors.segment]: componentToString(chartConfig, ChartTooltipContent, { hideLabel: true })!,
            }"
          />
        </VisSingleContainer>
      </ChartContainer>
    </CardContent>
    <CardFooter class="flex-col gap-2 text-sm">
      <div class="flex items-center gap-2 font-medium leading-none">Trending up by 5.2% this month <TrendingUp class="h-4 w-4" /></div>
      <div class="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
    </CardFooter>
  </Card>
</template>

<script setup lang="ts">
import type { ChartConfig } from '@/components/shadcn-ui/chart';

import { Donut } from '@unovis/ts';
import { VisDonut, VisSingleContainer } from '@unovis/vue';
import { TrendingUp } from 'lucide-vue-next';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/shadcn-ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, componentToString } from '@/components/shadcn-ui/chart';

const chartData = [
  { browser: 'chrome', visitors: 275, fill: 'var(--color-chrome)' },
  { browser: 'safari', visitors: 200, fill: 'var(--color-safari)' },
  { browser: 'firefox', visitors: 287, fill: 'var(--color-firefox)' },
  { browser: 'edge', visitors: 173, fill: 'var(--color-edge)' },
  { browser: 'other', visitors: 190, fill: 'var(--color-other)' },
];
type Data = (typeof chartData)[number];

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: undefined,
  },
  chrome: {
    label: 'Chrome',
    color: 'var(--ui-primary)',
  },
  safari: {
    label: 'Safari',
    color: 'var(--ui-primary-50)',
  },
  firefox: {
    label: 'Firefox',
    color: 'var(--ui-info)',
  },
  edge: {
    label: 'Edge',
    color: 'var(--ui-success)',
  },
  other: {
    label: 'Other',
    color: 'var(--ui-warning)',
  },
} satisfies ChartConfig;

const totalVisitors = computed(() => chartData.reduce((acc, curr) => acc + curr.visitors, 0));
</script>
