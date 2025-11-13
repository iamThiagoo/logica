<template>
  <div class="w-full space-y-6 h-full">
    <UPageHeader
      :title="`MyCompany • Template - Changelog v${appVersion}`"
      description="Área criada para que você acompanhe, de forma clara e organizada, toda a evolução do sistema. Cada atualização é registrada seguindo o padrão Semantic Versioning (SemVer)."
      class="mb-1"
      :ui="{
        root: 'pb-4 pt-0',
        title: 'text-xl!',
        description: 'text-sm',
      }"
    >
      <template #description>
        <section class="text-sm">
          <p class="mb-2">Área criada para que você acompanhe, de forma clara e organizada, toda a evolução do sistema. Cada atualização é registrada seguindo o padrão Semantic Versioning (SemVer).</p>

          <p>Abaixo, você pode explorar a linha do tempo completa com todas as versões já lançadas:</p>
        </section>
      </template>
    </UPageHeader>
    <USeparator class="mt-0 mb-4" icon="i-lucide-git-branch" />
    <UChangelogVersions :versions="versions" :ui="{ indicator: '-ms-22! mt-3!' }" :indicator-motion="false">
      <UChangelogVersion
        v-for="(version, index) in versions"
        :key="index"
        v-bind="version"
        class="flex items-start"
        :ui="{
          container: 'w-3xl!',
          indicator: 'sticky top-(--ui-header-height) pt-4 -mt-4 flex flex-col items-start',
        }"
      >
        <template #indicator>
          <UBadge
            :label="
              new Date(version.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })
            "
            variant="soft"
          />
        </template>
        <template #body>
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div v-html="version.html" />
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </div>
</template>

<script setup lang="ts">
import { versions } from '@/utils/constants/contents/changelog-versions';
const appVersion = __APP_VERSION__;
</script>
