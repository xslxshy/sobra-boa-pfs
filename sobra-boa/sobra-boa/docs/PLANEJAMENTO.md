## Problema
Mercados, padarias, restaurantes, feiras e produtores têm alimentos bons que não serão vendidos a tempo. Ao mesmo tempo, ONGs, abrigos e cozinhas comunitárias precisam de alimento, mas não sabem onde há excedente. Falta comunicação e logística, e o prazo de validade é curto

## Usuários, dores e funcionalidades

Usuários: 
Doador: Tem sobra de alimento e não sabe a quem oferecer , publica o alimento com quantidade e validade, cancela ou exclui ofertas, publica o alimento com quantidade e validade, cancela ou exclui ofertas (mercado, padaria, restaurante, feira, produtor)
Receptor: Não sabe onde há excedente por perto, vê as ofertas ordenadas por validade, filtra por cidade, reserva e escolhe se precisa de voluntário (ONG, abrigo, cozinha comunitária)
Voluntário: Quer ajudar mas não sabe onde e quando vê as coletas pendentes, aceita uma e confirma a entrega


## Regras de negócio
- A validade da oferta precisa ser no futuro
- As ofertas são listadas da que vence primeiro para a que vence depois
- Oferta disponível com validade vencida aparece como "vencida" e não pode ser reservada.
- Só o doador publica, só o receptor reserva, só o voluntário aceita coleta
- Fluxo: disponível, reservada, entregue (ou cancelada)
- Se o receptor não precisa de voluntário, ele mesmo confirma o recebimento.
- A localização é considerada pelo bairro e pela cidade, obtidos pelo CEP no cadastro

## API externa
ViaCEP (https://viacep.com.br): gratuita, sem chave e feita para CEPs brasileiros. É usada no cadastro para preencher rua, bairro e cidade automaticamente,permitindo comparar a localização de doadores e receptores
