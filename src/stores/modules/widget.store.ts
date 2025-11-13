import { defineStore } from 'pinia';

export const useWidgetStore = defineStore('widgets', () => {
  const widgets: any = ref({
    'day-progress-widget': true,
    'quick-links-widget': true,
    'birthdays-widget': true,
    'quote-widget': true,
  });

  function load() {
    for (const key of Object.keys(widgets.value)) {
      const saved = localStorage.getItem(`widget:${key}`);
      if (saved !== null) {
        widgets.value[key] = saved === 'true';
      }
    }
  }

  function setVisibility(key: string, value: boolean) {
    widgets.value[key] = value;
    localStorage.setItem(`widget:${key}`, String(value));
  }

  return { widgets, load, setVisibility };
});
