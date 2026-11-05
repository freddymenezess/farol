# Farol

Uma aplicação web principalmente para jovens angolanos que querem emigrar para estudar ou trabalhar.

Hoje, quem pensa em emigrar quase nunca tem uma forma organizada de encontrar outras pessoas a passar pelo mesmo processo, nem de saber onde ficar quando chegar. Tudo se resolve em grupos de WhatsApp, com conhecidos ou com sorte. O Farol junta tudo num só sítio.

## O que o Farol faz

- Junta pessoas com o mesmo destino e o mesmo propósito (estudo ou trabalho) em grupos com chat em tempo real.
- Liga quem vai emigrar a anfitriões no país de destino que oferecem alojamento acessível.
- Os anfitriões são verificados à mão por um administrador antes de aparecerem na plataforma.
- Depois de acolhido, cada pessoa pode avaliar o anfitrião, e qualquer utilizador pode denunciar comportamentos abusivos ou fraudulentos.
- Quem já está estabelecido no destino pode passar a ajudar quem vem a seguir.

O Farol não envolve dinheiro: não há pagamentos dentro da plataforma. É só para maiores de 18 anos e só para estudo ou trabalho, não para turismo.

## Estado do projeto

Em desenvolvimento. Está a ser construído por núcleos: primeiro registo e onboarding, depois anfitriões, grupos e chat, e por fim denúncias e administração.

## Tecnologias

Next.js, Tailwind CSS, shadcn/ui, Prisma, PostgreSQL e Supabase (autenticação, tempo real e armazenamento de ficheiros), com deploy na Vercel.

## Como correr em local

Precisas de Node.js, Docker Desktop e do Supabase CLI.

```bash
git clone <url-do-repositorio>
cd farol
npm install
cp .env.example .env
supabase start
npx prisma migrate deploy
npm run dev
```

Depois abre http://localhost:3000.

## Autor

Freddy, Luanda, Angola.

## Licença

Todos os direitos reservados. O código está público para consulta e para mostrar o meu trabalho, mas não é permitido copiar, usar, modificar ou distribuir o projeto, nem explorá-lo comercialmente, sem autorização minha por escrito.