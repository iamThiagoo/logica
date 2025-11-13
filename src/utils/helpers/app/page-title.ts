import { isRunningAsPWA } from '../shared/pwa';

const DEFAULT_TITLE = 'MyCompany • Template';

export default function getPageTitle(title?: string): string {
  // Se for pwa, não adiciona o título padrão pois já vem no manifest.json
  if (isRunningAsPWA()) {
    return title || DEFAULT_TITLE;
  }

  return title ? `${title} | ${DEFAULT_TITLE}` : DEFAULT_TITLE;
}
