export type ClientStatus = 'Ativo' | 'Em onboarding' | 'Inativo';
export type LeadStage = 'Novo' | 'Qualificado' | 'Proposta' | 'Convertido';
export type UserStatus = 'Ativo' | 'Convidado' | 'Inativo';
export type DriveFileStatus = 'Disponível' | 'Expira hoje' | 'Arquivado';

export interface ClientRecord {
  id: string;
  code: string;
  name: string;
  company: string;
  segment: string;
  email: string;
  phone: string;
  city: string;
  status: ClientStatus;
  lastContact: string;
  createdAt: string;
  notes: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  stage: LeadStage;
  owner: string;
  score: number;
  expectedValue: number;
  createdAt: string;
  lastInteraction: string;
  notes: string;
}

export interface UserRecord {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: UserStatus;
  accessLevel: string;
  lastLogin: string;
  createdAt: string;
}

export interface DriveFileRecord {
  id: string;
  name: string;
  extension: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  expiresInDays: number;
  status: DriveFileStatus;
  recipients: string[];
  deliveryMode: string;
}

export interface MeetingParticipant {
  label: string;
  value: string;
  avatar?: {
    src?: string;
  };
}

export interface MeetingRecord {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: string;
  organizer: string;
  color: string;
  avatar?: string;
  icon?: string;
  participants?: string[];
  priority?: 'low' | 'medium' | 'high';
}
