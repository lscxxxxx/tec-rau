# 📚 TEC-RAU — Repositório Institucional para Trabalhos de Conclusão dos Cursos Técnicos

Repositório institucional digital desenvolvido para o **Câmpus Jaraguá do Sul – Rau**, do **Instituto Federal de Santa Catarina (IFSC)**, voltado exclusivamente ao armazenamento, organização e divulgação em acesso aberto dos trabalhos de conclusão dos cursos técnicos (projetos integradores, artigos científicos, seminários, entre outros).

O projeto nasceu de uma lacuna real: no IFSC, o depósito de TCCs de cursos técnicos no repositório institucional oficial é **facultativo**, diferente do que ocorre com graduação e pós-graduação. O TEC-RAU propõe uma plataforma dedicada e regional para dar visibilidade a essa produção acadêmica, seguindo o modelo de outros repositórios institucionais consolidados (DSpace, BDTD, RIC-CPS, RI-IFSC).

> Projeto Integrador II — Curso Técnico em Desenvolvimento de Sistemas, IFSC Câmpus Jaraguá do Sul – Rau (novembro/2025)

---

## ✨ Funcionalidades

**Público geral**
- Busca textual por trabalhos, com filtros por curso, tipo documental e palavras-chave
- Navegação por categorias, coleções e facetas
- Página individual de cada trabalho com todos os metadados públicos
- Visualização do PDF diretamente no navegador, além de opção de download
- Compartilhamento direto do link permanente do trabalho

**Área administrativa**
- Autenticação de administradores via login protegido
- Cadastro, edição e exclusão de trabalhos e seus metadados (autores, orientadores, curso, tipo documental, palavras-chave)
- Cadastro de novos administradores
- Log de auditoria completo: toda operação de criação, atualização ou exclusão feita por um administrador fica registrada e consultável em uma tela dedicada

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|---|---|
| Framework | [Nuxt.js](https://nuxt.com/) (Vue.js) |
| Linguagem | TypeScript |
| Estilização | Tailwind CSS |
| ORM | Prisma |
| Banco de dados | PostgreSQL |
| Autenticação | JWT + bcrypt |

O sistema segue um layout responsivo (desktop, tablet e mobile), armazena senhas com hash seguro e foi projetado para que o usuário chegue ao arquivo de qualquer trabalho a partir da página inicial em, no máximo, quatro cliques.

---

## 🗂️ Modelo de dados

O núcleo do sistema é a entidade **Trabalho**, relacionada a **Curso** e **TipoDocumental** (N:1), e a **Pessoa** através da tabela associativa **TrabalhoPessoa** (que registra o papel de autor ou orientador). Palavras-chave seguem o mesmo padrão através de **TrabalhoPalavraChave**. Toda alteração feita por um **Admin** sobre um trabalho é registrada na tabela **Auditoria**.

```mermaid
erDiagram
    CURSO ||--o{ TRABALHO : possui
    TIPODOCUMENTAL ||--o{ TRABALHO : classifica
    TRABALHO ||--o{ TRABALHOPESSOA : relaciona
    PESSOA ||--o{ TRABALHOPESSOA : participa
    TRABALHO ||--o{ TRABALHOPALAVRACHAVE : relaciona
    PALAVRACHAVE ||--o{ TRABALHOPALAVRACHAVE : descreve
    ADMIN ||--o{ AUDITORIA : registra
    TRABALHO ||--o{ AUDITORIA : referencia
```

---

## 🚀 Instalação e execução local

### Requisitos

- [Node.js](https://nodejs.org) LTS 18.x ou superior (o NPM já vem incluso)
- [PostgreSQL](https://www.postgresql.org/download/) 16 ou superior
- [Git](https://git-scm.com/downloads)
- [Visual Studio Code](https://code.visualstudio.com/download) (recomendado)

O sistema é compatível com os principais navegadores modernos (Chrome, Edge, Safari); o ambiente de desenvolvimento utilizou preferencialmente o Firefox.

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/lscxxxxx/tec-rau.git
cd tec-rau
```

**2. Instale as dependências**
```bash
npm install
```

**3. Configure o banco de dados**

O projeto usa PostgreSQL com Prisma ORM. **Não é necessário importar arquivos `.sql`** — as tabelas são criadas automaticamente pelas migrations. Antes de rodar o projeto:

1. Tenha o PostgreSQL instalado e em execução
2. Crie dois bancos: `repositorio` e `repositorio_shadow`
3. Crie (ou use) um usuário com permissões sobre esses bancos

**4. Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:

```env
# === Configurações do Prisma ===
DATABASE_URL="postgresql://nuxt_user:123456@localhost:5432/repositorio?schema=public"
SHADOW_DATABASE_URL="postgresql://nuxt_user:123456@localhost:5432/repositorio_shadow?schema=public"

# === JWT utilizado na autenticação do sistema ===
JWT_SECRET=alguma_chave_segura_aleatoria

# === URL base da API utilizada pelo Nuxt ===
NUXT_PUBLIC_API_BASE=http://localhost:3000/api
```

> ⚠️ Nunca use os valores de exemplo acima em produção. Gere um `JWT_SECRET` aleatório e use credenciais de banco próprias.

**5. Crie e sincronize o banco de dados**
```bash
npx prisma migrate dev --name init
```
Isso cria todas as tabelas automaticamente, gera o Prisma Client e verifica a consistência do schema.

**6. Execute o projeto**
```bash
npm run dev
```

**7. Acesse**

Abra [http://localhost:3000](http://localhost:3000) no navegador. Se a porta 3000 estiver ocupada, o Nuxt realoca automaticamente para outra.

---

## 📌 Roadmap / Melhorias planejadas

Lista de melhorias identificadas para as próximas iterações do projeto:

- [ ] **Remover trechos de debug** (`console.log`) deixados em `middleware/auth.global.ts` e revisar o restante do código em busca de resíduos semelhantes
- [ ] **Migrar o banco de dados para a nuvem** usando [Supabase](https://supabase.com) (PostgreSQL gerenciado), mantendo a configuração local como ambiente de desenvolvimento — documentando os dois setups (`.env.local.example` e `.env.supabase.example`) para deixar visível a evolução do projeto
- [ ] **Migrar o armazenamento de arquivos PDF** de disco local (`public/uploads`) para um serviço de object storage (ex: Cloudflare R2), já que hospedagens em nuvem costumam ter sistema de arquivos efêmero
- [ ] **Renomear o `package.json`**, que ainda está com o nome padrão gerado pelo `create-nuxt-app`
- [ ] Adicionar testes automatizados para as rotas de API mais críticas (autenticação e CRUD de trabalhos)
- [ ] Adicionar arquivo `LICENSE`
- [ ] Publicar uma versão hospedada (deploy) para demonstração pública

---

## 👥 Autores

Desenvolvido por **Lucas Batista Nunes**, sob orientação de **Bruno Crestani Calegaro**, como Projeto Integrador II do Curso Técnico em Desenvolvimento de Sistemas — IFSC Câmpus Jaraguá do Sul – Rau (novembro/2025).

## 📄 Licença

_A definir — sugestão: [MIT License](https://choosealicense.com/licenses/mit/)_
