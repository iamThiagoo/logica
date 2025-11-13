<template>
  <UModal
    v-model:open="modals['novo-usuario'].open"
    :title="isEditMode ? 'Editar Usuário' : 'Novo Usuário'"
    :description="isEditMode ? 'Atualize o perfil do usuário.' : 'Cadastre um novo usuário para acesso ao dashboard.'"
    :ui="{
      content: 'max-w-2xl',
      body: 'p-6 space-y-6',
    }"
    @update:open="(open: boolean) => handleModal('novo-usuario', open)"
  >
    <template #body>
      <UForm id="user-form" :state="state" :schema="schema" class="grid grid-cols-2 gap-4" @submit="onSubmit">
        <UFormField label="Nome completo" name="name" class="col-span-2" required>
          <UInput v-model="state.name" size="lg" class="w-full" icon="i-lucide-user-round" placeholder="Nome do usuário" />
        </UFormField>

        <UFormField label="Cargo" name="role" required>
          <UInput v-model="state.role" size="lg" class="w-full" icon="i-lucide-briefcase-business" placeholder="Ex.: Analista, Gestor, Coordenador" />
        </UFormField>

        <UFormField label="Departamento" name="department" required>
          <UInput v-model="state.department" size="lg" class="w-full" icon="i-lucide-building" placeholder="Departamento do usuário" />
        </UFormField>

        <UFormField label="E-mail" name="email" required>
          <UInput v-model="state.email" size="lg" class="w-full" icon="i-lucide-mail" placeholder="usuario@mycompany.local" />
        </UFormField>

        <UFormField label="Telefone" name="phone" required>
          <UInput v-model="state.phone" size="lg" class="w-full" icon="i-lucide-phone" placeholder="(00) 00000-0000" />
        </UFormField>

        <UFormField label="Status" name="status" required>
          <USelect v-model="state.status" size="lg" :items="statusOptions" icon="i-lucide-badge-check" class="w-full" />
        </UFormField>

        <UFormField label="Nível de acesso" name="accessLevel" required>
          <USelect v-model="state.accessLevel" size="lg" :items="accessOptions" icon="i-lucide-shield-check" class="w-full" />
        </UFormField>

        <UFormField label="Último acesso" name="lastLogin" class="col-span-2" required>
          <UInput v-model="state.lastLogin" size="lg" class="w-full" icon="i-lucide-clock-3" placeholder="2026-03-29 08:20" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" @click="closeModal('novo-usuario')" />
        <UButton data-form-save :label="isEditMode ? 'Salvar' : 'Cadastrar'" color="primary" size="lg" icon="i-hugeicons-add-circle" class="cursor-pointer bg-primary-600! dark:text-gray-100 hover:text-white" type="submit" form="user-form">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useUsersCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import type { UserRecord } from '@/utils/types/admin';
import { z } from 'zod';

const { modals, closeModal, handleModal, getModalData } = useModalStore();
const { upsert } = useUsersCrud();

const statusOptions = ['Ativo', 'Convidado', 'Inativo'];
const accessOptions = ['Administrador', 'Editor', 'Leitor'];

const schema = z.object({
  name: z.string().trim().min(1, 'Nome é obrigatório.'),
  role: z.string().trim().min(1, 'Cargo é obrigatório.'),
  department: z.string().trim().min(1, 'Departamento é obrigatório.'),
  email: z.string().email('Informe um e-mail válido.'),
  phone: z.string().trim().min(1, 'Telefone é obrigatório.'),
  status: z.string().trim().min(1, 'Status é obrigatório.'),
  accessLevel: z.string().trim().min(1, 'Nível de acesso é obrigatório.'),
  lastLogin: z.string().trim().min(1, 'Último acesso é obrigatório.'),
});

const state = reactive({
  id: '',
  name: '',
  role: '',
  department: '',
  email: '',
  phone: '',
  status: 'Ativo',
  accessLevel: 'Editor',
  lastLogin: '',
});

const currentModalData = computed(() => getModalData('novo-usuario') as { item?: UserRecord } | null);
const isEditMode = computed(() => Boolean(currentModalData.value?.item?.id));

const resetState = () => {
  state.id = '';
  state.name = '';
  state.role = '';
  state.department = '';
  state.email = '';
  state.phone = '';
  state.status = 'Ativo';
  state.accessLevel = 'Editor';
  state.lastLogin = `${new Date().toISOString().slice(0, 10)} 09:00`;
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
    state.role = data.item.role;
    state.department = data.item.department;
    state.email = data.item.email;
    state.phone = data.item.phone;
    state.status = data.item.status;
    state.accessLevel = data.item.accessLevel;
    state.lastLogin = data.item.lastLogin;
  },
  { immediate: true }
);

const onSubmit = async () => {
  const record: UserRecord = {
    id: state.id || `user-${Date.now()}`,
    name: state.name,
    role: state.role,
    department: state.department,
    email: state.email,
    phone: state.phone,
    status: state.status as UserRecord['status'],
    accessLevel: state.accessLevel,
    lastLogin: state.lastLogin,
    createdAt: currentModalData.value?.item?.createdAt || new Date().toISOString().slice(0, 10),
  };

  upsert(record);

  showToast({
    title: isEditMode.value ? 'Usuário atualizado' : 'Usuário cadastrado',
    message: isEditMode.value ? 'As permissões e dados do usuário foram atualizados.' : 'O novo usuário já pode ser gerenciado no módulo.',
    type: 'success',
  });

  closeModal('novo-usuario');
};
</script>
