import { z } from 'zod';

const requiredText = (field: string) => z.string().trim().min(1, `${field} é obrigatório.`);

export const quickLinkSchema = z.object({
  title: z.string().trim().optional(),
  url: requiredText('URL').refine((value) => {
    const normalized = /^https?:\/\//i.test(value) ? value : `https://${value}`;

    try {
      new URL(normalized);
      return true;
    } catch {
      return false;
    }
  }, 'Informe uma URL válida.'),
  createdAt: z.string().optional(),
});

export const quoteSchema = z.object({
  quote: requiredText('Citação'),
  author: z.string().trim().optional(),
});

export type QuickLinkInput = z.infer<typeof quickLinkSchema>;
export type QuoteInput = z.infer<typeof quoteSchema>;
