<template>
  <UModal v-model:open="modals['novo-link'].open" :ui="{ body: 'p-0' }" :title="editingId ? 'Editar Link' : 'Adicionar Link para Atalho'">
    <template #body>
      <UForm id="quick-link-form" :state="form" :schema="schema" class="flex flex-col gap-5" @submit="submitForm">
        <UFormField label="Título (Opcional)" name="title">
          <UInput v-model="form.title" placeholder="Informe um Título" class="w-full" size="lg" />
        </UFormField>

        <UFormField label="URL" name="url" required>
          <UFieldGroup class="w-full">
            <UBadge color="neutral" variant="outline" size="lg" label="https://" />
            <UInput v-model="form.url" size="lg" class="w-full" placeholder="www.example.com" />
          </UFieldGroup>
        </UFormField>
      </UForm>
    </template>

    <template #footer>
      <div class="flex justify-between w-full">
        <UButton size="lg" color="neutral" variant="link" label="Fechar" icon="i-lucide-chevron-left" :disabled="isSubmitting" @click="closeModal('novo-link')" />

        <UButton size="lg" data-form-save color="primary" :label="editingId ? 'Salvar' : 'Adicionar'" icon="i-lucide-link" :loading="isSubmitting" class="dark:text-white bg-primary-600" type="submit" form="quick-link-form">
          <template #trailing>
            <FormSaveShortcutHint />
          </template>
        </UButton>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { useQuickLinksStore } from '@/composables/use-quick-links';
import { useModalStore } from '@/composables/use-modal';
import { showToast } from '@/utils/helpers/app/toast';
import { quickLinkSchema } from '@/utils/types/schemas/widgets.schema';

const { modals, closeModal } = useModalStore();
const { addLink, updateLink } = useQuickLinksStore();

const isSubmitting = ref(false);
const editingId = ref<string | null>(null);
const schema = quickLinkSchema;

const form = ref({
  title: '',
  url: '',
  createdAt: '',
});

async function submitForm() {
  isSubmitting.value = true;
  const normalizedUrl = /^https?:\/\//i.test(form.value.url) ? form.value.url : `https://${form.value.url}`;

  try {
    if (editingId.value) {
      updateLink({
        id: editingId.value,
        title: form.value.title || normalizedUrl,
        url: normalizedUrl,
        createdAt: form.value.createdAt,
      });

      closeModal('novo-link');
      return;
    }

    addLink({
      id: crypto.randomUUID(),
      title: form.value.title || normalizedUrl,
      url: normalizedUrl,
      createdAt: new Date().toISOString(),
    });

    closeModal('novo-link');
  } finally {
    isSubmitting.value = false;
  }
}

watch(
  () => modals['novo-link'].open,
  (isOpen) => {
    if (!isOpen) return;

    const props = modals['novo-link'].props;
    if (props?.link) {
      editingId.value = props.link.id;
      form.value.title = props.link.title;
      form.value.url = props.link.url;
      form.value.createdAt = props.link.createdAt;
    } else {
      editingId.value = null;
      form.value.title = '';
      form.value.url = '';
      form.value.createdAt = '';
    }
  },
  { immediate: true }
);
</script>
