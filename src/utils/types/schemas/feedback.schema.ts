import { z } from 'zod';

const requiredText = (field: string) => z.string().trim().min(1, `${field} é obrigatório.`);

export const suggestionSchema = z.object({
  message: requiredText('Mensagem'),
});

export const permissionRequestSchema = z.object({
  justification: z.string().trim().max(500).optional(),
});

export type SuggestionInput = z.infer<typeof suggestionSchema>;
export type PermissionRequestInput = z.infer<typeof permissionRequestSchema>;
