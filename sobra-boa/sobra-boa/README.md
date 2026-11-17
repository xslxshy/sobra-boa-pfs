# Sobra Boa

Aplicação foi feita em Next.js e conecta quem tem excedente de alimentos (mercados, padarias, restaurantes, feiras, produtores) a quem pode aproveita-lo (ONGs, abrigos, cozinhas comunitárias), com voluntários para o transporte. As ofertas aparecem ordenadas pela validade e mostram se estão no mesmo bairro ou cidade do usuário.

Planejamento (usuários, dores, funcionalidades e regras): [docs/PLANEJAMENTO.md](docs/PLANEJAMENTO.md).

## Como executar

```
npm install
npm run dev
```

a aplicação abre em: http://localhost:3000

Contas de teste (senha 123456): padaria@teste.com (doador) // ong@teste.com (receptor) // voluntario@teste.com (voluntário)

Opcional: copiar `.env.example` para `.env.local` para trocar o segredo do JWT (`JWT_SECRET`) e o tempo de expiração do token (`JWT_EXPIRA`, padrão `2h`)

## Tecnologias
Next.js 14, Sequelize (ORM) e SQLite. Senhas com bcryptjs e autenticação com jsonwebtoken

O banco fica em `data/db.sqlite` criado automaticamente na primeira execução junto com as contas de teste.

## estruturação
- `app/api`: rotas da API (só encaminham para os controllers)
- `controllers`: regras de negócio de cada recurso
- `middlewares`: `autenticar.js` (valida o JWT e o perfil) e `erros.js` (respostas de erro em JSON)
- `models`: modelos Sequelize (`Usuario`, `Oferta`) e associações
- `lib`: conexão com o banco, geração do token e funções auxiliares
- `app` e `components`: telas

## Relações
- `Usuario` tem muitas `Oferta` em três papéis: `ofertasDoadas` (doador), `reservas` (receptor) e `coletas` (voluntário)
- `Oferta` pertence a um `doador`, a um `receptor` (opcional) e a um `voluntario` (opcional)

## Autenticação
1. No cadastro (`POST /api/usuarios`) a senha é criptografada com bcrypt antes de ser salva
2. No login (`POST /api/auth/login`) a senha é conferida e a API devolve um token JWT
3. As telas guardam o token e o enviam no cabeçalho `Authorization: Bearer <token>`
4. Nas rotas privadas o middleware `autenticar` valida o token e o perfil do usuário

Para demonstrar o token expirado, rode com `JWT_EXPIRA=10s` no `.env.local`, faça login, espere 10 segundos e chame `GET /api/auth/me`.

## API externa
ViaCEP: usada no cadastro para buscar rua, bairro e cidade a partir do CEP

https://viacep.com.br/

## API própria

**POST /api/usuarios** — Público

Cadastra usuário e retorna usuário e token

**POST /api/auth/login** — Público

Realiza login com e-mail e senha

**GET /api/auth/me** — Token

Retorna os dados do usuário logado

**GET /api/usuarios/:id/ofertas** — Token

Lista as ofertas do usuário

**GET /api/ofertas** — Público

Lista ofertas com filtros opcionais

**POST /api/ofertas** — Doador

Publica uma oferta

**PATCH /api/ofertas/:id** — Token

Reserva, aceita, entrega ou cancela uma oferta

**DELETE /api/ofertas/:id** — Doador

Exclui uma oferta