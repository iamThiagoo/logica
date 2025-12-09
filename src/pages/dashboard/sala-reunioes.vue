<template>
  <UDashboardPanel class="flex flex-col max-w-8xl h-full min-h-0">
    <template #body>
      <UMain class="flex flex-col flex-1 min-h-0!">
        <Transition name="fade-left">
          <div v-if="showContent" class="flex flex-col flex-1 min-h-0">
            <UPageHeader
              :title="pageTitle"
              :description="shouldShowDescription ? pageDescription : undefined"
              class="mb-1"
              :ui="{
                links: shouldShowDescription ? 'flex flex-wrap absolute right-0 top-2 mb-4 2xl:relative 2xl:justify-end 2xl:items-center 2xl:mb-0 sm:gap-3 2xl:mt-0.5 overflow-visible' : 'flex flex-wrap absolute right-0 mb-4 2xl:relative 2xl:justify-end 2xl:items-center 2xl:mb-0 sm:gap-3 2xl:mt-0.5 overflow-visible',
              }"
            >
              <template #title>
                <div class="flex items-center gap-2">
                  <span>{{ pageTitle }}</span>

                  <UTooltip :text="pinButtonLabel">
                    <UButton size="xs" :icon="pinButtonIcon" :title="pinButtonLabel" :aria-label="pinButtonLabel" :aria-pressed="isCurrentPagePinned" :color="isCurrentPagePinned ? 'success' : 'neutral'" :variant="isCurrentPagePinned ? 'soft' : 'outline'" class="cursor-pointer transition-colors" @click="toggleCurrentPagePin" @keydown.enter.prevent="toggleCurrentPagePin" @keydown.space.prevent="toggleCurrentPagePin" />
                  </UTooltip>
                </div>
              </template>

              <template #links>
                <header class="flex items-center justify-between gap-4">
                  <div class="header-left">
                    <div class="header-center">
                      <button class="btn-nav" aria-label="Anterior" @click="navigatePrevious">
                        <ChevronLeft :size="15" />
                      </button>
                      <h2 class="current-period text-base! font-medium!">
                        {{ currentPeriodLabel }}
                      </h2>
                      <button class="btn-nav" aria-label="Próximo" @click="navigateNext">
                        <ChevronRight :size="15" />
                      </button>
                    </div>
                  </div>

                  <USeparator
                    orientation="vertical"
                    class="h-8"
                    :ui="{
                      border: 'dark:border-neutral-600',
                    }"
                  />

                  <div class="header-right">
                    <button class="btn-today text-xs!" @click="goToToday">Hoje</button>
                    <div class="view-switcher">
                      <button v-for="view in views" :key="view.value" :class="['view-btn text-xs!', { active: currentView === view.value }]" @click="currentView = view.value">
                        {{ view.label }}
                      </button>
                    </div>
                  </div>

                  <USeparator
                    orientation="vertical"
                    class="h-8"
                    :ui="{
                      border: 'dark:border-neutral-600',
                    }"
                  />

                  <UButton size="lg" color="primary" icon="i-lucide-plus" class="w-auto btn-plus bg-primary-600 dark:text-gray-100 hover:text-white flex" label="Nova" @click="openEventModal()">
                    <template #leading>
                      <lord-icon trigger="hover" target=".btn-plus" :colors="`primary:#fff`" src="/lord-icon/plus.json" class="h-5 w-5" />
                    </template>
                    <template #trailing>
                      <UKbd v-if="keyboardShortcutsEnabled" value="A" />
                    </template>
                  </UButton>
                </header>
              </template>
            </UPageHeader>

            <div ref="tableContainer" class="flex flex-col flex-1 min-h-0 overflow-hidden p-0.5 rounded-2xl dark:bg-default">
              <div :class="['calendar-app', isDark ? 'dark' : '']">
                <div class="calendar-body bg-white dark:bg-default! rounded-xl">
                  <div class="calendar-layout dark:bg-[#18181b]">
                    <div class="calendar-layout-row">
                      <div class="calendar-main">
                        <div v-if="currentView !== 'agenda'" class="calendar-grid-container">
                          <div v-if="currentView === 'month'" class="month-view bg-neutral-850 pt-4.5!">
                            <div class="month-grid">
                              <div
                                v-for="(day, index) in monthDays"
                                :key="index"
                                :class="[
                                  'day-cell',
                                  {
                                    'other-month': !day.isCurrentMonth,
                                    today: isToday(day.date),
                                    selected: selectedDate && isSameDay(selectedDate, day.date),
                                  },
                                ]"
                                @click="handleDayClick(day.date)"
                                @dragover.prevent
                                @drop="handleDrop($event, day.date)"
                              >
                                <div class="flex w-full justify-between">
                                  <div class="day-number text-xs">
                                    {{ day.date.getDate() }}
                                  </div>
                                  <div class="text-muted text-xs mt-0.5">
                                    {{
                                      day.date
                                        .toLocaleDateString('pt-BR', {
                                          weekday: 'short',
                                        })
                                        .replace('.', '')
                                        .replace(/^./, (c) => c.toUpperCase())
                                    }}
                                  </div>
                                </div>
                                <div class="day-events">
                                  <div
                                    v-for="event in getEventsForDay(day.date)"
                                    :key="event.id"
                                    :class="['event-badge relative']"
                                    draggable="true"
                                    :style="{
                                      borderLeftColor: event.color || '#93c5fd',
                                    }"
                                    @dragstart="handleDragStart($event, event)"
                                    @click.stop="openEventModal(event)"
                                  >
                                    <div class="event-time">
                                      {{ formatTime(event.startTime) }}
                                    </div>
                                    <div class="event-title">
                                      {{ event.title }}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div v-if="currentView === 'week'" class="week-view">
                            <div class="week-header">
                              <div class="time-gutter" />
                              <div v-for="day in weekDays" :key="day" class="week-day-header">
                                <div class="day-name">
                                  {{ weekDaysShort[weekDays.indexOf(day)] }}
                                </div>
                                <div
                                  :class="[
                                    'day-date',
                                    {
                                      today: isToday(getWeekDay(weekDays.indexOf(day))),
                                    },
                                  ]"
                                >
                                  {{ getWeekDay(weekDays.indexOf(day)).getDate() }}
                                </div>
                              </div>
                            </div>

                            <div class="week-body">
                              <div class="time-slots">
                                <div v-for="hour in 24" :key="hour" class="time-slot">
                                  <div class="time-label">
                                    {{ formatHour(hour - 1) }}
                                  </div>
                                </div>
                              </div>

                              <div class="week-columns">
                                <div v-for="(day, dayIndex) in 7" :key="dayIndex" class="week-column" @dragover.prevent @drop="handleDrop($event, getWeekDay(dayIndex))">
                                  <div v-for="hour in 24" :key="hour" class="hour-cell" @click="createEventAtTime(getWeekDay(dayIndex), hour - 1)" />

                                  <div v-for="event in getEventsForDay(getWeekDay(dayIndex))" :key="event.id" :class="['week-event', `priority-${event.priority}`]" :style="getEventStyle(event)" draggable="true" @dragstart="handleDragStart($event, event)" @click="openEventModal(event)">
                                    <div class="event-content">
                                      <div class="event-category-indicator" />
                                      <div class="event-details">
                                        <div class="event-title-week">
                                          {{ event.title }}
                                        </div>
                                        <div class="event-time-week">
                                          {{ formatTime(event.startTime) }} -
                                          {{ formatTime(event.endTime) }}
                                        </div>
                                      </div>
                                    </div>
                                    <div class="resize-handle" @mousedown.stop="startResize($event, event)" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div v-if="currentView === 'day'" class="day-view">
                            <div class="day-view-header">
                              <div class="time-gutter" />
                              <div class="day-view-title">
                                <div class="day-name">
                                  {{ formatDayName(currentDate) }}
                                </div>
                                <div :class="['day-date', { today: isToday(currentDate) }]">
                                  {{ currentDate.getDate() }}
                                </div>
                              </div>
                            </div>

                            <div class="day-view-body">
                              <div class="time-slots">
                                <div v-for="hour in 24" :key="hour" class="time-slot">
                                  <div class="time-label">
                                    {{ formatHour(hour - 1) }}
                                  </div>
                                </div>
                              </div>

                              <div class="day-column" @dragover.prevent @drop="handleDrop($event, currentDate)">
                                <div v-for="hour in 24" :key="hour" class="hour-cell" @click="createEventAtTime(currentDate, hour - 1)" />

                                <div v-for="event in getEventsForDay(currentDate)" :key="event.id" :class="['day-event', `priority-${event.priority}`]" :style="getEventStyle(event)" draggable="true" @dragstart="handleDragStart($event, event)" @click="openEventModal(event)">
                                  <div class="event-content">
                                    <div class="event-category-indicator" />
                                    <div class="event-details">
                                      <div class="event-title-week">
                                        {{ event.title }}
                                      </div>
                                      <div class="event-time-week">
                                        {{ formatTime(event.startTime) }} -
                                        {{ formatTime(event.endTime) }}
                                      </div>
                                    </div>
                                  </div>

                                  <div class="resize-handle" @mousedown.stop="startResize($event, event)" />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-if="currentView === 'agenda'" class="agenda-view">
                          <div v-for="(groupEvents, dateKey) in groupedUpcomingEvents" :key="dateKey" class="agenda-date-group">
                            <div class="agenda-date-header">
                              <div class="agenda-date">
                                {{ formatAgendaDate(dateKey) }}
                              </div>
                              <div class="agenda-weekday">
                                {{ formatAgendaWeekday(dateKey) }}
                              </div>
                            </div>

                            <div class="agenda-events">
                              <div v-for="event in groupEvents" :key="event.id" class="agenda-event" @click="openEventModal(event)">
                                <div class="agenda-event-time">
                                  <div>{{ formatTime(event.startTime) }}</div>
                                  <div class="time-separator">-</div>
                                  <div>{{ formatTime(event.endTime) }}</div>
                                </div>

                                <div class="agenda-event-content">
                                  <div class="agenda-event-header">
                                    <div class="agenda-category-dot" />
                                    <h3 class="agenda-event-title">
                                      {{ event.title }}
                                    </h3>
                                    <span v-if="event.priority === 'high'" class="priority-badge"> Alta prioridade </span>
                                  </div>

                                  <p v-if="event.description" class="agenda-event-description">
                                    {{ event.description }}
                                  </p>

                                  <div class="agenda-event-meta">
                                    <span class="meta-item">
                                      <Tag :size="14" />
                                    </span>
                                    <span v-if="event.location" class="meta-item">
                                      <MapPin :size="14" />
                                      {{ event.location }}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <aside class="calendar-sidebar">
                        <div class="sidebar-header">
                          <div class="sidebar-title">Agendado</div>
                          <div class="sidebar-date">
                            {{ sidebarDateLabel }}
                          </div>
                        </div>

                        <div v-if="sidebarEvents.length" class="sidebar-events pt-1! pb-3!">
                          <div v-for="event in sidebarEvents" :key="event.id" class="sidebar-event" @click="openEventModal(event)">
                            <div class="sidebar-event-accent" :style="{ background: event.color || '#60a5fa' }" />
                            <div class="sidebar-event-body relative w-full">
                              <div class="flex justify-between items-center w-full">
                                <div class="sidebar-event-time">
                                  {{ formatTime(event.startTime) }} -
                                  {{ formatTime(event.endTime) }}
                                </div>
                                <span v-if="event.location" class="meta-item text-[12px]! absolute right-0">
                                  {{ event.location }}
                                </span>
                              </div>
                              <div class="sidebar-event-title">
                                {{ event.title }}
                              </div>
                              <div v-if="event.location || event.organizer" class="sidebar-event-meta">
                                <span v-if="event.organizer" class="meta-item">
                                  <UAvatar size="3xs" :alt="event.organizer" :src="event.avatar" icon="i-lucide-user-round" />
                                  {{ event.organizer }}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-else class="sidebar-empty">
                          <div class="sidebar-empty-title">Sem reuniões neste dia</div>
                          <div class="sidebar-empty-desc">Clique em um dia para criar uma nova reserva.</div>
                        </div>
                      </aside>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Transition>
      </UMain>
    </template>
  </UDashboardPanel>
