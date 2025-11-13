<template>
  <UModal
    v-model:open="modals['evento'].open"
    :title="modalTitle"
    :description="modalDescription"
    :ui="{
      content: 'max-w-4xl',
      body: 'p-6 py-5! pb-6! space-y-8!',
    }"
    @update:open="
      (open: boolean) => {
        if (!open) closeModal('evento');
      }
    "
  >
    <template #body>
      <UForm id="form" :state="form" :schema="schema" class="flex gap-x-6" @submit="handleSubmit">
        <div class="space-y-6 flex-1">
          <UFormField v-if="isEditMode" label="Organizador" readonly name="organizer" class="w-full">
            <UInput v-model="form.organizer" class="w-full" readonly variant="subtle" placeholder="Organizador da reunião" />
          </UFormField>

          <div class="flex gap-4">
            <UFormField label="Título" name="title" class="w-full" required>
              <UInput v-model="form.title" class="w-full" placeholder="Título da reunião" />
            </UFormField>

            <IconSelector v-model="form.icon" label="Ícone" name="icon" class="w-48" placeholder="Selecione um ícone" :required="true" />
          </div>

          <UFormField label="Descrição (opcional)" class="w-full" name="description">
            <UTextarea v-model="form.description" placeholder="Descrição da reunião" class="w-full" autoresize />
          </UFormField>

          <UFormField label="Participantes internos (opcional)" class="w-full" name="participants" help="Os participantes são mockados localmente para fins de demonstração." :ui="{ help: 'text-xs' }">
            <USelectMenu v-model="form.participants" v-model:search-term="searchTerm" :items="filteredParticipants" multiple clear icon="i-lucide-users-round" class="w-full" open-on-focus placeholder="Selecione os participantes" />
          </UFormField>

          <div class="grid grid-cols-2 gap-4 pt-1">
            <UFormField label="Data" class="w-full" name="startDate" required>
              <UInputDate v-model="modalDateStart" class="w-full">
                <template #trailing>
                  <UPopover>
                    <UButton color="neutral" variant="link" size="sm" icon="i-lucide-calendar" aria-label="Selecionar data" class="px-0" />
                    <template #content>
                      <UCalendar v-model="modalDateStart" class="p-2 w-full" />
                    </template>
                  </UPopover>
                </template>
              </UInputDate>
            </UFormField>

            <UFormField label="Sala / Local" class="w-full" name="room" required>
              <USelect v-model="form.room" :items="roomOptions" class="w-full" icon="i-lucide-building-2" :ui="{ content: 'min-w-fit' }" />
            </UFormField>

            <UFormField label="Hora inicial" class="w-full" name="startTime" required>
              <USelect v-model="form.startTime" :items="timeOptions" class="w-full" icon="i-lucide-clock" @change="syncDefaultEnd" />
            </UFormField>

            <UFormField label="Hora final" class="w-full" name="endTime" required>
              <USelect v-model="form.endTime" :items="timeOptions" class="w-full" icon="i-lucide-clock" />
            </UFormField>
          </div>

          <UFormField label="Cor da etiqueta" name="color" required>
            <div class="flex items-center gap-3">
              <div class="flex gap-2">
                <button v-for="color in colors" :key="color" type="button" class="w-7 h-7 rounded-full border cursor-pointer transition" :style="{ backgroundColor: color }" :class="{ 'ring-2 ring-primary': form.color === color }" @click="form.color = color" />
              </div>

              <USeparator orientation="vertical" class="h-8" />

              <UPopover>
                <UButton type="button" icon="i-lucide-palette" color="neutral" variant="outline" size="sm" aria-label="Escolher cor personalizada" />

                <template #content>
                  <div class="p-3">
                    <UColorPicker v-model="form.color" format="hex" show-alpha="false" />
                  </div>
                </template>
              </UPopover>

              <div class="w-7 h-7 rounded-full border cursor-pointer transition" :style="{ backgroundColor: form.color }" title="Cor selecionada" />
            </div>
          </UFormField>
        </div>

        <div class="mr-3 flex flex-col w-[18rem]">
          <UCalendar v-model="modalDateStart" variant="subtle" size="md" color="primary" />
        </div>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" class="cursor-pointer" @click="() => handleModal('evento', false)" />

        <div class="flex gap-x-2">
          <UButton v-if="isEditMode" size="lg" type="button" label="Excluir" color="error" icon="i-lucide-circle-x" class="cursor-pointer dark:text-gray-100 hover:text-white" @click="handleDelete" />
          <UButton size="lg" data-form-save color="primary" icon="i-hugeicons-add-circle" class="cursor-pointer bg-primary-600! dark:text-gray-100 hover:text-white btn-calendar-plus" :label="isEditMode ? 'Salvar' : 'Reservar'" type="submit" form="form">
            <template #trailing>
              <FormSaveShortcutHint />
            </template>
          </UButton>
        </div>
      </div>
    </template>
  </UModal>
</template>

