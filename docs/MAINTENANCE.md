# Manutenção

## Objetivo

Este documento descreve como manter o front-end ao longo do tempo, com foco em operação, evolução segura, padrões já adotados e observações técnicas importantes.
O projeto atual é um front-end em Vue 3 + Vite + TypeScript, com uso de: Nuxt UI, Shadcn, Pinia, Vue Router, Axios e PWA.

## Visão Geral da Arquitetura

### Stack principal

- Vue 3
- Vite 7
- TypeScript
- Pinia
- Vue Router
- Axios
- Nuxt UI
- Shadcn Vue
- Vite PWA

### Estrutura principal

- `src/pages/`: paginas da aplicacao
- `src/components/`: componentes compartilhados e componentes por feature
- `src/router/`: definicao das rotas, middlewares e progresso de navegacao
- `src/stores/`: stores Pinia
- `src/api/`: cliente HTTP e integracoes com servicos
- `src/composables/`: logicas reutilizaveis baseadas em Composition API
- `src/utils/`: tipos, constantes, helpers, schemas e mocks
- `src/layouts/`: layouts principais da aplicacao
- `public/`: imagens, icones e arquivos estaticos
- `docs/`: documentacao de apoio

### Fluxo de inicializacao

O bootstrap do app acontece em `src/main.ts`, onde sao carregados:

- estilos globais
- colecoes de icones
- router
- Nuxt UI
- Pinia

As rotas sao carregadas dinamicamente com `import.meta.glob` em `src/router/index.ts`, o que reduz acoplamento e facilita a expansao modular.

## Como Rodar e Manter o Ambiente

### Requisitos

- Node.js compativel com o ecossistema atual do projeto
- `pnpm` na versao definida em `package.json`

