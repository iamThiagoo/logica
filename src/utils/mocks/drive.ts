import type { DriveFileRecord } from '@/utils/types/admin';

const driveFiles: DriveFileRecord[] = [
  {
    id: 'drive-001',
    name: 'proposta-comercial-marco',
    extension: 'pdf',
    size: '2,4 MB',
    uploadedBy: 'Renata Souza',
    uploadedAt: '2026-03-27',
    expiresInDays: 10,
    status: 'Disponível',
    recipients: ['cliente@grupo-horizonte.com'],
    deliveryMode: 'automatico',
  },
  {
    id: 'drive-002',
    name: 'relatorio-onboarding',
    extension: 'xlsx',
    size: '1,1 MB',
    uploadedBy: 'Julia Gomes',
    uploadedAt: '2026-03-25',
    expiresInDays: 1,
    status: 'Expira hoje',
    recipients: ['operacoes@primelogistica.com', 'time@mycompany.local'],
    deliveryMode: 'somente-link',
  },
  {
    id: 'drive-003',
    name: 'manual-de-processos',
    extension: 'docx',
    size: '860 KB',
    uploadedBy: 'Thiago Mendes',
    uploadedAt: '2026-03-20',
    expiresInDays: 0,
    status: 'Arquivado',
    recipients: ['financeiro@mycompany.local'],
    deliveryMode: 'automatico',
  },
];

export default driveFiles;
