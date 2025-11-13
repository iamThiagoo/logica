<template>
  <p class="text-sm text-pretty text-muted">Copie o token de acesso para autenticar suas requisições na API's.</p>
  <div class="space-y-4 flex flex-col">
    <UFormField>
      <UTextarea v-model="token" autoresize readonly class="w-full text-xs" />
    </UFormField>

    <UButton color="primary" icon="i-lucide-copy" class="btn-scale flex justify-center items-center gap-x-2 w-full py-2 dark:text-gray-100" @click="copyToken"> Copiar Token </UButton>
  </div>
</template>

<script setup lang="ts">
const toast = useToast();
const token = ref('');

onMounted(() => {
  token.value = localStorage.getItem('token') || '';
});

async function copyToken() {
  if (!token.value) return;
  await navigator.clipboard.writeText(token.value);

  toast.add({
    title: 'Tudo certo!',
    description: 'Token copiado para a área de transferência.',
    icon: 'i-lucide-check',
    color: 'success',
  });
}
</script>
