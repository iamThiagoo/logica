<template>
  <section class="mt-5 mb-8">
    <UCard :ui="{ body: 'p-4 sm:p-5' }" variant="soft" class="border border-default">
      <div class="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 class="flex items-center gap-2 text-lg font-semibold text-highlighted">Agenda de Reuniões</h3>
        </div>

        <div class="flex items-center gap-2">
          <UButton to="/agenda-reunioes" color="neutral" variant="ghost" label="Agenda Completa" class="btn-scale rounded-lg">
            <template #leading>
              <lord-icon trigger="hover" target=".btn-calendar" :colors="`primary:${lordIconColor}`" src="/lord-icon/calendar.json" class="h-5 w-5" />
            </template>
          </UButton>

          <UButton color="neutral" variant="outline" label="Adicionar Reserva" class="cursor-pointer btn-calendar btn-add-link rounded-lg bg-elevated/50 hover:bg-elevated/80 hover:ring-accented relative select-none rounded-l-lg transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)]" @click="() => openModal('evento')">
            <template #leading>
              <lord-icon trigger="hover" target=".btn-calendar" :colors="`primary:${lordIconColor}`" src="/lord-icon/plus.json" class="h-4 w-5" />
            </template>
          </UButton>
        </div>
      </div>

      <div v-if="reunioes.length > 0" class="grid grid-cols-2 lg:flex lg:flex-row lg:flex-wrap items-stretch gap-4 mt-5">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-4">
          <UTooltip text="Abrir Detalhes da Reunião">
            <UCard
              v-for="(reuniao, index) in reunioes"
              :key="index"
              :ui="{
                header: 'pt-0! px-0!',
                footer: 'py-2! px-4!',
              }"
              class="group bg-elevated/50 hover:bg-elevated/80 hover:ring-accented border border-default hover:border-primary/40 hover:shadow-sm relative select-none shadow-sm transition-all duration-300 ease-[cubic-bezier(.22,.61,.36,1)] cursor-pointer w-full lg:w-80 btn-scale transform hover:-translate-y-0.5"
            >
              <template #header>
                <div class="flex items-center gap-3 border-t-3 border-t-green-200 px-3! pt-3 rounded-lg">
                  <UBadge class="inline-flex items-center p-2 rounded-full" color="success" variant="soft">
                    <UIcon name="i-lucide-calendar-clock" class="size-4" color="success" />
                  </UBadge>

                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-gray-700 dark:text-gray-200">
                      {{ reuniao.titulo }}
                    </span>
                    <span class="text-xs text-muted mt-0.5"> {{ reuniao.horario }} — {{ reuniao.local }} </span>
                  </div>
                </div>
              </template>

              <template #footer>
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <UAvatar size="xs" :alt="reuniao.autor" :src="reuniao.avatar" icon="i-lucide-user-round" />
                    <span class="text-xs text-muted">
                      Reservado por
                      <strong class="font-medium text-gray-600 dark:text-gray-300">
                        {{ reuniao.autor }}
                      </strong>
                      <template v-if="reuniao.participantes > 1">
                        com +{{ reuniao.participantes - 1 }}
                        {{ reuniao.participantes - 1 < 2 ? 'participante' : 'participantes' }}
                      </template>
                    </span>
                  </div>
                </div>
              </template>
            </UCard>
          </UTooltip>
        </div>
      </div>

      <div v-else class="flex min-h-36 cursor-pointer hover:bg-elevated/60 btn-scale flex-col items-center justify-center rounded-xl border border-dashed border-default bg-elevated/40 p-6 text-center" @click="() => openModal('evento')">
        <UIcon name="i-lucide-calendar-x" class="mb-2 size-7 text-muted" />
        <p class="text-sm font-medium text-highlighted">Nenhuma reunião agendada por enquanto.</p>
        <p class="mt-1 text-xs text-muted">Clique aqui para criar uma nova reunião.</p>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import { useModalStore } from '@/composables/use-modal';
const { openModal } = useModalStore();
const reunioes = ref([
  {
    titulo: 'Daily de Status',
    horario: '10:00 AM - 11:00 AM',
    autor: 'Thiago',
    local: 'Sala 1',
    color: '#22C55E',
    participantes: 6,
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256',
  },
  {
    titulo: 'Revisão de Código',
    horario: '11:30 AM - 12:30 PM',
    autor: 'Maria',
    local: 'Sala 2',
    color: '#3B82F6',
    participantes: 2,
    avatar: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=256',
  },
]);

const colorMode = useColorMode();

const lordIconColor = computed(() => (colorMode.value === 'dark' ? '#fff' : '#1e293b'));
</script>
