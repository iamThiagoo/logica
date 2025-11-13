<template>
  <div class="bg-cover relative bg-no-repeat min-w-[500px] xl:min-w-[680px]">
    <div class="absolute z-50 bg-[#101112] h-full w-full opacity-90 rounded-l-2xl" />
    <video ref="videoRef" src="@/assets/videos/preview.mp4" autoplay muted playsinline class="absolute w-full h-full object-cover rounded-l-2xl bg-cover grayscale" />
    <div class="z-50 absolute w-full mt-3.5 h-full flex flex-col justify-center items-start pl-16 xl:pl-20">
      <div>
        <img src="@/assets/svg/logo.svg" class="brand-logo h-auto w-8/12 xl:w-11/12" alt="Logo MyCompany" />
      </div>
      <div class="relative mt-4">
        <svg width="230" height="1" viewBox="0 0 230 1" fill="none" class="hidden xl:block brand-line" xmlns="http://www.w3.org/2000/svg">
          <line y1="0.5" x2="230" y2="0.5" stroke="url(#paint0_linear_835_1216)" />
          <defs>
            <linearGradient id="paint0_linear_835_1216" x1="0" y1="1.5" x2="230" y2="1.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="#D3D3D3" />
              <stop offset="1" stop-color="#4F4F4F" />
            </linearGradient>
          </defs>
        </svg>
        <svg width="150" height="1" viewBox="0 0 150 1" fill="none" class="block xl:hidden brand-line" xmlns="http://www.w3.org/2000/svg">
          <line y1="0.5" x2="150" y2="0.5" stroke="url(#paint0_linear_928_1339)" />
          <defs>
            <linearGradient id="paint0_linear_928_1339" x1="0" y1="1.5" x2="150" y2="1.5" gradientUnits="userSpaceOnUse">
              <stop stop-color="#D3D3D3" />
              <stop offset="1" stop-color="#4F4F4F" />
            </linearGradient>
          </defs>
        </svg>
        <div class="absolute -top-11 subtitle-container">
          <span v-for="(char, index) in firstTypedChars" id="typedtext" :key="index" class="fade-in brand-subtitle text-nowrap text-white text-sm xl:text-xl font-extralight letter">{{ char }}</span>
          <br />
          <span v-for="(char, index) in secondTypedChars" id="typedtext" :key="index" class="fade-in brand-subtitle text-nowrap text-white text-sm xl:text-xl font-extralight letter">{{ char }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const videoRef = ref<HTMLVideoElement | null>(null);
const firstMessage = 'Seu Novo Dashboard Administrativo Preferido';
const firstTypingSpeed = 70;
let firstCharIndex = 0;
const firstTypedChars = ref<string[]>([]);

const secondMessage = `Vue \u2022 Nuxt UI Template`;
const secondTypingSpeed = 70;
let secondCharIndex = 0;
const secondTypedChars = ref<string[]>([]);

const typeFirstMessage = () => {
  if (firstCharIndex < firstMessage.length) {
    firstTypedChars.value.push(firstMessage[firstCharIndex] === ' ' ? '\u00A0' : firstMessage[firstCharIndex]);
    firstCharIndex++;
    setTimeout(typeFirstMessage, firstTypingSpeed);
  } else {
    setTimeout(typeSecondMessage, 300);
  }
};

// Função de digitação da segunda frase
const typeSecondMessage = () => {
  if (secondCharIndex < secondMessage.length) {
    secondTypedChars.value.push(secondMessage[secondCharIndex] === ' ' ? '\u00A0' : secondMessage[secondCharIndex]);
    secondCharIndex++;
    setTimeout(typeSecondMessage, secondTypingSpeed);
  }
};

onMounted(() => {
  const video = videoRef.value;
  if (!video) return;

  video.playbackRate = 0.7;

  video.addEventListener('ended', () => {
    setTimeout(() => {
      video.currentTime = 0.01;
      video.play();
    }, 10);
  });

  setTimeout(typeFirstMessage, 4000);
});
</script>
