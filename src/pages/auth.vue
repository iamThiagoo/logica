<template>
  <main class="min-h-screen flex items-center justify-center rounded-lg animated-gradient relative overflow-hidden">
    <div ref="bgEl" class="auth-bg" aria-hidden="true" />
    <section class="box flex justify-center flex-row min-h-[428px] xl:min-h-[600px] mx-auto shadow-md scale-98 rounded-2xl relative z-10">
      <BannerContainer />
      <div class="bg-white min-h-[428px] min-w-[350px] xl:min-w-[488px] xl:min-h-[600px] h-full flex flex-col justify-center items-center text-sm font-extralight rounded-r-2xl">
        <div class="max-w-[250px] fade-left xl:max-w-max xl:min-w-[350px] flex flex-col">
          <div class="flex flex-col justify-center items-center">
            <UIcon name="i-lets-icons:lock-light" class="size-7 xl:size-11 mb-3 text-gray-400" />
            <h2 class="text-sm lg:text-base xl:text-lg font-semibold text-gray-500">Olá, seja bem-vindo(a),</h2>
            <h3 class="text-sm md:text-lg xl:text-2xl font-medium text-gray-400 dark:!text-gray-400 mb-2">Faça login na sua conta</h3>
          </div>

          <Form ref="form" class="mt-2 xl:mt-4" @submit="onSubmit">
            <div>
              <div class="relative flex items-center">
                <span class="absolute ml-2.5">
                  <UIcon name="i-lets-icons:user-cicrle-light" class="size-5 xl:size-8 text-gray-400" />
                </span>

                <Field id="username" v-model="username" type="search" placeholder="Usuário ou E-mail" name="username" :validate-on-change="false" :validate-on-blur="false" class="font-normal text-xs xl:text-base block w-full py-2 xl:py-2.5 text-gray-700 placeholder-[#B4B4B4] bg-[#F9FAFB] border border-[#AEB0B3] rounded-lg pl-9 xl:pl-12 pr-2.5 rtl:pr-11 rtl:pl-5 focus:border-gray-400 focus:ring-gray-400 focus:outline-none focus:ring focus:ring-opacity-40" @keydown.enter.prevent="onSubmit" />
              </div>
            </div>

            <div class="mt-2 xl:mt-5">
              <div class="relative flex items-center">
                <span class="absolute ml-2.5">
                  <UIcon name="i-lets-icons:lock-light" class="size-5 xl:size-8 text-gray-400" />
                </span>

                <Field
                  id="password"
                  v-model="password"
                  :type="seePassword ? 'text' : 'password'"
                  placeholder="Senha"
                  name="password"
                  :validate-on-change="false"
                  :validate-on-blur="false"
                  class="font-normal text-xs xl:text-base block w-full py-2 xl:py-2.5 text-gray-700 placeholder-[#B4B4B4] bg-[#F9FAFB] border border-[#AEB0B3] rounded-lg pl-9 xl:pl-12 pr-9 xl:pr-12 rtl:pr-11 rtl:pl-5 focus:border-gray-400 focus:ring-gray-400 focus:outline-none focus:ring focus:ring-opacity-40"
                  @keydown.enter.prevent="onSubmit"
                />

                <span class="absolute right-0 mr-3 cursor-pointer" @click="() => (seePassword = !seePassword)">
                  <img v-if="!seePassword" src="@/assets/svg/eye-hide.svg" class="h-5 xl:h-auto" />
                  <img v-else src="@/assets/svg/eye-open.svg" class="h-5 xl:h-auto" />
                </span>
              </div>
            </div>

            <UButton :loading="isLoading" type="submit" color="neutral" variant="outline" :ui="{ label: 'text-center', leadingIcon: 'relative -left-2' }" class="cursor-pointer text-center w-full flex justify-center btn-scale text-sm xl:text-xl bg-[#343A40]! p-1.5 xl:py-2.5 text-white font-medium rounded-xl mt-5 hover:opacity-90 focus:border-gray-500 focus:ring-gray-400 focus:outline-none focus:ring">
              <p class="relative -left-1">Entrar</p>
            </UButton>
          </Form>

          <div class="relative mt-4 xl:mt-6">
            <USeparator label="OU ACESSE COM" :ui="{ label: 'text-sm text-zinc-400 border-red-800!' }" color="neutral" />

            <section class="mt-4 xl:mt-6 grid grid-cols-2 gap-3">
              <button type="submit" className="btn-scale text-base flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-nowrap font-bold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
                <UIcon name="flat-color-icons:google" class="size-5 xl:size-6" />
                Google
              </button>

              <button type="submit" className="btn-scale cursor-pointer text-base flex w-full items-center justify-center gap-3 rounded-xl bg-[#1877F2] px-4 py-3 text-nowrap font-bold text-white shadow-sm shadow-blue-200 transition-all hover:bg-[#166fe5]">
                <UIcon name="logos:facebook" class="size-5 relative -top-0.5 xl:size-6" />
                Facebook
              </button>
            </section>
          </div>
        </div>
      </div>
    </section>
    <p class="absolute fade-in-version text-xs! md:text-base! right-3 bottom-2 mb-2 mr-2 text-gray-400 z-10">Versão {{ appVersion }}</p>
  </main>
</template>

<script setup lang="ts">
import { Form, Field } from 'vee-validate';
import { isLocalAdminCredentials, LOCAL_ADMIN_PASSWORD, LOCAL_ADMIN_TOKEN, LOCAL_ADMIN_USERNAME, loginRedirect } from '@/utils/helpers/app/auth';
import { UserRoundX } from 'lucide-vue-next';
import router from '@/router';
import { showToast } from '@/utils/helpers/app/toast';
import BannerContainer from '@/components/features/auth/BannerContainer.vue';
import { useAuthStore } from '@/stores/modules/auth.store';
import gsap from 'gsap';
import * as THREE from 'three';

