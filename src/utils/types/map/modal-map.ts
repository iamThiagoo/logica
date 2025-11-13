import CreateDriveModal from '@/components/features/drive/CreateDriveModal.vue';
import CreateEditClientModal from '@/components/features/clients/CreateEditClientModal.vue';
import CreateEditLeadModal from '@/components/features/leads/CreateEditLeadModal.vue';
import CreateEditMeetingEventModal from '@/components/features/meeting/CreateEditMeetingEventModal.vue';
import PermissionDeniedModal from '@/components/features/permission-denied/PermissionDeniedModal.vue';
import SettingsModal from '@/components/features/settings/SettingsModal.vue';
import SuggestionsModal from '@/components/features/suggestions/SuggestionsModal.vue';
import CreateEditUserModal from '@/components/features/users/CreateEditUserModal.vue';
import QuickLinksModal from '@/components/features/widgets/modals/quick-links/QuickLinksModal.vue';

/**
 * @rules
 * Importante mencionar que o nome da chave escolhida será usada na url do app... para facilitar
 * possíveis compartilhamentos de links diretos, tente manter os nomes coerentes e amigáveis
 */
export const modalMap = {
  // Global
  configuracoes: SettingsModal,
  'sugestoes-feedback': SuggestionsModal,
  'acesso-negado': PermissionDeniedModal,
  'novo-link': QuickLinksModal,

  // Reuniões & Eventos
  evento: CreateEditMeetingEventModal,

  // CRUDs administrativos
  'novo-cliente': CreateEditClientModal,
  'novo-lead': CreateEditLeadModal,
  'novo-usuario': CreateEditUserModal,

  // Drive
  'novo-drive': CreateDriveModal,
} as const;

export type ModalKey = keyof typeof modalMap;
export const MODALS_WITHOUT_QUERY: ModalKey[] = [];
