Primeiro Teste do Servido com Deploy do render.com

npm run test

> pedidos-api@1.0.0 test
> node config/database.js

Conectado ao PostgreSQL (Render.com)
Teste de conexão bem-sucedido!
Hora do servidor: 2025-11-30T02:48:18.914Z

Segundo Teste Criar as Tabelas (Pedidos e Itens).


 npm run create-tables

> pedidos-api@1.0.0 create-tables
> node config/createTables.js    

Iniciando criação das tabelas...

Conectado ao PostgreSQL (Render.com)
Tabela "pedidos" criada com sucesso!
Tabela "itens_pedido" criada com sucesso!
Índices criados com sucesso!

  Tabelas existentes no banco:
   - itens_pedido
   - pedidos

 Todas as tabelas foram criadas com sucesso!

Outros Comandos 

Criar tabelas
npm run create-tables

 Deletar todas as tabelas
npm run delete-tables

Resetar banco (deletar e criar novamente)
npm run reset-db

### Entrando no Banco de dados
psql -h localhost -U seu_usuario -d seu_banco -c "\dt"

#### -- Listar tabelas
\dt

#### -- Listar todas as tabelas com detalhes
\dt+

#### -- Ver estrutura das tabelas
\d pedidos
\d itens_pedido

#### -- Consultar dados
SELECT * FROM pedidos LIMIT 5;
SELECT * FROM itens_pedido LIMIT 5;

#### -- Sair
\q


##  O Mapper vai transformar o JSON que recebemos da API para o formato que será salvo no banco de dados

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node utils/mapper.js
Testando funções do Mapper...

Teste 1: Mapeamento de pedido válido
Mapeamento bem-sucedido!
Pedido de entrada:
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.5299601+00:00",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    },
    {
      "idItem": "2435",
      "quantidadeItem": 2,
      "valorItem": 2000
    }
  ]
}

 Pedido mapeado (formato do banco):
{
  "orderId": "v10089015vdb-01",
  "value": 10000,
  "creationDate": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "itemId": "2434",
      "quantity": 1,
      "itemValue": 1000
    },
    {
      "itemId": "2435",
      "quantity": 2,
      "itemValue": 2000
    }
  ]
}

Teste 2: Pedido sem numeroPedido (esperado: erro)
Erro capturado corretamente: Campo obrigatório ausente: numeroPedido

 Teste 3: Pedido sem items (esperado: erro)
Erro capturado corretamente: O pedido deve conter pelo menos um item

 Teste 4: Mapeamento do banco para API
Mapeamento banco → API bem-sucedido!
{
  "id": 1,
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "id": 1,
      "idItem": "2434",
      "quantidadeItem": 1,
      "valorItem": 1000
    }
  ],
  "criadoEm": "2024-11-29T10:00:00Z",
  "atualizadoEm": "2024-11-29T10:00:00Z"
}

 Testes passaram com sucesso!


