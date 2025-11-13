import { pagesIconsMap } from '@/utils/types/map/icons-map';
import leadsModule from './docs';

export default {
  label: 'Comercial',
  icon: pagesIconsMap.commercial_root,
  defaultOpen: true,
  children: [
    {
      label: 'Clientes',
      icon: pagesIconsMap.clients_root,
      to: '/clientes',
    },
    leadsModule,
  ],
};