const appVersion = __APP_VERSION__;
const seePassword = ref(false);
const isLoading = ref(false);
const username = ref<string>(LOCAL_ADMIN_USERNAME);
const password = ref<string>(LOCAL_ADMIN_PASSWORD);
const userStore = useAuthStore();
const bgEl = ref<HTMLDivElement | null>(null);

const focusField = (field: 'username' | 'password') => {
  requestAnimationFrame(() => {
    const input = document.getElementById(field) as HTMLInputElement | null;
    input?.focus();
  });
};

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let frameId: number | null = null;
let tl: gsap.core.Timeline | null = null;
const disposables: Array<THREE.BufferGeometry | THREE.Material> = [];

const onSubmit = async () => {
  isLoading.value = true;

  try {
    const user = username.value.trim().toLowerCase();
    const pass = password.value.trim();

    if (!user || !pass) {
      focusField(!user ? 'username' : 'password');
      showToast({
        message: 'Preencha todos os campos!',
        title: 'Informe usuário e senha.',
        type: 'error',
        icon: UserRoundX,
      });
      return;
    }

    if (isLocalAdminCredentials(user, pass)) {
      await userStore.setUser(LOCAL_ADMIN_TOKEN);
      loginRedirect(router);
      return;
    }
  } catch (err: any) {
    showToast({
      message: 'Use as credenciais admin / admin para acessar o template.',
      title: 'Usuário ou senha inválidos.',
      type: 'error',
      icon: UserRoundX,
    });
  } finally {
    isLoading.value = false;
  }
};

onBeforeMount(() => {
  if (localStorage.getItem('token')) loginRedirect(router);
});

onMounted(() => {
  focusField('username');

  if (!bgEl.value) return;

  const width = bgEl.value.clientWidth;
  const height = bgEl.value.clientHeight;

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height);
  renderer.setClearColor(0x000000, 0);
  bgEl.value.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(0, 0, 6);

  const group = new THREE.Group();

  const pointsCount = 220;
  const positions = new Float32Array(pointsCount * 3);
  for (let i = 0; i < pointsCount; i += 1) {
    const r = 2.4 + Math.random() * 0.8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const index = i * 3;
    positions[index] = r * Math.sin(phi) * Math.cos(theta);
    positions[index + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[index + 2] = r * Math.cos(phi);
  }

  const pointsGeometry = new THREE.BufferGeometry();
  pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const pointsMaterial = new THREE.PointsMaterial({
    color: 0x8da2b8,
    size: 0.03,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });
  disposables.push(pointsGeometry, pointsMaterial);
  const points = new THREE.Points(pointsGeometry, pointsMaterial);
  group.add(points);

  const ringGeometry = new THREE.TorusGeometry(1.4, 0.015, 16, 120);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xb3c0cf,
    transparent: true,
    opacity: 0.25,
  });
  disposables.push(ringGeometry, ringMaterial);
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.set(Math.PI / 3, 0, Math.PI / 5);
  group.add(ring);

  scene.add(group);

  tl = gsap.timeline({ repeat: -1, yoyo: true });
  tl.to(group.rotation, { y: Math.PI * 2, duration: 60, ease: 'none' }, 0);
  tl.to(group.rotation, { x: Math.PI / 6, duration: 18, ease: 'sine.inOut' }, 0);
  tl.to(camera.position, { z: 6.6, duration: 20, ease: 'sine.inOut' }, 0);

  const render = () => {
    if (!renderer || !scene || !camera) return;
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(render);
  };
  render();

  const onResize = () => {
    if (!bgEl.value || !renderer || !camera) return;
    const nextWidth = bgEl.value.clientWidth;
    const nextHeight = bgEl.value.clientHeight;
    renderer.setSize(nextWidth, nextHeight);
    camera.aspect = nextWidth / nextHeight;
    camera.updateProjectionMatrix();
  };

  window.addEventListener('resize', onResize);

  onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize);
  });
});

onBeforeUnmount(() => {
  if (frameId) cancelAnimationFrame(frameId);
  if (tl) tl.kill();
  disposables.forEach((asset) => asset.dispose());
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }
  renderer = null;
  scene = null;
  camera = null;
});
</script>

<style scoped>
@keyframes gradientMove {
  0% {
    background-position: 0% 0%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 0% 0%;
  }
}

.animated-gradient {
  background: linear-gradient(45deg, #dfe9f3 0%, white 25%, #e8f0f7 50%, white 75%, #dfe9f3 100%);
  background-size: 400% 400%;
  animation: gradientMove 15s ease infinite;
}

.auth-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  opacity: 0.55;
}

.auth-bg canvas {
  width: 100%;
  height: 100%;
  display: block;
}

@keyframes fadeLeft {
  0% {
    opacity: 0;
    transform: translateX(10px);
  }

  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-left {
  animation: fadeLeft 0.3s ease-out forwards;
}

* {
  font-family: 'Inter', sans-serif;
}

@keyframes fadeInVersion {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-version {
  opacity: 0;
  animation: fadeInVersion 0.1s ease-out forwards;
  animation-delay: 0.1s;
}

.social-button {
  box-shadow: 0 10px 25px -22px rgba(17, 24, 39, 0.45);
}

.social-button:hover {
  transform: translateY(-1px);
}

.social-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.35rem;
  height: 1.35rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 700;
  color: #fff;
}

.social-badge-facebook {
  background: linear-gradient(135deg, #1877f2, #0f5fd6);
}

.social-badge-google {
  background: linear-gradient(135deg, #ea4335, #fbbc05, #34a853, #4285f4);
}
</style>
