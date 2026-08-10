# Central No Mistakes Consultoria

App de gestão para personal trainer/consultor: alunos, pagamentos, treinos e financeiro. Construído com Next.js (App Router, React 19, Tailwind v4) e Supabase (banco de dados Postgres + autenticação).

## Stack

- **Next.js 16** (App Router, Turbopack)
- **Supabase**: Postgres (dados), Auth (login por e-mail/senha), Storage (fotos dos alunos)
- **Tailwind CSS v4** + tokens de design customizados (ver `lib/colors.ts`)

## 1. Criar o projeto no Supabase

1. Crie uma conta gratuita em [supabase.com](https://supabase.com) e crie um novo projeto.
2. Em **Project Settings > API**, copie a **Project URL** e a chave **anon public**.
3. Em **SQL Editor**, crie uma nova query, cole o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) e execute (**Run**). Isso cria as tabelas, políticas de segurança (RLS), o bucket de fotos dos alunos e o gatilho que cria automaticamente categorias e planos padrão para cada novo usuário.
4. (Opcional) Em **Authentication > Providers**, desative "Confirm email" se quiser testar login sem precisar confirmar e-mail durante o desenvolvimento.

## 2. Configurar variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha com os dados do seu projeto Supabase:

```bash
cp .env.local.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=SUA-CHAVE-ANON
```

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000). Como não existe usuário ainda, clique em **Cadastre-se** para criar sua conta (o app é pensado para o uso de um único coach/consultor por conta). Ao logar, categorias e planos padrão (Light, Premium, Presencial) já estarão criados — edite os preços em **Config > Planos**.

## 4. Deploy (Vercel recomendado)

1. Suba o repositório no GitHub (já feito) e importe o projeto na [Vercel](https://vercel.com/new).
2. Em **Environment Variables**, adicione `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os mesmos valores do `.env.local`.
3. Deploy. O app funciona como PWA — no celular, use "Adicionar à tela de início" pelo navegador para instalar como app.

## Funcionalidades

- **Dashboard**: alunos ativos (split presencial/online), navegador de mês, receita por origem, gastos/saldo/a receber, alertas de pendências (pagamentos atrasados/a vencer, treinos atrasados/a atualizar).
- **Alunos**: filtros por tipo/status, cadastro de aluno, foto de perfil (upload/drag-and-drop), status de pagamento e treino.
- **Ficha do aluno**: dados, plano, treino (para alunos online), histórico de pagamentos, registrar novo pagamento.
- **Financeiro**: navegador de mês compartilhado com o Dashboard, funil de gastos por categoria, lista de movimentações, lançar pagamento/gasto.
- **Planos**: preços editáveis inline por plano e variante (mensal/trimestral/semestral).
- Autenticação por e-mail/senha via Supabase Auth; cada conta só enxerga seus próprios dados (Row Level Security).

## Estrutura do projeto

```
app/                 rotas (login, callback de auth, página principal)
components/          AppShell, telas (screens/) e overlays (overlays/)
lib/                 supabase (client/server/middleware), queries, contexto de app,
                     formatação, cores/tokens, tipos e seletores de dados derivados
supabase/schema.sql  schema completo do banco (rodar no SQL Editor do Supabase)
```

## Observações

- O logo usado no header (`public/logo-mark.svg`) é uma recriação vetorial simplificada da marca "M" — substitua pelo arquivo `logo-mark.png` original se quiser o visual exato do design de referência.
