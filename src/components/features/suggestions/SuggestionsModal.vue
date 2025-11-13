<template>
  <UModal
    v-model:open="modals['sugestoes-feedback'].open"
    title="Sugestões & Feedback"
    description="Espaço feito para sugestões de ideias para desenvolvimento e feedback sobre como podemos melhorar."
    :ui="{
      content: 'max-w-3xl',
      body: 'max-h-[65dvh]',
    }"
    @update:open="(open: boolean) => handleModal('sugestoes-feedback', open)"
  >
    <template #body>
      <UForm id="suggestions-form" :state="state" :schema="schema" class="space-y-6 flex flex-col" @submit="onSubmit">
        <UFormField name="message">
          <Editor ref="editorRef" v-model="state.message" placeholder="Escreva sua sugestão ou feedback..." :include-image-upload="true" :include-ai-tools="true" min-height="36" />
        </UFormField>

        <USwitch
          v-model="state.includeName"
          name="includeName"
          :ui="{
            base: 'rounded-full cursor-pointer btn-scale',
            label: 'cursor-pointer btn-scale',
          }"
          unchecked-icon="i-lucide-x"
          checked-icon="i-lucide-check"
          label="Atrelar meu nome"
          description="Ao ativar, seu nome será enviado junto para possível retorno."
        />
      </UForm>
    </template>
    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" class="cursor-pointer" @click="() => handleModal('sugestoes-feedback', false)" />
        <UButton size="lg" data-form-save type="submit" form="suggestions-form" color="primary" icon="i-lucide-mail-plus" class="dark:text-gray-100 bg-primary-600" label="Enviar">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import Editor from '@/components/shared/editor/Editor.vue';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import { suggestionSchema } from '@/utils/types/schemas/feedback.schema';
import { z } from 'zod';
const { modals, handleModal } = useModalStore();
const editorRef = useTemplateRef('editorRef');
const state = reactive({
  message: '',
  includeName: false,
});

const schema = suggestionSchema.extend({
  includeName: z.boolean().optional(),
});

const onSubmit = () => {
  showToast({
    title: 'Mensagem enviada',
    message: 'Seu feedback foi registrado com sucesso.',
    type: 'success',
  });
  state.message = '';
  state.includeName = false;
  handleModal('sugestoes-feedback', false);
};
</script>
