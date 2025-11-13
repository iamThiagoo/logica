import { AlertCircle, AlertTriangle, BadgeCheck, Ban, CircleCheck, CircleX, Info, LockKeyhole, OctagonX, SearchX, ServerCrash, ShieldX, Sparkles, TriangleAlert } from 'lucide-vue-next';
import type { FunctionalComponent } from 'vue';
import { errorsAliasMap } from '@/utils/types/map/errors-alias-map';
import type { ToasterProps } from '@nuxt/ui';
import { ToastColor } from '@/utils/types/toast';

const toast = useToast();

export const useToastConfig = () => {
  const toastConfig: ToasterProps = {
    position: 'top-right',
    max: 3,
    expand: false,
    duration: 5000,
  };

  return { toastConfig };
};

export type ToastType = 'error' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'neutral';

const httpTitleMap: Record<number, string> = {
  400: 'Opss, algo deu errado!',
  401: 'Não autorizado!',
  403: 'Acesso negado!',
  404: 'Opss, algo não foi encontrado!',
  500: 'Erro interno no servidor!',
};

const httpIconsMap: Record<number, FunctionalComponent> = {
  400: OctagonX,
  401: LockKeyhole,
  403: ShieldX,
  404: SearchX,
  500: ServerCrash,
};

export const iconsByType: Record<ToastType, FunctionalComponent> = {
  error: CircleX,
  primary: BadgeCheck,
  secondary: Sparkles,
  success: CircleCheck,
  info: Info,
  warning: TriangleAlert,
  neutral: Info,
};

const defaultTitlesByType: Record<ToastType, string> = {
  error: 'Ops... Algo deu errado!',
  success: 'Tudo certo!',
  info: 'Informação',
  warning: 'Atenção!',
  primary: 'Notificação',
  secondary: 'Notificação',
  neutral: 'Notificação',
};

export const httpErrorMap: Record<number, { title: string; icon: FunctionalComponent; color: ToastColor }> = {
  400: {
    title: 'Requisição inválida!',
    icon: AlertTriangle,
    color: 'warning',
  },
  401: {
    title: 'Não autorizado!',
    icon: LockKeyhole,
    color: 'error',
  },
  403: {
    title: 'Acesso negado!',
    icon: Ban,
    color: 'error',
  },
  404: {
    title: 'Recurso não encontrado!',
    icon: SearchX,
    color: 'warning',
  },
  500: {
    title: 'Erro interno no servidor!',
    icon: ServerCrash,
    color: 'error',
  },
};

export function showToast({ message, title, type = 'info', icon }: { message?: string; type?: ToastType; title?: string; icon?: FunctionalComponent | string }) {
  const defaultTitle = defaultTitlesByType[type] ?? 'Notificação';
  const isError = type === 'error';

  const finalTitle = title || defaultTitle;
  const finalDescription = message;
  const finalIcon = icon ?? iconsByType[type] ?? (isError ? CircleX : Info);

  toast.add({
    id: type,
    title: finalTitle,
    description: finalDescription,
    icon: finalIcon,
    color: type,
  });
}

const getErrorMessage = (error: any, fallback: string) => {
  const possibleMessages = [error?.response?.data?.message, error?.response?.data?.error, error?.response?.data?.detail, typeof error?.response?.data === 'string' ? error.response.data : null, error?.message, fallback];

  const rawMessage = possibleMessages.find(Boolean) || fallback;
  const aliasMessage = Object.entries(errorsAliasMap).find(([key]) => rawMessage.toLowerCase().includes(key.toLowerCase()))?.[1] || rawMessage;

  return aliasMessage;
};

export const showError = (error: any, fallback: string) => {
  const message = getErrorMessage(error, fallback);
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  showToastHttpError(message, status, serverMessage);
};

const showToastHttpError = (message?: string, status?: number, title = 'Ops... Algo deu errado!', icon = AlertCircle) => {
  toast.add({
    id: `http-${status}`,
    title: httpTitleMap[status!] ?? title,
    description: message ?? 'Por favor, contate a TI para mais informações.',
    icon: httpIconsMap[status!] ?? icon,
    color: 'error',
  });
};

export const showFeatureInDevelopment = () => {
  showToast({
    title: 'Em Desenvolvimento...',
    message: 'Estamos trabalhando nesta funcionalidade. Em breve ela estará disponível, eu acho.',
    type: 'warning',
    icon: Sparkles,
  });
};
