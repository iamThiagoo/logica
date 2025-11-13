<template>
  <UModal
    v-model:open="modals['novo-lead'].open"
    :title="isEditMode ? 'Editar Lead' : 'Novo Lead'"
    :description="isEditMode ? 'Atualize o lead selecionado.' : 'Cadastre um novo lead para acompanhar o funil comercial.'"
    :ui="{
      content: 'max-w-2xl',
      body: 'p-6 space-y-6',
    }"
    @update:open="(open: boolean) => handleModal('novo-lead', open)"
  >
    <template #body>
      <UForm id="lead-form" :state="state" :schema="schema" class="grid grid-cols-2 gap-4" @submit="onSubmit">
        <UFormField label="Nome do lead" name="name" class="col-span-2" required>
          <UInput v-model="state.name" size="lg" class="w-full" icon="i-lucide-user-round-plus" placeholder="Nome principal do lead" />
        </UFormField>

        <UFormField label="Empresa" name="company" required>
          <UInput v-model="state.company" size="lg" class="w-full" icon="i-lucide-building-2" placeholder="Empresa ou conta" />
        </UFormField>

        <UFormField label="Origem" name="source" required>
          <UInput v-model="state.source" size="lg" class="w-full" icon="i-lucide-radar" placeholder="Site, campanha, evento..." />
        </UFormField>

        <UFormField label="E-mail" name="email" required>
          <UInput v-model="state.email" size="lg" class="w-full" icon="i-lucide-mail" placeholder="lead@empresa.com" />
        </UFormField>

        <UFormField label="Telefone" name="phone" required>
          <UInput v-model="state.phone" size="lg" class="w-full" icon="i-lucide-phone" placeholder="(00) 00000-0000" />
        </UFormField>

        <UFormField label="Responsável" name="owner" required>
          <UInput v-model="state.owner" size="lg" class="w-full" icon="i-lucide-user-check" placeholder="Responsável pelo follow-up" />
        </UFormField>

        <UFormField label="Etapa" name="stage" required>
          <USelect v-model="state.stage" size="lg" :items="stageOptions" icon="i-lucide-target" class="w-full" />
        </UFormField>

        <UFormField label="Score" name="score" required>
          <UInput v-model.number="state.score" size="lg" type="number" min="0" max="100" class="w-full" icon="i-lucide-gauge" placeholder="0 a 100" />
        </UFormField>

        <UFormField label="Valor esperado (R$)" name="expectedValue" required>
          <UInput v-model.number="state.expectedValue" size="lg" type="number" min="0" class="w-full" icon="i-lucide-badge-dollar-sign" placeholder="Valor estimado da oportunidade" />
        </UFormField>

        <UFormField label="Última interação" name="lastInteraction" required>
          <UInput v-model="state.lastInteraction" size="lg" type="date" class="w-full" icon="i-lucide-calendar-days" />
        </UFormField>

        <UFormField label="Observações" name="notes" class="col-span-2">
          <UTextarea v-model="state.notes" class="w-full" autoresize :rows="4" placeholder="Registre objeções, contexto do lead e próximos passos." />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" @click="closeModal('novo-lead')" />
        <UButton data-form-save :label="isEditMode ? 'Salvar' : 'Cadastrar'" color="primary" size="lg" icon="i-hugeicons-add-circle" class="cursor-pointer bg-primary-600! dark:text-gray-100 hover:text-white" type="submit" form="lead-form">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useLeadsCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import type { LeadRecord } from '@/utils/types/admin';
import { z } from 'zod';

const { modals, closeModal, handleModal, getModalData } = useModalStore();
const { upsert } = useLeadsCrud();

const stageOptions = ['Novo', 'Qualificado', 'Proposta', 'Convertido'];

const schema = z.object({
  name: z.string().trim().min(1, 'Nome do lead é obrigatório.'),
  company: z.string().trim().min(1, 'Empresa é obrigatória.'),
  source: z.string().trim().min(1, 'Origem é obrigatória.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().trim().min(1, 'Telefone é obrigatório.'),
  owner: z.string().trim().min(1, 'Responsável é obrigatório.'),
  stage: z.string().trim().min(1, 'Etapa é obrigatória.'),
  score: z.number().min(0, 'Score inválido.').max(100, 'Score máximo é 100.'),
  expectedValue: z.number().min(0, 'Valor esperado é obrigatório.'),
  lastInteraction: z.string().trim().min(1, 'Última interação é obrigatória.'),
  notes: z.string().optional(),
});

const state = reactive({
  id: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  source: '',
  stage: 'Novo',
  owner: '',
  score: 50,
  expectedValue: 0,
  lastInteraction: new Date().toISOString().slice(0, 10),
  notes: '',
});

const currentModalData = computed(() => getModalData('novo-lead') as { item?: LeadRecord } | null);
const isEditMode = computed(() => Boolean(currentModalData.value?.item?.id));

const resetState = () => {
  state.id = '';
  state.name = '';
  state.company = '';
  state.email = '';
  state.phone = '';
  state.source = '';
  state.stage = 'Novo';
  state.owner = '';
  state.score = 50;
  state.expectedValue = 0;
  state.lastInteraction = new Date().toISOString().slice(0, 10);
  state.notes = '';
};

watch(
  currentModalData,
  (data) => {
    if (!data?.item) {
      resetState();
      return;
    }

    state.id = data.item.id;
    state.name = data.item.name;
    state.company = data.item.company;
    state.email = data.item.email;
    state.phone = data.item.phone;
    state.source = data.item.source;
    state.stage = data.item.stage;
    state.owner = data.item.owner;
    state.score = data.item.score;
    state.expectedValue = data.item.expectedValue;
    state.lastInteraction = data.item.lastInteraction;
    state.notes = data.item.notes;
  },
  { immediate: true }
);

const onSubmit = async () => {
  const record: LeadRecord = {
    id: state.id || `lead-${Date.now()}`,
    name: state.name,
    company: state.company,
    email: state.email,
    phone: state.phone,
    source: state.source,
    stage: state.stage as LeadRecord['stage'],
    owner: state.owner,
    score: state.score,
    expectedValue: state.expectedValue,
    createdAt: currentModalData.value?.item?.createdAt || new Date().toISOString().slice(0, 10),
    lastInteraction: state.lastInteraction,
    notes: state.notes,
  };

  upsert(record);

  showToast({
    title: isEditMode.value ? 'Lead atualizado' : 'Lead cadastrado',
    message: isEditMode.value ? 'O lead foi atualizado com sucesso.' : 'O lead já está disponível para acompanhamento.',
    type: 'success',
  });

  closeModal('novo-lead');
};
</script>