</template>

<script setup>
import { pagesIconsMap } from '@/utils/types/map/icons-map';
import { useMeetingsCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { ChevronLeft, ChevronRight, Tag, MapPin } from 'lucide-vue-next';
import { useColorMode } from '@vueuse/core';
import { formatAgendaWeekday, formatDayName, formatHour, formatTime } from '@/utils/helpers/shared/date';
import { useBreadcrumb } from '../../composables/use-breadcrumb';
import { useShortcutsStore } from '@/stores/modules/shortcut.store';
import { useKeyboardShortcuts } from '@/composables/use-keyboard-shortcuts';

const pageTitle = 'Agenda de Reuniões';
const pageDescription = 'Crie e acompanhe reservas de salas e eventos internos usando dados mockados locais.';
const tableContainer = ref(null);
const showContent = ref(false);
const { openModal } = useModalStore();
const { setBreadcrumb } = useBreadcrumb();
const route = useRoute();
const shortcutsStore = useShortcutsStore();
const { registerShortcuts, enabled } = useKeyboardShortcuts();
const breadcrumbItems = [
  { label: 'Meu Dashboard', icon: pagesIconsMap.home_root, to: '/' },
  { label: 'Agenda de Reuniões', icon: pagesIconsMap.meeting_room },
];
let unregisterKeyboardShortcuts = null;
const keyboardShortcutsEnabled = computed(() => enabled.value);
const { items: events } = useMeetingsCrud();

const currentPageShortcut = computed(() => shortcutsStore.createFromRoute(route, { title: pageTitle }));

const isCurrentPagePinned = computed(() => {
  const currentShortcut = currentPageShortcut.value;
  return !!currentShortcut && shortcutsStore.isPinned(currentShortcut.key);
});

const pinButtonLabel = computed(() => (isCurrentPagePinned.value ? 'Desfixar página na Home' : 'Fixar página na Home'));

const pinButtonIcon = computed(() => (isCurrentPagePinned.value ? 'mynaui:pin' : 'i-lucide-pin-off'));

const toggleCurrentPagePin = () => {
  shortcutsStore.toggleRoute(route, { title: pageTitle });
};

const shouldShowDescription = computed(() => {
  const descriptionMode = localStorage.getItem('nuxt-description-mode');
  return descriptionMode !== 'false';
});

onMounted(() => {
  shortcutsStore.load();
  showContent.value = true;
  setBreadcrumb(breadcrumbItems);

  unregisterKeyboardShortcuts = registerShortcuts([
    {
      id: 'table-create',
      allowWhenModalOpen: false,
      handler: () => {
        openEventModal();
      },
    },
  ]);
});

onUnmounted(() => {
  unregisterKeyboardShortcuts?.();
  unregisterKeyboardShortcuts = null;
});

const colorMode = useColorMode();
const isDark = computed(() => colorMode.value === 'dark');
const currentView = ref('month');
const currentDate = ref(new Date());
const selectedDate = ref(null);
const draggedEvent = ref(null);
const resizingEvent = ref(null);
const resizeStartY = ref(0);
const resizeStartHeight = ref(0);
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const weekDaysShort = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const views = [
  { label: 'Dia', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mês', value: 'month' },
];

// Funções auxiliares
const getWeekDay = (dayIndex) => {
  const weekStart = getWeekStart(currentDate.value);
  const day = new Date(weekStart);
  day.setDate(day.getDate() + dayIndex);
  return day;
};

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const currentPeriodLabel = computed(() => {
  const date = currentDate.value;
  const options = { month: 'long', year: 'numeric' };

  if (currentView.value === 'day') {
    return new Intl.DateTimeFormat('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } else if (currentView.value === 'week') {
    const weekStart = getWeekStart(date);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${weekStart.getDate()} - ${weekEnd.getDate()} ${new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(weekEnd)}`;
  }

  const label = new Intl.DateTimeFormat('pt-BR', options).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
});

const monthDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const days = [];

  const firstDayOfWeek = firstDay.getDay();
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const date = new Date(year, month, -i);
    days.push({ date, isCurrentMonth: false });
  }

  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    days.push({ date, isCurrentMonth: true });
  }

  const remainingDays = 35 - days.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    days.push({ date, isCurrentMonth: false });
  }

  return days;
});

const groupedUpcomingEvents = computed(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = events.value
    .filter((event) => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => a.startTime - b.startTime);

  const grouped = {};
  upcoming.forEach((event) => {
    const dateKey = event.startTime.toISOString().split('T')[0];
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(event);
  });

  return grouped;
});

const sidebarDate = computed(() => selectedDate.value || currentDate.value);
const sidebarEvents = computed(() => {
  return getEventsForDay(sidebarDate.value).sort((a, b) => a.startTime - b.startTime);
});
const sidebarDateLabel = computed(() => {
  const date = sidebarDate.value;
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
});

const goToToday = () => {
  currentDate.value = new Date();
};

const navigatePrevious = () => {
  const date = new Date(currentDate.value);
  if (currentView.value === 'day') {
    date.setDate(date.getDate() - 1);
  } else if (currentView.value === 'week') {
    date.setDate(date.getDate() - 7);
  } else if (currentView.value === 'month') {
    date.setMonth(date.getMonth() - 1);
  }
  currentDate.value = date;
};

const navigateNext = () => {
  const date = new Date(currentDate.value);
  if (currentView.value === 'day') {
    date.setDate(date.getDate() + 1);
  } else if (currentView.value === 'week') {
    date.setDate(date.getDate() + 7);
  } else if (currentView.value === 'month') {
    date.setMonth(date.getMonth() + 1);
  }
  currentDate.value = date;
};

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
};

const isSameDay = (date1, date2) => {
  return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
};

const formatAgendaDate = (dateKey) => {
  const date = new Date(dateKey);
  return new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const getEventsForDay = (date) => {
  return events.value.filter((event) => {
    return isSameDay(event.startTime, date);
  });
};

const getEventStyle = (event) => {
  const startHour = event.startTime.getHours();
  const startMinute = event.startTime.getMinutes();
  const endHour = event.endTime.getHours();
  const endMinute = event.endTime.getMinutes();
  const top = (startHour + startMinute / 60) * 60;
  const height = (endHour + endMinute / 60 - (startHour + startMinute / 60)) * 60;
  return {
    top: `${top}px`,
    height: `${height}px`,
    borderLeftColor: event.color,
  };
};

const openEventModal = (event = null) => {
  if (event) {
    openModal('evento', {
      mode: 'edit',
      event: { ...event },
    });
  } else {
    const startDate = selectedDate.value || currentDate.value || new Date();
    openModal('evento', {
      mode: 'create',
      defaultDate: startDate,
    });
  }
};

const createEventAtTime = (date, hour) => {
  const startDate = new Date(date);
  startDate.setHours(hour, 0, 0, 0);
  openModal('evento', {
    mode: 'create',
    defaultDate: startDate,
    defaultHour: hour,
  });
};

const handleDayClick = (date) => {
  selectedDate.value = date;
  openEventModal();
};

const handleDragStart = (e, event) => {
  draggedEvent.value = event;
  e.dataTransfer.effectAllowed = 'move';
};

const handleDrop = (e, newDate) => {
  if (!draggedEvent.value) return;
  const event = draggedEvent.value;
  const oldStart = new Date(event.startTime);
  const duration = event.endTime - event.startTime;
  const newStart = new Date(newDate);
  newStart.setHours(oldStart.getHours(), oldStart.getMinutes());
  const newEnd = new Date(newStart.getTime() + duration);
  const index = events.value.findIndex((e) => e.id === event.id);
  events.value[index] = {
    ...event,
    startTime: newStart,
    endTime: newEnd,
  };

  draggedEvent.value = null;
};

const startResize = (e, event) => {
  resizingEvent.value = event;
  resizeStartY.value = e.clientY;
  resizeStartHeight.value = (event.endTime - event.startTime) / 60000;
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (e) => {
  if (!resizingEvent.value) return;
  const deltaY = e.clientY - resizeStartY.value;
  const deltaMinutes = Math.round((deltaY / 60) * 60);
  const newDuration = Math.max(15, resizeStartHeight.value + deltaMinutes);
  const newEndTime = new Date(resizingEvent.value.startTime.getTime() + newDuration * 60000);

  const index = events.value.findIndex((e) => e.id === resizingEvent.value.id);
  events.value[index] = {
    ...events.value[index],
    endTime: newEndTime,
  };
};

const stopResize = () => {
  resizingEvent.value = null;
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
};
</script>

<style scoped>
@import '@/assets/css/calendar.css';
</style>
