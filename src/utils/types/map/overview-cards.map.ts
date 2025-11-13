import type { OverviewCardKey } from '@/utils/types/overview';

export const overviewCardsConfigMap: Record<
  OverviewCardKey,
  {
    label: string;
    icon: string;
  }
> = {
  'clients-overview-card': {
    label: 'Clientes ativos',
    icon: 'i-lucide-handshake',
  },
  'leads-overview-card': {
    label: 'Leads em aberto',
    icon: 'i-lucide-target',
  },
  'users-overview-card': {
    label: 'Usuários internos',
    icon: 'i-lucide-users-round',
  },
  'drive-overview-card': {
    label: 'Arquivos no drive',
    icon: 'i-lucide-folder-symlink',
  },
  'meetings-overview-card': {
    label: 'Reuniões agendadas',
    icon: 'i-lucide-calendar-range',
  },
  'onboarding-overview-card': {
    label: 'Onboarding em curso',
    icon: 'i-lucide-rocket',
  },
  'conversion-overview-card': {
    label: 'Conversões do período',
    icon: 'i-lucide-chart-column',
  },
  'satisfaction-overview-card': {
    label: 'Satisfação média',
    icon: 'i-lucide-smile-plus',
  },
};
