<template>
  <UModal
    v-model:open="modals['novo-cliente'].open"
    :title="isEditMode ? 'Editar Cliente' : 'Novo Cliente'"
    :description="isEditMode ? 'Atualize as informações do cliente.' : 'Preencha os dados abaixo para cadastrar um novo cliente.'"
    :ui="{
      content: 'max-w-2xl',
      body: 'p-6 space-y-6',
    }"
    @update:open="(open: boolean) => handleModal('novo-cliente', open)"
  >
    <template #body>
      <UForm id="client-form" :state="state" :schema="schema" class="grid grid-cols-2 gap-4" @submit="onSubmit">
        <UFormField label="Nome do contato" name="name" class="col-span-2" required>
          <UInput v-model="state.name" size="lg" class="w-full" icon="i-lucide-user-round" placeholder="Informe o nome principal do contato" />
        </UFormField>

        <UFormField label="Empresa" name="company" required>
          <UInput v-model="state.company" size="lg" class="w-full" icon="i-lucide-building-2" placeholder="Nome da empresa" />
        </UFormField>

        <UFormField label="Segmento" name="segment" required>
          <UInput v-model="state.segment" size="lg" class="w-full" icon="i-lucide-briefcase-business" placeholder="Ex.: Varejo, Saude, Tecnologia" />
        </UFormField>

        <UFormField label="E-mail" name="email" required>
          <UInput v-model="state.email" size="lg" class="w-full" icon="i-lucide-mail" placeholder="contato@empresa.com" />
        </UFormField>

        <UFormField label="Telefone" name="phone" required>
          <UInput v-model="state.phone" size="lg" class="w-full" icon="i-lucide-phone" placeholder="(00) 00000-0000" />
        </UFormField>

        <UFormField label="Cidade" name="city" required>
          <UInput v-model="state.city" size="lg" class="w-full" icon="i-lucide-map-pinned" placeholder="Cidade, UF" />
        </UFormField>

        <UFormField label="Status" name="status" required>
          <USelect v-model="state.status" size="lg" :items="statusOptions" icon="i-lucide-badge-check" class="w-full" />
        </UFormField>

        <UFormField label="Ultimo contato" name="lastContact" required>
          <UInput v-model="state.lastContact" size="lg" type="date" class="w-full" icon="i-lucide-calendar-days" />
        </UFormField>

        <UFormField label="Observações" name="notes" class="col-span-2">
          <UTextarea v-model="state.notes" class="w-full" autoresize :rows="4" placeholder="Anote contexto comercial, proximos passos ou pontos importantes." />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" @click="closeModal('novo-cliente')" />
        <UButton data-form-save :label="isEditMode ? 'Salvar' : 'Cadastrar'" color="primary" size="lg" icon="i-hugeicons-add-circle" class="cursor-pointer bg-primary-600! dark:text-gray-100 hover:text-white" type="submit" form="client-form">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useClientsCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import type { ClientRecord } from '@/utils/types/admin';
import { z } from 'zod';

const { modals, closeModal, handleModal, getModalData } = useModalStore();
const { items: clients, upsert } = useClientsCrud();

const statusOptions = ['Ativo', 'Em onboarding', 'Inativo'];

const requiredText = (field: string) => z.string().trim().min(1, `${field} é obrigatório.`);

const schema = z.object({
  name: requiredText('Nome do contato'),
  company: requiredText('Empresa'),
  segment: requiredText('Segmento'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: requiredText('Telefone'),
  city: requiredText('Cidade'),
  status: requiredText('Status'),
  lastContact: requiredText('Último contato'),
  notes: z.string().optional(),
});

const state = reactive({
  id: '',
  code: '',
  name: '',
  company: '',
  segment: '',
  email: '',
  phone: '',
  city: '',
  status: 'Ativo',
  lastContact: new Date().toISOString().slice(0, 10),
  notes: '',
});

const currentModalData = computed(() => getModalData('novo-cliente') as { item?: ClientRecord } | null);
const isEditMode = computed(() => Boolean(currentModalData.value?.item?.id));

const nextCode = () => {
  const codes = clients.value.map((item) => Number(item.code.replace('CLI-', ''))).filter((value) => !Number.isNaN(value));
  const next = Math.max(0, ...codes) + 1;
  return `CLI-${String(next).padStart(3, '0')}`;
};

const resetState = () => {
  state.id = '';
  state.code = '';
  state.name = '';
  state.company = '';
  state.segment = '';
  state.email = '';
  state.phone = '';
  state.city = '';
  state.status = 'Ativo';
  state.lastContact = new Date().toISOString().slice(0, 10);
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
    state.code = data.item.code;
    state.name = data.item.name;
    state.company = data.item.company;
    state.segment = data.item.segment;
    state.email = data.item.email;
    state.phone = data.item.phone;
    state.city = data.item.city;
    state.status = data.item.status;
    state.lastContact = data.item.lastContact;
    state.notes = data.item.notes;
  },
  { immediate: true }
);

const onSubmit = async () => {
  const record: ClientRecord = {
    id: state.id || `client-${Date.now()}`,
    code: state.code || nextCode(),
    name: state.name,
    company: state.company,
    segment: state.segment,
    email: state.email,
    phone: state.phone,
    city: state.city,
    status: state.status as ClientRecord['status'],
    lastContact: state.lastContact,
    createdAt: currentModalData.value?.item?.createdAt || new Date().toISOString().slice(0, 10),
    notes: state.notes,
  };

  upsert(record);

  showToast({
    title: isEditMode.value ? 'Cliente atualizado' : 'Cliente cadastrado',
    message: isEditMode.value ? 'As informações foram salvas com sucesso.' : 'O novo cliente já está disponível na listagem.',
    type: 'success',
  });

  closeModal('novo-cliente');
};
</script>
