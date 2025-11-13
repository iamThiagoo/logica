const productTeam = {
  name: 'Equipe de Produto',
  avatar: {
    src: 'https://ui-avatars.com/api/?name=Equipe+de+Produto&background=E2E8F0&color=0F172A',
    alt: 'Equipe de Produto',
  },
  to: 'https://github.com',
  target: '_blank',
};

const frontendTeam = {
  name: 'Time Frontend',
  avatar: {
    src: 'https://ui-avatars.com/api/?name=Time+Frontend&background=DBEAFE&color=1D4ED8',
    alt: 'Time Frontend',
  },
  to: 'https://github.com',
  target: '_blank',
};

export const versions = [
  {
    title: 'v1.0.0',
    html: `
      <div class="space-y-8 mt-4 mb-6!">
        <section class="space-y-3">
          <h3 class="text-lg font-semibold">Template Administrativo Consolidado</h3>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Generalização do projeto para um contexto administrativo reutilizável.</li>
            <li>Padronização dos módulos principais com foco em customização futura.</li>
            <li>Revisão de textos, títulos e fluxos para publicação como template no GitHub.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-semibold">Módulos Mockados</h3>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>CRUD completo de Clientes com dados locais.</li>
            <li>CRUD completo de Leads com etapas de acompanhamento.</li>
            <li>Gestão de Usuários com níveis de acesso e perfis internos.</li>
            <li>Agenda de Reuniões e Drive Compartilhado adaptados ao novo domínio.</li>
          </ul>
        </section>
      </div>
    `,
    date: '2026-03-29',
    target: '_blank',
    ui: { container: 'max-w-3xl' },
    authors: [productTeam, frontendTeam],
  },
  {
    title: 'v0.1.0',
    html: `
      <div class="space-y-8 mt-4 mb-6!">
        <section class="space-y-3">
          <h3 class="text-lg font-semibold">Experiência de Administração</h3>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Agrupamento de navegação por áreas como Comercial e Administração.</li>
            <li>Busca global refinada para exibir somente itens navegáveis.</li>
            <li>Aba de colaboradores atualizada com permissões alinhadas aos módulos reais do app.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-semibold">Autenticação e Sessão</h3>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Login mock local com credenciais predefinidas para demonstração.</li>
            <li>Controle de autenticação centralizado no Pinia.</li>
            <li>Persistência local da sessão para facilitar testes e demos.</li>
          </ul>
        </section>
      </div>
    `,
    date: '2026-03-24',
    target: '_blank',
    ui: { container: 'max-w-3xl' },
    authors: [frontendTeam],
  },
  {
    title: 'v0.0.1',
    html: `
      <div class="space-y-8 mt-4 mb-6!">
        <section class="space-y-3">
          <h3 class="text-lg font-semibold">Base Inicial do Dashboard</h3>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Setup inicial com Vue 3, TypeScript, Vite, Pinia e Nuxt UI.</li>
            <li>Layout principal com barra lateral, breadcrumb e área central de conteúdo.</li>
            <li>Estrutura pronta para módulos, stores, composables e componentes compartilhados.</li>
          </ul>
        </section>

        <section class="space-y-3">
          <h3 class="text-lg font-semibold">Fundações do Template</h3>
          <ul class="list-disc list-inside space-y-2 text-sm">
            <li>Suporte a PWA e build para publicação estática.</li>
            <li>Base de configurações visuais, widgets e atalhos personalizados.</li>
            <li>Documentação inicial e preparação para evolução iterativa do produto.</li>
          </ul>
        </section>
      </div>
    `,
    date: '2026-03-18',
    target: '_blank',
    ui: { container: 'max-w-3xl' },
    authors: [productTeam],
  },
];
