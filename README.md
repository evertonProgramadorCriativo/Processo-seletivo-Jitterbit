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


## 3  O Mapper vai transformar o JSON que recebemos da API para o formato que será salvo no banco de dados

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node utils/mapper.js
Testando funções do Mapper...

Teste 1: Mapeamento de pedido válido
Mapeamento bem-sucedido!
```
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
```
 Testes passaram com sucesso!


## 4- Middleware de Tratamento de Erros

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node middlewares/errorHandler.js    
Testando funções do Error Handler...
```
Teste 1: Criar AppError customizado       
AppError criado:
--+- Mensagem: Teste de erro
--+-  Status Code: 400
---+-  Is Operational: true
OK ---+-  AppError funcionando

Teste 2: Função validationError
Erro de validação criado:
---+-  Mensagem: Campo obrigatório ausente
--+-  Status Code: 400
OK ---+-  validationError funcionando

Teste 3: Função notFoundError
Erro not found criado:
---+-  Mensagem: Pedido não encontrado
---+-  Status Code: 404
OK --+-  notFoundError funcionando

Teste 4: Função conflictError
Erro de conflito criado:
--+-  Mensagem: Pedido já existe
---+-  Status Code: 409
OK ---+-  conflictError funcionando

Teste 5: Simular errorHandler
--- Erro Capturado Pelo Error Handler
Status: 400
Mensagem: Erro de teste
Stack: Error: Erro de teste
    at Object.<anonymous> (C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src\middlewares\errorHandler.js:189:18)
    at Module._compile (node:internal/modules/cjs/loader:1554:14)
    at Object..js (node:internal/modules/cjs/loader:1706:10)
    at Module.load (node:internal/modules/cjs/loader:1289:32)
    at Function._load (node:internal/modules/cjs/loader:1108:12)
    at TracingChannel.traceSync (node:diagnostics_channel:322:14)
    at wrapModuleLoad (node:internal/modules/cjs/loader:220:24)
    at Function.executeUserEntryPoint [as runMain] (node:internal/modules/run_main:170:5)
    at node:internal/main/run_main_module:36:49
Status HTTP: 400
Resposta JSON:
{
  "success": false,
  "error": {
    "message": "Erro de teste",
    "statusCode": 400
  }
}
OK ---+-  errorHandler funcionando
```
Testes do Error Handler concluídos!


## 5 Criar Pedido no Banco de Dados


PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node models/pedidoModel.js    
Testando Model - Criar Pedido...

Teste 1: Criar pedido no banco
```
Dados do pedido:
{
  "orderId": "v10089016vdb-test-1764510460809",
  "value": 15000,
  "creationDate": "2025-11-30T13:47:40.809Z",  
  "items": [
    {
      "itemId": "2434",
      "quantity": 2,
      "itemValue": 5000
    },
    {
      "itemId": "2435",
      "quantity": 1,
      "itemValue": 5000
    }
  ]
}

Inserindo no banco...
Conectado ao PostgreSQL (Render.com)
Pedido inserido com ID: 1
Item inserido com ID: 1
Item inserido com ID: 2
Transação confirmada com sucesso

Pedido criado com sucesso!
ID do pedido no banco: 1
Order ID: v10089016vdb-test-1764510460809
Quantidade de itens: 2

Detalhes completos:
{
  "pedido": {
    "id": 1,
    "order_id": "v10089016vdb-test-1764510460809",
    "value": "15000.00",
    "creation_date": "2025-11-30T16:47:40.809Z",
    "created_at": "2025-11-30T16:47:42.947Z",
    "updated_at": "2025-11-30T16:47:42.947Z"
  },
  "itens": [
    {
      "id": 1,
      "pedido_id": 1,
      "item_id": "2434",
      "quantity": 2,
      "item_value": "5000.00",
      "created_at": "2025-11-30T16:47:42.947Z"
    },
    {
      "id": 2,
      "pedido_id": 1,
      "item_id": "2435",
      "quantity": 1,
      "item_value": "5000.00",
      "created_at": "2025-11-30T16:47:42.947Z"
    }
  ]
}


Teste 2: Buscar pedido por order_id
Pedido encontrado!
Order ID: v10089016vdb-test-1764510460809
Valor: 15000.00
Itens: 2
```

Todos os testes concluídos com sucesso!
Pedido de teste criado: v10089016vdb-test-1764510460809


## 6 Buscar Pedido por ID


PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node tests/testBuscarPedido.js       
### Testando buscar pedido por ID 
```
Passo 1: Criando pedido de teste...
Conectado ao PostgreSQL (Render.com)
Pedido inserido com ID: 2
Item inserido com ID: 3
Item inserido com ID: 4
Transação confirmada com sucesso
OK ---+- Pedido criado com order_id: v10089017vdb-buscar-1764512099573

Teste 1: Buscar pedido existente
Buscando order_id: v10089017vdb-buscar-1764512099573
OK ---+- Pedido encontrado!

Dados do pedido:
---+- ID interno: 2
---+- Order ID: v10089017vdb-buscar-1764512099573
---+- Valor: 8500.00
---+- Data criação: 2025-11-30T17:14:59.573Z
---+- Quantidade de itens: 2
Itens do pedido:
  Item 1:
    ---+- ID: 1001
    ---+- Quantidade: 3
    ---+- Valor: 2500.00
  Item 2:
    ---+- ID: 1002
    ---+- Quantidade: 1
    ---+- Valor: 1000.00


Teste 2: Buscar pedido inexistente
Buscando order_id: pedido-nao-existe-12345
OK ---+- Retornou null corretamente para pedido inexistente


Testes concluídos com sucesso!
Pedido de teste: v10089017vdb-buscar-1764512099573
```

