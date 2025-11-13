import { pagesIconsMap } from '@/utils/types/map/icons-map';

export default {
  label: 'Administração',
  icon: pagesIconsMap.administration_root,
  children: [
    {
      label: 'Usuários',
      icon: pagesIconsMap.users_root,
      to: '/usuarios',
    },
  ],
};
