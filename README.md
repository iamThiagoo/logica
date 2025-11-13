# Vue Dashboard Template

Template genérico de dashboard administrativo com Vue 3, TypeScript, Pinia, Vue Router e Nuxt UI v4. O projeto foi preparado para servir como base reutilizável, com autenticação mock local e módulos administrativos prontos para customização.

## Visão geral

O template mantém a estrutura original do projeto e substitui os módulos específicos por funcionalidades genéricas comuns em sistemas administrativos:

- Dashboard inicial com visão geral
- Clientes com CRUD local
- Leads com CRUD local
- Usuários com CRUD local
- Drive compartilhado com dados mockados
- Agenda de reuniões com dados mockados

Todas as interfaces seguem o padrão visual já existente e utilizam componentes do Nuxt UI.

## Autenticação mock

O login funciona localmente, sem backend, usando Pinia para controle de sessão.

- Usuário: `admin`
- Senha: `admin123`

Os campos da tela de login já são carregados com esses valores por padrão.

## Stack principal

- Vue 3
- TypeScript
- Vite
- Vue Router
- Pinia
- Nuxt UI v4
- Tailwind CSS
- ESLint
- Prettier

## Pré-requisitos

- Node.js 20+
- pnpm 10+

## Como executar

```bash
pnpm install
pnpm dev
```

Se precisar de variáveis locais, use o arquivo `.env-example` como base e crie o seu `.env`.

## Scripts disponíveis

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm format
pnpm check
```

## Estrutura do template

```txt
src/
  components/   # Componentes compartilhados e modais
  composables/  # Regras reutilizáveis e estado local dos mocks
  layouts/      # Layouts da aplicação
  pages/        # Páginas e módulos do dashboard
  router/       # Rotas da aplicação
  stores/       # Stores globais com Pinia
  utils/        # Mocks, tipos, mapas e helpers
```

## Dados mockados

Os módulos de Clientes, Leads, Usuários, Drive e Agenda utilizam dados mockados locais para demonstrar fluxos completos sem dependência de backend. Isso facilita a publicação do repositório como template e acelera a customização por outros times.

## Docker

O projeto possui `Dockerfile` pronto para build e publicação da SPA com Nginx.

```bash
docker build -t vue-dashboard-template .
docker run --rm -p 8080:80 vue-dashboard-template
```

## Como adaptar para o seu projeto

1. Atualize nome, descrição e identidade visual.
2. Substitua os mocks por chamadas reais de API quando necessário.
3. Ajuste os módulos e permissões conforme o domínio da sua aplicação.
4. Revise os textos de interface, metadados e variáveis de ambiente.

## Qualidade

Antes de publicar ou reutilizar o template, execute:

```bash
pnpm check
pnpm build
```

## Licença

Defina a licença que fizer sentido para o seu repositório antes da publicação no GitHub.
