<template>
  <div class="w-full space-y-6 overflow-y-auto h-full">
    <UPageHeader
      title="Login Mobile"
      description="Realize de forma prática o login no aplicativo MyCompany através do dispositivo."
      class="mb-1"
      :ui="{
        root: 'pb-6 pt-0',
        title: 'text-xl!',
        description: 'text-sm',
      }"
    />

    <section class="flex items-end gap-x-6">
      <div ref="target" class="w-full flex flex-row h-80 gap-4 bg-gray-50 dark:bg-neutral-800 py-4 p-4 pb-1 border rounded-2xl border-black/10 dark:shadow relative">
        <div class="relative w-72 text-center h-full">
          <div v-if="state.hasExpired" class="inset-0 h-[84%] bg-black/80 flex items-center justify-center absolute rounded">
            <span class="text-red-400 text-sm dark:text-red-300 relative -mt-3 mb-0.5"> QR Code expirou! </span>
          </div>

          <div class="relative w-fit mx-auto">
            <Qrcode id="qrCode" :size="250" level="H" :value="state.generatedCode" />

            <div class="absolute inset-0 flex items-center justify-center pointer-events-none" />
          </div>

          <span class="text-lg mt-12! pt-10! relative top-3 font-medium tracking-widest text-text-dark dark:text-white">
            {{ state.generatedCode }}
          </span>
        </div>

        <div class="w-full flex flex-col justify-between pb-3">
          <div>
            <div class="flex flex-row justify-between">
              <span class="font-medium text-text-dark dark:text-white">
                {{ `${formatTime(state.minutes)}:${formatTime(state.seconds)}` }}
              </span>
            </div>

            <div class="mt-3 text-[16px] text-text-dark dark:text-white text-sm relative">
              <p>Aponte o leitor de QR CODE do celular ou</p>
              <p>a câmera para fazer login no aplicativo.</p>
            </div>
          </div>

          <div class="flex flex-row justify-end w-full gap-5">
            <button class="cursor-pointer hover:bg-elevated-50! btn-scale px-5 py-2 text-sm bg-primary-600 rounded-full text-white font-semibold" @click="generateCode">Gerar Novamente</button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import Qrcode from 'qrcode.vue';

const target = ref(null);
let state = reactive({
  timer: 0,
  hasExpired: false,
  generatedCode: '',
  interval: null as ReturnType<typeof setInterval> | null,
  minutes: 0,
  seconds: 0,
});

async function generateCode() {
  try {
    state.minutes = 0;
    state.seconds = 0;
    state.timer = 60;
    state.hasExpired = false;
    setTimer();
  } catch (error) {
    console.error(error);
  }
}

function cancel() {
  clearInterval(state.interval!);
  state.interval = null;
  state.minutes = 0;
  state.seconds = 0;
  state.timer = 0;
  state.hasExpired = false;
  state.generatedCode = '';
}

watch(
  () => state.timer,
  (v: any) => {
    if (v === 0) {
      setTimeout(() => {
        cancel();
      }, 30000);
    }
  }
);

function setTimer() {
  if (state.interval) {
    clearInterval(state.interval);
    state.interval = null;
  }

  state.interval = setInterval(() => {
    if (state.timer < 0) {
      clearInterval(state.interval!);
      state.hasExpired = true;
    } else {
      state.minutes = Math.floor(state.timer / 60);
      state.seconds = state.timer % 60;
      state.timer--;
    }
  }, 1000)!;
}

function formatTime(time: number) {
  return time < 10 ? `0${time}` : time;
}

onBeforeMount(async () => {
  await generateCode();
});

onUnmounted(() => {
  if (state.interval) {
    cancel();
  }
});
</script>

<style scoped>
.shadow {
  box-shadow:
    rgba(0, 0, 0, 0.15) 0px 15px 25px,
    rgba(0, 0, 0, 0.05) 0px 5px 10px;
  z-index: 9999 !important;
}
</style>
