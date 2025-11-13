import '@/assets/css/main.css';
import '@/assets/css/shadcn.css';

import { createApp } from 'vue';
import ui from '@nuxt/ui/vue-plugin';
import App from './App.vue';
import router from './router';
import store from './stores';

import { addCollection } from '@iconify/vue';
import lucide from '@iconify-json/lucide/icons.json';
import hugeicons from '@iconify-json/hugeicons/icons.json';
import { setupAppUpdateHandling } from '@/utils/helpers/app/app-update';

const app = createApp(App);
app.use(router);
app.use(ui);
app.use(store);
app.mount('#app');

addCollection(lucide);
addCollection(hugeicons);
setupAppUpdateHandling(router);
