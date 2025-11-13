# 🤝 Contribuindo com o Projeto

Este projeto segue o fluxo de trabalho **Git Flow**, utilizando branches específicas para organizar correções, novas funcionalidades e releases. Abaixo está um guia simples e direto para colaborar mantendo o padrão da equipe.

---

## 🌿 Fluxo de Branches (Git Flow)

A estrutura principal de branches é:

- **main** → sempre estável (produção)
- **develop** → desenvolvimento contínuo
- **feature/\*** → novas funcionalidades
- **fix/\*** → correções gerais
- **release/\*** → preparação para nova versão

---

## 🚨 Correção Urgente (Hotfix)

Use **hotfix** quando algo precisa ser corrigido diretamente na versão em produção.

```bash
$ git checkout main
$ git pull origin main
$ git add <arquivos>
$ git commit -m "hotfix(producao): corrigir falha crítica no login"
$ git push origin main
```

---

## 📝 Commits Semânticos (Conventional Commits)

Utilizamos o padrão **Conventional Commits** para manter o histórico limpo, organizado e fácil de rastrear.

📌 Formato padrão:

```bash
tipo(escopo): descrição curta
```

- **tipo** → define a natureza da alteração
- **escopo** → indica o módulo/feature afetado (opcional, mas recomendado)
- **descrição** → objetiva e direta

---

### 📌 Tipos mais usados pela equipe

| Tipo       | Uso                                       | Exemplo                                      |
| ---------- | ----------------------------------------- | -------------------------------------------- |
| `feat`     | Nova funcionalidade                       | `feat(auth): adicionar autenticação JWT`     |
| `fix`      | Correção de bug                           | `fix(login): corrigir validação de email`    |
| `docs`     | Alteração em documentação                 | `docs(readme): atualizar guia de setup`      |
| `style`    | Formatação (sem alterar lógica)           | `style(ui): ajustar espaçamento do header`   |
| `refactor` | Refatorações sem mudança de comportamento | `refactor(user): otimizar busca de dados`    |
| `test`     | Criação/ajustes de testes                 | `test(auth): adicionar testes de login`      |
| `chore`    | Tarefas internas, dependências, configs   | `chore(deps): atualizar dependências`        |
| `hotfix`   | Correção crítica em produção              | `hotfix(producao): corrigir crash no deploy` |

---

### 🧩 Uso recomendado do Escopo

O **escopo** deve representar o módulo/feature afetado, como por exemplo:

- `auth`
- `login`
- `dashboard`
- `payments`
- `api`
- `ui`
- `config`

📌 Regras recomendadas:

- Se a alteração for relacionada a **uma feature/módulo específico**, use o escopo.
- Se alterar **apenas um arquivo**, o escopo pode ser o nome do módulo relacionado ao arquivo.
- Se alterar **dois arquivos ou mais**, use o nome da feature ou domínio da alteração.

---

### ✅ Exemplos práticos

- Alteração pequena em módulo específico:
  - `fix(auth): corrigir refresh token expirado`

- Nova feature:
  - `feat(payments): adicionar integração com Stripe`

- Mudança de documentação:
  - `docs(api): documentar endpoints de autenticação`

- Refatoração:
  - `refactor(dashboard): melhorar performance da listagem`

---

Seguindo esse padrão, garantimos um histórico de commits consistente, fácil de auditar e simples de automatizar em pipelines e releases.
