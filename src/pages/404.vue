<template>
  <section class="relative h-screen flex justify-center items-center overflow-hidden px-6 py-12 bg-[#f5f0ea] text-slate-900 dark:bg-[#0b0f12] dark:text-white">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute -top-20 -left-16 h-72 w-72 rounded-full bg-amber-300/50 blur-3xl" />
      <div class="absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-sky-300/40 blur-3xl" />
      <div class="absolute inset-0 opacity-40 dark:opacity-25 bg-[radial-gradient(circle_at_top,_rgba(15,23,42,0.06),_transparent_55%)]" />
    </div>

    <div class="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-10 lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <div class="space-y-6">
        <div class="flex items-center gap-3">
          <img :src="logo" alt="MyCompany" class="h-9 w-auto contrast-0 saturate-200 dark:contrast-100 dark:saturate-100" />
          <span class="rounded-full border border-slate-300/70 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 dark:border-white/10 dark:bg-white/10 dark:text-slate-200">Erro 404</span>
        </div>

        <div>
          <h1 class="text-4xl font-semibold tracking-tight sm:text-5xl">Essa rota saiu do mapa.</h1>
          <p class="mt-3 text-base text-slate-600 dark:text-slate-300">
            O caminho
            <span class="rounded-md bg-black/5 px-2 py-0.5 font-mono text-sm dark:bg-white/10">{{ route.fullPath }}</span>
            não existe, foi movido ou você não tem permissão para acessá-lo.
          </p>
        </div>

        <div class="flex flex-wrap gap-3">
          <button class="flex items-center btn-scale gap-2 rounded-xl border border-slate-300/70 bg-white/80 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/20" @click="() => router.back()">
            <Undo2 class="size-5" />
            Voltar à página anterior
          </button>
          <router-link to="/" class="flex items-center btn-scale gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-primary-500 dark:hover:bg-primary-400">
            <House class="size-5" />
            Ir para o Dashboard
          </router-link>
          <a href="/" target="_blank" rel="noopener noreferrer" class="flex items-center btn-scale gap-2 rounded-xl border border-transparent pl-0.5 py-2.5 text-sm font-medium text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
            <UIcon name="i-lucide-square-arrow-out-up-right" class="size-5" />
            Reportar com a TI sobre esse problema
          </a>
        </div>

        <p class="text-sm text-slate-500 dark:text-slate-400">Se você acredita que esse link deveria existir, avise a equipe de TI.</p>
      </div>

      <div class="relative">
        <div class="absolute -inset-6 rounded-[28px] border border-white/70 bg-white/70 shadow-2xl shadow-amber-200/40 backdrop-blur dark:border-white/10 dark:bg-white/5 dark:shadow-sky-500/20" />
        <div class="relative overflow-hidden rounded-[24px] border border-slate-200/60 bg-white/90 p-6 shadow-lg dark:border-white/10 dark:bg-slate-950/70">
          <div class="flex items-center justify-end">
            <span class="text-xs text-slate-400 dark:text-slate-500">Status: Perdido(a)</span>
          </div>

          <div class="mt-6 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <div class="text-[72px] font-black leading-none text-slate-900/90 dark:text-white">404</div>
              <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">Mas fique tranquilo(a), o dashboard está sempre disponível!</p>
            </div>
            <img :src="gif" alt="Ilustração 404" class="h-40 w-40 rounded-2xl object-cover shadow-lg shadow-slate-900/10" />
          </div>

          <div class="mt-6 grid grid-cols-3 gap-3 text-center text-xs text-slate-500 dark:text-slate-400">
            <div class="rounded-lg bg-black/5 py-2 dark:bg-white/5">-</div>
            <div class="rounded-lg bg-black/5 py-2 dark:bg-white/5">-</div>
            <div class="rounded-lg bg-black/5 py-2 dark:bg-white/5">-</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { House, Undo2 } from 'lucide-vue-next';
import gif from '@/assets/images/404.gif';
import logo from '@/assets/svg/logo.svg';

const router = useRouter();
const route = useRoute();
</script>