<script lang="ts" setup>
import participantsMock from '@/utils/mocks/participants';
import { useMeetingsCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import { toCalendarDate } from '@/utils/helpers/shared/date';
import type { MeetingRecord } from '@/utils/types/admin';
import { z } from 'zod';

const { modals, closeModal, getModalData, handleModal } = useModalStore();
const { upsert, remove } = useMeetingsCrud();
const modalDateStart = ref(null as any);
const searchTerm = ref('');

const timeOptions: string[] = [];
for (let hour = 7; hour <= 21; hour += 1) {
  timeOptions.push(`${String(hour).padStart(2, '0')}:00`);
  timeOptions.push(`${String(hour).padStart(2, '0')}:30`);
}

const colors = ['#93c5fd', '#a7f3d0', '#fdba74', '#fca5a5', '#c4b5fd', '#fde68a'];
const roomOptions = ['Sala Principal', 'Sala Criativa', 'Sala de Alinhamento', 'Auditório', 'Videoconferência'];

const requiredText = (field: string) => z.string().trim().min(1, `${field} é obrigatório.`);

const schema = z.object({
  title: requiredText('Título'),
  icon: requiredText('Ícone'),
  startDate: requiredText('Data'),
  startTime: requiredText('Hora inicial'),
  endTime: requiredText('Hora final'),
  room: requiredText('Sala'),
  color: requiredText('Cor'),
});

const form = reactive({
  id: '' as string,
  title: '',
  description: '',
  organizer: 'Administrador',
  startDate: '',
  startTime: '',
  endTime: '',
  room: 'Sala Principal',
  color: '#93c5fd',
  icon: 'i-lucide-calendar-clock',
  participants: [] as string[],
});

const currentModalData = computed(() => getModalData('evento') as { mode?: 'create' | 'edit'; event?: MeetingRecord; defaultDate?: Date } | null);
const isEditMode = computed(() => currentModalData.value?.mode === 'edit');
const modalTitle = computed(() => (isEditMode.value ? 'Editar Reunião' : 'Nova Reunião'));
const modalDescription = computed(() => (isEditMode.value ? 'Atualize os dados da sua reunião abaixo.' : 'Preencha os dados para marcar uma nova reunião.'));

const filteredParticipants = computed(() => {
  const term = searchTerm.value.trim().toLowerCase();
  if (!term) return participantsMock;
  return participantsMock.filter((participant) => participant.label.toLowerCase().includes(term));
});

function roundToNearest30(date: Date) {
  const roundedDate = new Date(date);
  const minutes = roundedDate.getMinutes();
  const rounded = minutes < 15 ? 0 : minutes < 45 ? 30 : 0;

  if (rounded === 0 && minutes >= 45) {
    roundedDate.setHours(roundedDate.getHours() + 1);
  }

  roundedDate.setMinutes(rounded, 0, 0);
  return roundedDate;
}

function syncDefaultEnd() {
  if (!form.startDate || !form.startTime) return;
  const start = new Date(`${form.startDate}T${form.startTime}`);
  const end = new Date(start);
  end.setMinutes(end.getMinutes() + 60);
  form.endTime = end.toTimeString().slice(0, 5);
}

function loadEventData(event: MeetingRecord) {
  form.id = event.id;
  form.title = event.title || '';
  form.description = event.description || '';
  form.organizer = event.organizer || 'Administrador';
  form.startDate = event.startTime.toISOString().split('T')[0];
  form.startTime = event.startTime.toTimeString().slice(0, 5);
  form.endTime = event.endTime.toTimeString().slice(0, 5);
  form.color = event.color || '#93c5fd';
  form.icon = event.icon || 'i-lucide-calendar-clock';
  form.room = event.location || 'Sala Principal';
  form.participants = event.participants || [];
  modalDateStart.value = toCalendarDate(form.startDate);
}

function resetForm(data?: { defaultDate?: Date }) {
  const baseDate = data?.defaultDate ? new Date(data.defaultDate) : new Date();
  const startDate = roundToNearest30(baseDate);
  const endDate = new Date(startDate);
  endDate.setMinutes(endDate.getMinutes() + 60);

  form.id = '';
  form.title = '';
  form.description = '';
  form.organizer = 'Administrador';
  form.startDate = startDate.toISOString().split('T')[0];
  form.startTime = startDate.toTimeString().slice(0, 5);
  form.endTime = endDate.toTimeString().slice(0, 5);
  form.room = 'Sala Principal';
  form.color = '#93c5fd';
  form.icon = 'i-lucide-calendar-clock';
  form.participants = [];
  modalDateStart.value = toCalendarDate(form.startDate);
}

function handleSubmit() {
  const startTime = new Date(`${form.startDate}T${form.startTime}`);
  const endTime = new Date(`${form.startDate}T${form.endTime}`);

  const meeting: MeetingRecord = {
    id: form.id || `meeting-${Date.now()}`,
    title: form.title,
    description: form.description,
    startTime,
    endTime,
    location: form.room,
    organizer: form.organizer || 'Administrador',
    color: form.color,
    avatar: currentModalData.value?.event?.avatar || 'https://i.pravatar.cc/120?img=16',
    icon: form.icon,
    participants: [...form.participants],
    priority: currentModalData.value?.event?.priority || 'medium',
  };

  upsert(meeting);

  showToast({
    message: isEditMode.value ? 'Reunião atualizada com sucesso!' : 'Reunião agendada com sucesso.',
    type: 'success',
  });

  handleModal('evento', false);
}

function handleDelete() {
  if (!form.id) return;

  remove(form.id);
  showToast({
    message: 'Reunião excluída com sucesso!',
    type: 'success',
  });
  handleModal('evento', false);
  resetForm();
}

watch(
  currentModalData,
  (data) => {
    if (!data) {
      resetForm();
      return;
    }

    if (data.mode === 'edit' && data.event) {
      loadEventData(data.event);
      return;
    }

    resetForm(data);
  },
  { immediate: true, deep: true }
);

watch(
  () => modalDateStart.value,
  (newDate) => {
    if (!newDate) return;
    const year = newDate.year;
    const month = String(newDate.month).padStart(2, '0');
    const day = String(newDate.day).padStart(2, '0');
    form.startDate = `${year}-${month}-${day}`;
  }
);
</script>

<style scoped>
button.ring-primary {
  box-shadow: 0 0 0 2px var(--color-primary);
}
</style>
