<template>
  <UModal
    v-model:open="modals['novo-drive'].open"
    :title="isEditMode ? 'Editar Arquivo' : 'Novo Upload'"
    :description="isEditMode ? 'Atualize os dados do arquivo compartilhado.' : 'Cadastre um novo arquivo para o drive compartilhado.'"
    :ui="{
      content: 'max-w-xl',
      body: 'p-6 space-y-6',
    }"
    @update:open="(open: boolean) => handleModal('novo-drive', open)"
  >
    <template #body>
      <UForm id="drive-form" :state="state" :schema="schema" class="flex flex-col gap-6" @submit="onSubmit">
        <div class="flex gap-4">
          <UFormField label="Identificação do arquivo" name="name" class="flex-1" required>
            <UInput v-model="state.name" class="w-full" size="lg" icon="i-lucide-tag" placeholder="Informe um título para o arquivo" />
          </UFormField>

          <UFormField label="Expiração (dias)" name="expiresInDays" required>
            <USelect v-model="state.expiresInDays" :items="days" size="lg" :ui="{ content: 'min-w-fit' }" icon="i-lucide-hourglass" />
          </UFormField>
        </div>

        <UFormField label="Arquivo (opcional)" name="upload">
          <UFileUpload v-model="state.upload" color="neutral" layout="list" position="outside" accept="*" label="Arraste e solte ou selecione um arquivo" description="Como este módulo é mockado, o arquivo é usado apenas para preencher nome, tipo e tamanho." class="rounded-md min-h-24" />
        </UFormField>

        <UFormField label="Forma de envio" name="deliveryMode" required>
          <URadioGroup v-model="state.deliveryMode" :items="deliveryOptions" color="primary" indicator="hidden" variant="table" size="md" />
        </UFormField>

        <UFormField label="E-mails dos destinatários" name="recipients" required>
          <UInputTags v-model="state.recipients" color="primary" class="w-full" size="lg" icon="i-lucide-users-round" placeholder="Informe o e-mail e pressione Enter para adicionar" />
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" @click="closeModal('novo-drive')" />
        <UButton data-form-save :label="isEditMode ? 'Salvar Alterações' : 'Salvar Upload'" color="primary" size="lg" icon="i-lucide-mail-plus" class="cursor-pointer bg-primary-600! dark:text-gray-100 hover:text-white" type="submit" form="drive-form">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useDriveCrud } from '@/composables/use-admin-template-data';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import type { DriveFileRecord } from '@/utils/types/admin';
import type { RadioGroupItem } from '@nuxt/ui';
import { z } from 'zod';

const { modals, closeModal, handleModal, getModalData } = useModalStore();
const { upsert } = useDriveCrud();

const days = ref(Array.from({ length: 30 }, (_, i) => `${i + 1}`));

const schema = z.object({
  name: z.string().trim().min(1, 'Identificação do arquivo é obrigatória.'),
  expiresInDays: z.string().trim().min(1, 'Prazo é obrigatório.'),
  recipients: z.array(z.string().trim().min(1)).min(1, 'Informe ao menos um destinatário.'),
  deliveryMode: z.string().trim().min(1, 'Forma de envio é obrigatória.'),
});

const state = reactive({
  id: '',
  name: '',
  expiresInDays: '10',
  upload: null as File | null,
  deliveryMode: 'automatico',
  recipients: [] as string[],
});

const deliveryOptions = ref<RadioGroupItem[]>([
  {
    value: 'automatico',
    label: 'Enviar automaticamente para os destinatários.',
  },
  {
    value: 'somente-link',
    label: 'Gerar apenas o link para compartilhamento manual.',
    description: 'Útil para aprovações internas ou distribuição posterior.',
  },
]);

const currentModalData = computed(() => getModalData('novo-drive') as { item?: DriveFileRecord } | null);
const isEditMode = computed(() => Boolean(currentModalData.value?.item?.id));

const resetState = () => {
  state.id = '';
  state.name = '';
  state.expiresInDays = '10';
  state.upload = null;
  state.deliveryMode = 'automatico';
  state.recipients = [];
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
    state.expiresInDays = String(data.item.expiresInDays || 10);
    state.upload = null;
    state.deliveryMode = data.item.deliveryMode;
    state.recipients = [...data.item.recipients];
  },
  { immediate: true }
);

const formatSize = (file: File | null, fallback = '1,0 MB') => {
  if (!file) return fallback;

  const inMb = file.size / (1024 * 1024);
  if (inMb >= 1) return `${inMb.toFixed(1).replace('.', ',')} MB`;
  return `${Math.max(1, Math.round(file.size / 1024))} KB`;
};

const inferStatus = (daysLeft: number): DriveFileRecord['status'] => {
  if (daysLeft <= 0) return 'Arquivado';
  if (daysLeft <= 1) return 'Expira hoje';
  return 'Disponível';
};

const onSubmit = async () => {
  const extension = state.upload?.name.split('.').pop()?.toLowerCase() || currentModalData.value?.item?.extension || 'pdf';
  const expiresInDays = Number(state.expiresInDays);

  const record: DriveFileRecord = {
    id: state.id || `drive-${Date.now()}`,
    name: state.name,
    extension,
    size: formatSize(state.upload, currentModalData.value?.item?.size),
    uploadedBy: currentModalData.value?.item?.uploadedBy || 'Administrador',
    uploadedAt: new Date().toISOString().slice(0, 10),
    expiresInDays,
    status: inferStatus(expiresInDays),
    recipients: [...state.recipients],
    deliveryMode: state.deliveryMode,
  };

  upsert(record);

  showToast({
    title: isEditMode.value ? 'Arquivo atualizado' : 'Upload salvo',
    message: isEditMode.value ? 'Os dados do arquivo foram atualizados com sucesso.' : 'O arquivo já está disponível no drive compartilhado.',
    type: 'success',
  });

  closeModal('novo-drive');
};
</script>