### Comandos principais

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm typecheck
pnpm format
pnpm check
```

### Rotina minima antes de subir alteracoes

1. Instalar dependencias com `pnpm install`.
2. Validar variaveis de ambiente.
3. Rodar `pnpm check`.
4. Rodar `pnpm build`.
5. Testar manualmente as telas alteradas.

## Convencoes de Desenvolvimento

As convencoes atuais do repositorio, consolidadas a partir dos arquivos em `docs/`, sao:

- Componentes Vue em `PascalCase`
- Arquivos TypeScript em `kebab-case`
- Uso preferencial de Composition API
- Estrutura dos componentes em `template -> script -> style`
- Tipos centralizados em `src/utils/types`
- Enums em `src/utils/types/enums`
- Rotas e paginas seguindo nomes semanticos e previsiveis
- Priorizar Tailwind/utilitarios e evitar CSS inline
- Reutilizar componentes antes de criar novas variacoes

## Organizacao Funcional do Projeto

### UI e design system

O projeto mistura Nuxt UI e Shadcn. Isso acelera o desenvolvimento, mas exige disciplina:

- sempre verificar se o componente ja existe no Nuxt UI antes de implementar na mao
- quando usar Shadcn, validar conflitos de estilo com componentes do Nuxt UI
- ajustes globais de UI devem passar preferencialmente por `src/components/nuxt-ui/`

### Estado

O gerenciamento de estado usa Pinia com `pinia-plugin-persistedstate`.

Implicacoes para manutencao:

- alteracoes em stores podem persistir dados antigos no navegador
- sempre validar migracoes de formato quando mudar a estrutura persistida
- ao depurar comportamento inconsistente, limpar `localStorage` pode ser necessario

### Rotas e permissao

As rotas sao montadas por arquivos em `src/router/routes/*.routes.ts`.

Pontos importantes:

- a filtragem de rotas passa por `filterUserRoutes`
- existe middleware de permissao em `src/router/middleware.ts`
- o titulo das paginas e atualizado pelo guard

### Integracao com APIs

O cliente Axios central fica em `src/api/http.ts`.

Comportamentos relevantes:

- o token e injetado automaticamente no header `Authorization`
- respostas `401` removem o token local e redirecionam para `/login`
- os modulos de API sao separados por dominio em `src/api/services/`

Essa divisao facilita manutencao, mas exige cuidado com nomes de variaveis de ambiente e base URLs.

## Variaveis de Ambiente

O projeto depende de multiplos servicos externos. Antes de qualquer manutencao relevante, revise o arquivo de ambiente e confirme se as chaves usadas pelo codigo correspondem ao arquivo `.env`.

### Ponto de atencao atual

Existe inconsistencia entre o codigo e o `.env-example`:

- `src/api/index.ts` usa `VITE_APP_MS_BACK_ENG`
- o `.env-example` publica `VITE_APP_MS_ENG`
- `src/api/index.ts` usa `VITE_APP_MS_PRODESK`
- o `.env-example` nao define `VITE_APP_MS_PRODESK`
- `VITE_APP_MS_EST` aparece duplicada no `.env-example`

Recomendacao:

- alinhar imediatamente o `.env-example` com as variaveis realmente consumidas pelo codigo
- padronizar nomenclatura antes de novos modulos serem adicionados

## PWA e Assets

O projeto possui configuracao PWA em `vite.config.ts` e arquivos publicos em `public/`.

Na manutencao:

- validar o manifest quando houver troca de nome, icone ou branding
- revisar cache de arquivos e APIs quando houver mudancas de deploy ou comportamento offline
- testar instalacao da PWA em navegadores compativeis apos alteracoes importantes

## Processo de Evolucao Segura

### Ao criar uma nova feature

1. Confirmar se a feature pertence a um modulo existente ou se precisa de um novo dominio.
2. Criar ou ajustar a rota em `src/router/routes/`.
3. Criar pagina em `src/pages/`.
4. Extrair UI reutilizavel para `src/components/features/` ou `src/components/shared/`.
5. Criar integracao de API no dominio correto dentro de `src/api/services/`.
6. Centralizar tipos e schemas em `src/utils/types/`.
7. Validar permissao, persistencia e comportamento offline, quando aplicavel.

### Ao alterar integracoes de backend

1. Revisar contrato esperado pela tela.
2. Atualizar tipos e schemas.
3. Garantir tratamento de erro no fluxo.
4. Validar impacto em stores e componentes consumidores.
5. Testar ambientes com token expirado e resposta `401`.

### Ao atualizar dependencias

1. Atualizar poucas dependencias por vez.
2. Rodar `pnpm install`.
3. Rodar `pnpm check`.
4. Rodar `pnpm build`.
5. Validar visualmente componentes de Nuxt UI, Shadcn e editor.
6. Revisar `vite.config.ts` e eventuais breaking changes da stack.

## Manutencao Preventiva Recomendada

### Semanal

- revisar falhas visiveis no ambiente de desenvolvimento
- verificar se novas telas mantem o padrao de componentes reutilizaveis
- confirmar se nao foram introduzidas variaveis de ambiente ad hoc

### Mensal

- revisar dependencias desatualizadas
- validar consistencia da documentacao em `docs/`
- revisar stores persistidas e pontos de acoplamento alto
- conferir se o build continua limpo

### Antes de release

- atualizar a versao em `package.json`
- rodar `pnpm check`
- rodar `pnpm build`
- validar fluxos criticos: login, dashboard, navegacao, modais principais e integracoes com API
- revisar manifest/PWA se houve mudanca de branding ou assets

## Riscos Tecnicos e Observacoes Importantes

### 1. Guard de autenticacao parcialmente desativado

Em `src/router/middleware.ts`, parte relevante da validacao de autenticacao esta comentada.

Impacto:

- o comportamento real de protecao de rotas pode nao refletir a intencao do projeto
- manutencoes futuras podem assumir seguranca que hoje nao esta ativa

Recomendacao:

- decidir explicitamente se o guard deve voltar a validar token e rotas publicas
- documentar a regra final no proprio arquivo e nesta pasta `docs/`

### 2. Divergencia entre ambiente esperado e ambiente documentado

O `.env-example` nao representa com precisao todas as variaveis consumidas pelo codigo.

Impacto:

- onboarding mais lento
- risco de erro silencioso em integracoes
- maior chance de configuracao incorreta em novos ambientes

### 3. Mistura de bibliotecas de UI

Nuxt UI e Shadcn convivem no mesmo projeto.

Impacto:

- possiveis conflitos de estilo
- maior custo de manutencao visual
- padrao de UX pode se fragmentar se nao houver revisao constante

### 4. Persistencia local pode mascarar bugs

Como estados sao persistidos, mudancas de estrutura em stores podem gerar erros dificeis de reproduzir.

Recomendacao:

- ao mudar stores persistidas, validar upgrade de estado ou limpar chave antiga

### 5. Projeto ainda tem sinais de transicao/prototipo

O proprio `README.md` descreve o sistema como prototipo/base de evolucao. Isso sugere que nem toda convencao tecnica esta consolidada.

Implicacao:

- antes de grandes refatoracoes, alinhar criterios arquiteturais com a equipe
- evitar expandir inconsistencias existentes

## Checklist de Manutencao

Use esta lista em qualquer alteracao relevante:

- ambiente configurado corretamente
- variaveis `.env` conferidas
- tipos atualizados
- rotas e guards revisados
- stores validadas
- chamadas de API testadas
- `pnpm check` executado
- `pnpm build` executado
- validacao manual das telas alteradas
- documentacao atualizada, se a mudanca afetar fluxo, arquitetura ou operacao

## Boas Praticas para Longo Prazo

- manter a documentacao de arquitetura sempre proxima do codigo real
- evitar adicionar novos padroes de UI sem necessidade
- preferir modulos pequenos e com responsabilidade clara
- padronizar naming de variaveis de ambiente e servicos
- revisar arquivos comentados ou fluxos desativados para evitar "codigo zumbi"
- reduzir mocks antigos quando a integracao real ja estiver estabilizada
- registrar decisoes arquiteturais importantes antes de novas expansoes

## Documentos Relacionados

- `docs/BEST-PRACTICES.md`
- `docs/CONTRIBUITING.md`
- `docs/PWA-SETUP.md`
- `README.md`

## Sugestao de Proximo Passo

O proximo ajuste de maior retorno operacional e corrigir o `.env-example` para refletir exatamente as variaveis lidas pelo projeto e revisar o middleware de autenticacao para deixar claro o comportamento esperado.
