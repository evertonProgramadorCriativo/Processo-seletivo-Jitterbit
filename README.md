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

 # Criar tabelas
npm run create-tables

# Deletar todas as tabelas
npm run delete-tables

# Resetar banco (deletar e criar novamente)
npm run reset-db