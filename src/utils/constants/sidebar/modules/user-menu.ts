import router from '@/router';
import { DropdownMenuItem } from '@nuxt/ui';

export const getUserMenuDropdownItems: (user: any, openModal: any) => DropdownMenuItem[][] = (user, openModal) => {
  return [
    [
      {
        type: 'label',
        label: user.name,
        avatar: user.avatar,
      },
    ],
    [
      {
        label: 'Criar Chamado - TI',
        icon: 'i-lucide-info',
        to: '/',
        target: '_blank',
      },
      {
        label: 'Sugestões & Feedback',
        icon: 'i-lucide-message-circle',
        onSelect: () => openModal('sugestoes-feedback'),
      },
    ],
    [
      {
        label: 'Colaboradores & Acessos',
        icon: 'i-lucide-users-round',
        onSelect: () => openModal('configuracoes', { tab: 'colaboradores' }),
      },
    ],
    [
      {
        label: 'Aparência & Uso',
        icon: 'i-lucide-palette',
        onSelect: () => openModal('configuracoes', { tab: 'aparencia' }),
      },
      {
        label: 'Configurações',
        icon: 'i-lucide-settings',
        onSelect: () => openModal('configuracoes', { tab: 'meu-perfil' }),
      },
    ],
    [
      {
        label: 'Sair do Sistema',
        icon: 'i-lucide-log-out',
        onSelect: () => {
          localStorage.removeItem('token');
          router.push('/login');
        },
      },
    ],
  ];
};
