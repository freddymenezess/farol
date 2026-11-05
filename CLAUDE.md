# Farol

Aplicação web de comunidade e apoio à emigração de jovens principalmente angolanos (estudo ou trabalho). Liga pessoas com o mesmo destino e propósito, e anfitriões no país de destino que oferecem alojamento acessível.

As regras de negócio completas, o histórico de decisões e as pendências estão em `docs/farol.md`. Consultar só quando a tarefa o exigir.

## Regras inegociáveis

- Propósito: só estudo ou trabalho. Nunca turismo ou férias.
- Idade mínima: 18 anos. Confirmada por um card após o cadastro, guardada em `adult_confirmed_at` (não pedimos data de nascimento).
- Verificação de anfitriões: sempre manual, feita por um admin. Nunca OCR, reconhecimento facial nem IA.
- Nenhuma transação financeira dentro da plataforma.
- Não adicionar microserviços, bibliotecas novas ou complexidade que não esteja aqui. Em caso de dúvida, perguntar antes.
- Tudo o que estiver marcado `[EM ABERTO]` em `docs/farol.md` não se assume: pergunta-se.

## Stack

Next.js (App Router), Tailwind CSS, shadcn/ui, Prisma, PostgreSQL (Supabase), Supabase Auth, Supabase Realtime, Supabase Storage, Zod, Zustand.

## Comandos

```bash
npm run dev                 # servidor de desenvolvimento
npm run build               # build de produção
npm run lint                # ESLint
supabase start              # Postgres, Auth e Realtime locais (Docker)
supabase stop
npx prisma migrate dev      # criar e aplicar migração em local
npx prisma migrate deploy   # aplicar migrações já existentes
npx prisma generate         # regenerar o cliente
```

## Arquitetura

- O Next.js serve frontend e backend. Não existe serviço separado.
- Mostrar dados sem interação: Server Component com Prisma direto.
- Ação pontual de um formulário: Server Action.
- Route Handler só quando um Client Component precisa de pedir dados depois da carga inicial (pesquisa com filtros, mensagens antigas do chat).
- A lógica de negócio (reputação, limiar de denúncias, sugestão de anfitriões) vive em `src/services/`. Actions e handlers só recebem, validam com Zod e respondem.
- O mesmo schema Zod serve o formulário e a validação no servidor.
- Chat: mensagens novas chegam pelo Supabase Realtime, enviar é Server Action, histórico antigo é Route Handler.
- Zustand só para estado de UI. Permissões e autenticação validam-se sempre no servidor.

## Dados

- O Prisma é a única fonte de verdade do schema e das migrações (`prisma/migrations/`). Nunca usar `supabase db diff` nem migrações do Supabase para as tabelas da app.
- O cliente Supabase (`@supabase/supabase-js`) é só para Auth, Realtime e Storage. Nunca ler ou escrever por ele as tabelas que o Prisma gere.
- `User.id` é o mesmo UUID de `auth.users`, sem `@default`. A linha em `User` é criada por um trigger do Supabase após o registo.
- Políticas RLS e triggers escrevem-se como SQL manual dentro das migrações do Prisma.
- Tabelas e colunas em `snake_case` no Postgres, com `@map()` no Prisma.
- A password nunca vai para a tabela `User`.
- Admin: campo `role` (`USER`, `ADMIN`, `SUPER_ADMIN`) alterado só na base de dados, nunca por um ecrã. Verificar sempre no servidor.

## Documentos de anfitrião (dados sensíveis)

- Ficam no bucket privado `host-documents`, só admin acede, com URLs temporários.
- Apagar primeiro os ficheiros; só se correr bem, gravar a decisão do admin.
- O número do documento fica em texto simples só durante a revisão. Na decisão guarda-se apenas o hash (HMAC-SHA256, segredo em variável de ambiente, nunca no repositório) e apagam-se número e imagens.

## Erros

- Server Actions: `{ success: true, data }` ou `{ success: false, error: "mensagem" }`.
- Route Handlers: JSON com o mesmo formato e o código HTTP certo (400, 401, 403, 500).
- Nunca mostrar ao utilizador o erro interno do Prisma. Mensagem genérica; o detalhe fica só no log do servidor.

## Convenções

- Ficheiros em `kebab-case`; componentes e tipos em `PascalCase`; funções e variáveis em `camelCase`.
- Domínios em plural (`grupos/`, `anfitrioes/`, `denuncias/`). Server Actions com sufixo `-action` (`criar-grupo-action.ts`).
- Imports agrupados com linha em branco entre grupos: bibliotecas externas, internos absolutos (`@/`), relativos, e por fim `import type`.
- Funções com mais de 50 linhas são sinal para dividir.
- Comentar só o "porquê" de decisões não óbvias. Nunca repetir o que o código já diz.
- Textos das perguntas do pedido de contacto ficam em ficheiros de tradução (`pt.json`, `en.json`); a base de dados guarda só as respostas (booleano ou texto).
- Não há testes automatizados. Testa-se à mão.

## Segurança

- Nunca commitar `.env` nem chaves. Só `.env.example`.
- Nunca confiar no frontend para permissões.
- Dados pessoais seguem a Lei 22/11 (proteção de dados, Angola).