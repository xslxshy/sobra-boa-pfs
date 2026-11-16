# Sobra Boa

Aplicação foi feita em Next.js e conecta quem tem excedente de alimentos (mercados, padarias, restaurantes, feiras, produtores) a quem pode aproveita-lo (ONGs, abrigos, cozinhas comunitárias), com voluntários para o transporte. As ofertas aparecem ordenadas pela validade e mostram se estão no mesmo bairro ou cidade do usuário.

Planejamento (usuários, dores, funcionalidades e regras): [docs/PLANEJAMENTO.md](docs/PLANEJAMENTO.md).

## Como executar

```
npm install
npm run dev
```

a aplicação abre em: http://localhost:3000

Contas de teste: padaria@teste.com (doador) // ong@teste.com (receptor) // voluntario@teste.com (voluntário)

Os dados ficam no arquivo `data/db.json`

## Como usar
1. O doador entra e publica um alimento no painel.
2. O receptor entra, vai em Ofertas e reserva (marcando se precisa de voluntário).
3. O voluntário entra, aceita a coleta no painel e confirma a entrega.

## API externa
ViaCEP: usada no cadastro para buscar rua, bairro e cidade a partir do CEP

https://viacep.com.br/

## API própria

### POST /api/usuarios

Cadastra um usuário (nome, e-mail, perfil, telefone, CEP, rua, número, bairro e cidade)

### POST /api/login

Realiza o login utilizando o e-mail do usuário

### GET /api/ofertas

Lista as ofertas cadastradas. Possui filtros opcionais por status, doadorId, receptorId, voluntarioId e cidade.

### POST /api/ofertas

Permite que o doador publique uma oferta informando doadorId, título, descrição, quantidade, unidade e validade

### PATCH /api/ofertas/:id

Altera o estado de uma oferta. Recebe no corpo da requisição a ação desejada (reservar, aceitar, entregar ou cancelar), o usuarioId e a informação precisaVoluntario

### DELETE /api/ofertas/:id?usuarioId=1

Permite que o doador exclua uma oferta informando seu ID de usuário

## Limitações
O login é só por e-mail (sem senha) e os dados ficam em arquivo JSON
