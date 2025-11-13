export default [
  {
    path: '/',
    name: 'Meu Dashboard',
    meta: { title: 'Meu Dashboard' },
    component: () => import('@/pages/dashboard/index.vue'),
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login',
      layout: 'empty',
    },
    component: () => import('@/pages/auth.vue'),
  },
  {
    path: '/clientes',
    name: 'Clientes',
    meta: { title: 'Clientes' },
    component: () => import('@/pages/dashboard/clients.vue'),
  },
  {
    path: '/leads',
    name: 'Leads',
    meta: { title: 'Leads' },
    component: () => import('@/pages/dashboard/leads.vue'),
  },
  {
    path: '/usuarios',
    name: 'Usuários',
    meta: { title: 'Usuários' },
    component: () => import('@/pages/dashboard/users.vue'),
  },
  {
    path: '/agenda-reunioes',
    name: 'Agenda de Reuniões',
    meta: { title: 'Agenda de Reuniões' },
    component: () => import('@/pages/dashboard/sala-reunioes.vue'),
  },
  {
    path: '/drive',
    name: 'Drive Compartilhado',
    meta: { title: 'Drive Compartilhado' },
    component: () => import('@/pages/dashboard/drive.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    meta: {
      title: 'Página 404',
      layout: 'empty',
    },
    component: () => import('@/pages/404.vue'),
  },
];
