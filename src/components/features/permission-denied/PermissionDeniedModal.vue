<template>
  <UModal
    v-model:open="modals['acesso-negado'].open"
    :title="`Solicitar Acesso - ${props.permission}`"
    description="Você não possui permissão para acessar este recurso."
    :ui="{
      content: 'max-w-xl',
      body: 'p-6 space-y-6',
    }"
    @update:open="(open: boolean) => handleModal('acesso-negado', open)"
  >
    <template #body>
      <UForm id="permission-request-form" :state="state" :schema="schema" class="flex flex-col gap-5" @submit="requestPermission">
        <div>
          <div>
            <p class="text-sm text-pretty text-muted">Para continuar, você precisa solicitar acesso ao <span class="font-bold">Administrador</span>.</p>
          </div>
        </div>

        <UFormField label="Justificativa (Opcional)" title="justification">
          <UTextarea v-model="state.justification" placeholder="Explique por que você precisa acessar este recurso..." autoresize class="w-full" />
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" class="cursor-pointer" :disabled="loading" @click="closeModal('acesso-negado')" />

        <UButton size="lg" data-form-save label="Solicitar" color="primary" icon="i-lucide-mail-plus" class="cursor-pointer bg-primary-600! dark:text-gray-100 hover:text-white" :loading="loading" type="submit" form="permission-request-form">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import { permissionRequestSchema } from '@/utils/types/schemas/feedback.schema';

const { modals, closeModal, handleModal } = useModalStore();
const loading = ref(false);
const schema = permissionRequestSchema;
const state = reactive({
  justification: '',
});

const props = defineProps<{
  permission: string;
}>();

const requestPermission = async () => {
  loading.value = true;
  await new Promise((resolve) => setTimeout(resolve, 500));
  loading.value = false;
  showToast({
    message: 'Solicitação Enviada! Seu gestor recebeu sua solicitação de acesso!',
    type: 'success',
  });
  closeModal('acesso-negado');
};
</script>