## 7 Listar Todos os Pedidos

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node tests/testListarPedidos.js
Testando listar todos os pedidos
```
Criando pedidos de teste...
Conectado ao PostgreSQL (Render.com)
Pedido inserido com ID: 3
Item inserido com ID: 5
Transação confirmada com sucesso
OK - Pedido 1 criado: v10089018vdb-list-1-1764512749652
Pedido inserido com ID: 4
Item inserido com ID: 6
Item inserido com ID: 7
Transação confirmada com sucesso
OK - Pedido 2 criado: v10089019vdb-list-2-1764512749653
Teste: Listando todos os pedidos do banco...
OK - Total de pedidos encontrados: 4
```
Listagem dos pedidos:

============================================================
```
Pedido 1:
  Order ID: v10089019vdb-list-2-1764512749653
  Valor Total: 7500.00
  Data Criação: 2025-11-30T17:25:49.653Z
  Criado em: 2025-11-30T17:25:52.632Z
  Quantidade de itens: 2
  Itens:
    1. ID: 3002 | Qtd: 2 | Valor: 3000.00
    2. ID: 3003 | Qtd: 1 | Valor: 1500.00

Pedido 2:
  Order ID: v10089018vdb-list-1-1764512749652
  Valor Total: 5000.00
  Data Criação: 2025-11-30T17:25:49.652Z
  Criado em: 2025-11-30T17:25:51.900Z
  Quantidade de itens: 1
  Itens:
    1. ID: 3001 | Qtd: 1 | Valor: 5000.00

Pedido 3:
  Order ID: v10089017vdb-buscar-1764512099573
  Valor Total: 8500.00
  Data Criação: 2025-11-30T17:14:59.573Z
  Criado em: 2025-11-30T17:15:01.819Z
  Quantidade de itens: 2
  Itens:
    1. ID: 1001 | Qtd: 3 | Valor: 2500.00
    2. ID: 1002 | Qtd: 1 | Valor: 1000.00

Pedido 4:
  Order ID: v10089016vdb-test-1764510460809
  Valor Total: 15000.00
  Data Criação: 2025-11-30T16:47:40.809Z
  Criado em: 2025-11-30T16:47:42.947Z
  Quantidade de itens: 2
  Itens:
    1. ID: 2434 | Qtd: 2 | Valor: 5000.00
    2. ID: 2435 | Qtd: 1 | Valor: 5000.00
```
============================================================


Teste finalizado com sucesso!

## 8 Funcionalidade Atualizando o  Pedido Update

```
PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node tests/testAtualizarPedido.js    
Testando atualizar pedido 

Criando pedido inicial...
Conectado ao PostgreSQL (Render.com)
Pedido inserido com ID: 5
Item inserido com ID: 8
Transação confirmada com sucesso
OK - Pedido criado: v10089020vdb-update-1764519511570
Valor inicial: 10000
Itens iniciais: 1
 Buscando pedido antes da atualização...
OK - Pedido encontrado
Valor: 10000.00
Quantidade de itens: 1
Atualizando pedido...
OK - Pedido atualizado com sucesso!
Comparação:
Valor ANTES: 10000.00
Valor DEPOIS: 15000.00
Itens ANTES: 1
Itens DEPOIS: 2
Novos itens:
  Item 1:
 - ID: 4001
 - Quantidade: 3
 - Valor: 5000.00
  Item 2:
 - ID: 4002
 - Quantidade: 1
 - Valor: 5000.00

Tentar atualizar pedido inexistente
Tentando atualizar order_id: pedido-nao-existe-999
OK - Retornou null corretamente para pedido inexistente


Testes concluídos com sucesso!
Pedido de teste: v10089020vdb-update-1764519511570
```


## 9 Funcionalidade Deleta 

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node tests/testDeletarPedido.js
Testando deletar pedido
```
Criando pedido de teste...
Conectado ao PostgreSQL (Render.com)
Pedido inserido com ID: 6
Item inserido com ID: 11
Transação confirmada com sucesso
OK - Pedido criado: v10089021vdb-delete-1764519911358
Verificando que o pedido existe...
OK - Pedido confirmado no banco
  Order ID: v10089021vdb-delete-1764519911358
  Valor: 6000.00
  Itens: 1
Deletando pedido...
OK - Pedido deletado com sucesso!
Verificando que o pedido foi deletado...
OK - Pedido não existe mais no banco (deletado corretamente)
Tentar deletar pedido inexistente
Tentando deletar order_id: pedido-nao-existe-777
OK - Retornou false corretamente para pedido inexistente

```
Pedido de teste deletado: v10089021vdb-delete-1764519911358