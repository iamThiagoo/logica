import type { RouteRecordRaw } from 'vue-router';

export function filterUserRoutes(allRoutes: RouteRecordRaw[]) {
  const stored = localStorage.getItem('routes');
  if (!stored) return allRoutes;

  const savedNames = JSON.parse(stored) as { name: string }[];
  return allRoutes.filter((r) => savedNames.some((u) => u.name === r.name));
}
