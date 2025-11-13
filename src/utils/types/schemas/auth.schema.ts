import { z } from 'zod';

const requiredText = (field: string) => z.string().trim().min(1, `${field} é obrigatório.`);

export const authFormSchema = z.object({
  username: requiredText('Usuário'),
  password: requiredText('Senha'),
});

export type AuthFormInput = z.infer<typeof authFormSchema>;
