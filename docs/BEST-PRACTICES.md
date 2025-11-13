## 👍 Boas Práticas de Desenvolvimento

Se você segui-lás, você é um amigo:

- Componentes Vue
  - Nomeie usando **PascalCase**
    - Exemplos: SettingsModal.vue, UserProfileCard.vue
  - Utilize Composition API
  - Siga o padrão: **template -> script -> style**
  - Deixe os lifecycle hooks sempre no final do script, junto com os watchers para facilitar identificação

- Arquivos Typescript
  - Nomeie **TODOS** os arquivo no padrão **kebab-case** (routes, composables, stores...)
  - Coloque tipos e interfaces dentro de **types/** e enums dentro de **types/enums/**

- Router
  - Use **kebab-case** nos nomes de páginas em **pages/**

- UI
  - Recentemente adotamos o Nuxt UI para padronizar nossa interface e acelerar o desenvolvimento. Por convenção, é recomendado consultar os componentes disponíveis antes de implementar algo novo (fazer na unha)
  - Atenção ao usar componentes do Shadcn. Como utilizamos Shadcn e Nuxt UI simultaneamente, ambos baseados no Reka UI, podem ocorrer conflitos de estilo. Caso isso aconteça, pode ser necessário ajustar manualmente o componente do Shadcn.
  - Utilize **Tailwind** que é bacana e tente evitar ao máximo css inline
  - Sempre procure usar/criar componentes reutilizáveis, se possível
  - Ajustando estilos globais dos componentes do Nuxt UI:
    - Utilize a pasta **src/utils/ui/** \*/ para aplicar alterações de estilo de forma global.
    - Caso o ajuste não se aplique globalmente, faça a modificação diretamente inline no próprio componente.

- Build & Projeto
  - Antes do commit, rode **pnpm check** ou **npm run check** para fazer uma revisão geral no repositório com prettier, lint e ts-check
  - Antes de cada release... atualize a versão no **package.json**
  - Recomendamos utilizar no ambiente de desenvolvimento o gerenciador de pacotes **pnpm** (mais rápido) e, para ambiente de produção/build o npm (mais "confiável" e evita possíveis dores de cabeça)
