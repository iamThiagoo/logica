import { CalendarDate } from '@internationalized/date';
const TZ = 'America/Sao_Paulo';

const toDate = (value: string | Date) => (value instanceof Date ? value : new Date(value));

export const getDateFormat = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (date: string | Date): string => {
  if (!date) return '-';
  const d = toDate(date);

  return d.toLocaleDateString('pt-BR', {
    timeZone: TZ,
  });
};

export const formatDateTime = (date: string | Date): string => {
  if (!date) return '-';
  const d = toDate(date);

  return d
    .toLocaleString('pt-BR', {
      timeZone: TZ,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    })
    .replace(',', ' -');
};

export const formatTime = (date: string | Date): string => {
  const d = toDate(date);

  return d.toLocaleTimeString('pt-BR', {
    timeZone: TZ,
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatHour = (hour: number): string => `${hour.toString().padStart(2, '0')}:00`;

export const formatDayName = (date: string | Date): string => {
  return toDate(date).toLocaleDateString('pt-BR', {
    timeZone: TZ,
    weekday: 'long',
  });
};

export const formatAgendaDate = (date: string | Date): string => {
  return toDate(date).toLocaleDateString('pt-BR', {
    timeZone: TZ,
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const formatAgendaWeekday = (date: string | Date): string => {
  return formatDayName(date);
};

export const greetings = (): string => {
  const hour = new Date().toLocaleString('pt-BR', {
    hour: 'numeric',
    hour12: false,
    timeZone: TZ,
  });

  const h = Number(hour);

  if (h < 5) return 'Boa noite';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

export const randomDateWithin7Days = (hours = 9, minutes = 0): Date => {
  const today = new Date();
  const offset = Math.floor(Math.random() * 7);

  const d = new Date(today);
  d.setDate(today.getDate() + offset);
  d.setHours(hours, minutes, 0, 0);

  return d;
};

export const getWeekStart = (date: string | Date): Date => {
  const d = toDate(date);
  const day = d.getDay(); // 0 = domingo
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

export const getWeekDay = (dayIndex: number, currentDate: Date): Date => {
  const weekStart = getWeekStart(currentDate);
  const result = new Date(weekStart);
  result.setDate(result.getDate() + dayIndex);
  return result;
};

export function toCalendarDate(dateStr: string | null) {
  if (!dateStr) return null;
  const [year, month, day] = dateStr.split('-').map(Number);
  return new CalendarDate(year, month, day);
}

export const formatTimeAgo = (dateString: string) => {
  const diff = Date.now() - new Date(dateString).getTime();

  const minutes = Math.floor(diff / 60000);
  if (minutes < 5) return 'Adicionado agora';
  if (minutes < 60) return `Adicionado há ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Adicionado há ${hours} hora${hours > 1 ? 's' : ''}`;

  const days = Math.floor(hours / 24);
  return `Adicionado há ${days} dia${days > 1 ? 's' : ''}`;
};
