#  API RESTful de Gerenciamento de Pedidos

> **Sistema completo de gestão de pedidos com autenticação JWT, documentação Swagger e banco de dados PostgreSQL**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange.svg)](https://jwt.io/)
[![Swagger](https://img.shields.io/badge/Swagger-Docs-green.svg)](https://swagger.io/)
[![License](https://img.shields.io/badge/License-ISC-yellow.svg)](LICENSE)


##  Descrição do Projeto

Esta é uma **API RESTful robusta** desenvolvida com Node.js e Express para gerenciamento completo de pedidos. O sistema oferece autenticação segura via JWT, documentação interativa com Swagger UI, persistência de dados em PostgreSQL hospedado no Render.com, e uma arquitetura MVC bem estruturada com separação de responsabilidades.

###  Características Principais

-  **Autenticação JWT** - Sistema seguro de login e registro com tokens
-  **Documentação Swagger** - Interface interativa para testar todos os endpoints
-  **PostgreSQL** - Banco de dados robusto hospedado no Render.com
-  **Arquitetura MVC** - Código organizado e escalável
-  **Validação de Dados** - Validações rigorosas em todas as entradas
-  **Criptografia** - Senhas protegidas com bcrypt
-  **Testes Automatizados** - Suite de testes com Jest
-  **Logs Detalhados** - Rastreamento completo de requisições
-  **Deploy Ready** - Pronto para produção no Render.com

---

##  Início Rápido

### Pré-requisitos

- Node.js 18.x ou superior
- PostgreSQL 14+ (ou use o Render.com)
- npm ou yarn

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/api-pedidos.git
cd api-pedidos

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# 4. Crie as tabelas no banco de dados
npm run create-tables
npm run create-users-table

# 5. Inicie o servidor
npm run dev
```

### Acesso Rápido

-  **API Local**: http://localhost:3000
-  **API Deploy Online**: https://processo-seletivo-jitterbit.onrender.com/
-  **Documentação Swagger (Local)**: http://localhost:3000/api-docs
-  **Documentação Swagger (Online)**: https://processo-seletivo-jitterbit.onrender.com/api-docs
-  **Health Check (Local)**: http://localhost:3000/health
-  **Health Check (Online)**: https://processo-seletivo-jitterbit.onrender.com/health

---

##  Lista Completa de Rotas

###  Rotas Gerais (Públicas)

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `GET` | `/` | Informações da API e endpoints disponíveis |  Não |
| `GET` | `/health` | Status de saúde da API e conexão com banco |  Não |
| `GET` | `/api-docs` | Documentação interativa Swagger UI |  Não |

**Links Rápidos**:
- Local: http://localhost:3000/
- Online: https://processo-seletivo-jitterbit.onrender.com/

---

###  Rotas de Autenticação

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `POST` | `/auth/register` | Registrar novo usuário e receber token |  Não |
| `POST` | `/auth/login` | Fazer login e receber token JWT |  Não |
| `GET` | `/auth/me` | Obter dados do usuário autenticado |  Sim |

**Links Rápidos**:
- **Registrar**: 
  - Local: `POST http://localhost:3000/auth/register`
  - Online: `POST https://processo-seletivo-jitterbit.onrender.com/auth/register`

- **Login**: 
  - Local: `POST http://localhost:3000/auth/login`
  - Online: `POST https://processo-seletivo-jitterbit.onrender.com/auth/login`

- **Perfil**: 
  - Local: `GET http://localhost:3000/auth/me`
  - Online: `GET https://processo-seletivo-jitterbit.onrender.com/auth/me`

---

###  Rotas de Pedidos (Requerem Token)

| Método | Rota | Descrição | Autenticação |
|--------|------|-----------|--------------|
| `POST` | `/order` | Criar novo pedido |  Sim |
| `GET` | `/order/list` | Listar todos os pedidos |  Sim |
| `GET` | `/order/:orderId` | Buscar pedido específico por ID |  Sim |
| `PUT` | `/order/:orderId` | Atualizar pedido existente |  Sim |
| `DELETE` | `/order/:orderId` | Deletar pedido |  Sim |

**Links Rápidos**:
- **Criar Pedido**: 
  - Local: `POST http://localhost:3000/order`
  - Online: `POST https://processo-seletivo-jitterbit.onrender.com/order`

- **Listar Pedidos**: 
  - Local: `GET http://localhost:3000/order/list`
  - Online: `GET https://processo-seletivo-jitterbit.onrender.com/order/list`

- **Buscar Pedido**: 
  - Local: `GET http://localhost:3000/order/{numeroPedido}`
  - Online: `GET https://processo-seletivo-jitterbit.onrender.com/order/{numeroPedido}`

- **Atualizar Pedido**: 
  - Local: `PUT http://localhost:3000/order/{numeroPedido}`
  - Online: `PUT https://processo-seletivo-jitterbit.onrender.com/order/{numeroPedido}`

- **Deletar Pedido**: 
  - Local: `DELETE http://localhost:3000/order/{numeroPedido}`
  - Online: `DELETE https://processo-seletivo-jitterbit.onrender.com/order/{numeroPedido}`

---

###  Resumo de Rotas

```
Total de Rotas: 11

   Rotas Públicas (sem autenticação): 5
   - GET  /
   - GET  /health
   - GET  /api-docs
   - POST /auth/register
   - POST /auth/login

   Rotas Protegidas (requerem token JWT): 6
   - GET    /auth/me
   - POST   /order
   - GET    /order/list
   - GET    /order/:orderId
   - PUT    /order/:orderId
   - DELETE /order/:orderId
```

---

###  Como Autenticar nas Rotas Protegidas

Para acessar rotas que requerem autenticação, inclua o token no header:

```bash
Authorization: Bearer SEU_TOKEN_AQUI
```

**Exemplo com cURL**:
```bash
curl -X GET http://localhost:3000/order/list \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Exemplo com Postman**:
1. Authorization → Type: Bearer Token
2. Token: Cole seu token
3. Enviar requisição

**Exemplo com Swagger**:
1. Clique no botão "Authorize" 
2. Digite: `Bearer SEU_TOKEN_AQUI`
3. Clique em "Authorize"
4. Todas as rotas protegidas agora funcionam

---

##  Documentação das Rotas

###  Rotas de Autenticação

Todas as rotas de autenticação são **públicas** (não requerem token).

#### 1. Registrar Novo Usuário

**Endpoint**: `POST /auth/register`

**Descrição**: Cria uma nova conta de usuário no sistema.

**Body (JSON)**:
```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (201)**:
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "criadoEm": "2024-11-30T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "senha": "senha123"
  }'
```

**Swagger**:
1. Acesse http://localhost:3000/api-docs
2. Expanda `POST /auth/register`
3. Clique em "Try it out"
4. Edite o JSON de exemplo
5. Clique em "Execute"
6. Copie o token da resposta

**Postman**:
1. Método: POST
2. URL: `http://localhost:3000/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw): Cole o JSON acima
5. Send

---

#### 2. Fazer Login

**Endpoint**: `POST /auth/login`

**Descrição**: Autentica um usuário e retorna um token JWT válido por 24 horas.

**Body (JSON)**:
```json
{
  "email": "joao@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@exemplo.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "senha123"
  }'
```

**Swagger**:
1. Expanda `POST /auth/login`
2. "Try it out"
3. Edite email e senha
4. "Execute"
5. **IMPORTANTE**: Copie o token para usar nas próximas requisições

**Postman**:
1. POST `http://localhost:3000/auth/login`
2. Body (raw JSON): Cole o JSON
3. Send
4. Copie o token da resposta

---

#### 3. Obter Perfil do Usuário

**Endpoint**: `GET /auth/me`

**Descrição**: Retorna os dados do usuário autenticado.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "criadoEm": "2024-11-30T10:00:00.000Z"
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Swagger**:
1. Clique no botão **"Authorize"**  (topo da página)
2. Digite: `Bearer SEU_TOKEN_AQUI`
3. "Authorize" → "Close"
4. Expanda `GET /auth/me`
5. "Try it out" → "Execute"

**Postman**:
1. GET `http://localhost:3000/auth/me`
2. Authorization → Type: Bearer Token
3. Token: Cole seu token
4. Send

---
---


##  Documentação das Rotas

###  Rotas de Autenticação

Todas as rotas de autenticação são **públicas** (não requerem token).

#### 1. Registrar Novo Usuário

**Endpoint**: `POST /auth/register`

**Descrição**: Cria uma nova conta de usuário no sistema.

**Body (JSON)**:
```json
{
  "nome": "João Silva",
  "email": "joao@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (201)**:
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "data": {
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@exemplo.com",
      "criadoEm": "2024-11-30T10:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "senha": "senha123"
  }'
```

**Swagger**:
1. Acesse http://localhost:3000/api-docs
2. Expanda `POST /auth/register`
3. Clique em "Try it out"
4. Edite o JSON de exemplo
5. Clique em "Execute"
6. Copie o token da resposta

**Postman**:
1. Método: POST
2. URL: `http://localhost:3000/auth/register`
3. Headers: `Content-Type: application/json`
4. Body (raw): Cole o JSON acima
5. Send

---

#### 2. Fazer Login

**Endpoint**: `POST /auth/login`

**Descrição**: Autentica um usuário e retorna um token JWT válido por 24 horas.

**Body (JSON)**:
```json
{
  "email": "joao@exemplo.com",
  "senha": "senha123"
}
```

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "usuario": {
      "id": 1,
      "nome": "João Silva",
      "email": "joao@exemplo.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "senha123"
  }'
```

**Swagger**:
1. Expanda `POST /auth/login`
2. "Try it out"
3. Edite email e senha
4. "Execute"
5. **IMPORTANTE**: Copie o token para usar nas próximas requisições

**Postman**:
1. POST `http://localhost:3000/auth/login`
2. Body (raw JSON): Cole o JSON
3. Send
4. Copie o token da resposta

---

#### 3. Obter Perfil do Usuário

**Endpoint**: `GET /auth/me`

**Descrição**: Retorna os dados do usuário autenticado.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "criadoEm": "2024-11-30T10:00:00.000Z"
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Swagger**:
1. Clique no botão **"Authorize"**  (topo da página)
2. Digite: `Bearer SEU_TOKEN_AQUI`
3. "Authorize" → "Close"
4. Expanda `GET /auth/me`
5. "Try it out" → "Execute"

**Postman**:
1. GET `http://localhost:3000/auth/me`
2. Authorization → Type: Bearer Token
3. Token: Cole seu token
4. Send

---

###  Rotas de Pedidos

Todas as rotas de pedidos **requerem autenticação** (token JWT).

#### 4. Criar Novo Pedido

**Endpoint**: `POST /order`

**Descrição**: Cria um novo pedido no sistema com seus respectivos itens.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Body (JSON)**:
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 10000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 2,
      "valorItem": 5000
    },
    {
      "idItem": "2435",
      "quantidadeItem": 1,
      "valorItem": 5000
    }
  ]
}
```

**Resposta de Sucesso (201)**:
```json
{
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "id": 1,
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "id": 1,
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 5000
      },
      {
        "id": 2,
        "idItem": "2435",
        "quantidadeItem": 1,
        "valorItem": 5000
      }
    ],
    "criadoEm": "2024-11-30T10:00:00.000Z",
    "atualizadoEm": "2024-11-30T10:00:00.000Z"
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X POST http://localhost:3000/order \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 5000
      }
    ]
  }'
```

**Swagger** (após autenticar):
1. Expanda `POST /order`
2. "Try it out"
3. Edite o JSON
4. "Execute"

**Postman**:
1. POST `http://localhost:3000/order`
2. Authorization: Bearer Token (com seu token)
3. Body (raw JSON): Cole o JSON
4. Send

---

#### 5. Listar Todos os Pedidos

**Endpoint**: `GET /order/list`

**Descrição**: Retorna todos os pedidos cadastrados no sistema com seus itens.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "message": "5 pedido(s) encontrado(s)",
  "data": [
    {
      "id": 1,
      "numeroPedido": "v10089015vdb-01",
      "valorTotal": 10000,
      "dataCriacao": "2023-07-19T12:24:11.529Z",
      "items": [
        {
          "id": 1,
          "idItem": "2434",
          "quantidadeItem": 2,
          "valorItem": 5000
        }
      ],
      "criadoEm": "2024-11-30T10:00:00.000Z",
      "atualizadoEm": "2024-11-30T10:00:00.000Z"
    }
  ]
}
```

**Como Testar**:

**cURL**:
```bash
curl -X GET http://localhost:3000/order/list \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Swagger**:
1. Expanda `GET /order/list`
2. "Try it out" → "Execute"

**Postman**:
1. GET `http://localhost:3000/order/list`
2. Authorization: Bearer Token
3. Send

---

#### 6. Buscar Pedido Específico

**Endpoint**: `GET /order/:orderId`

**Descrição**: Retorna os detalhes de um pedido específico pelo seu número.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Parâmetros de URL**:
- `orderId`: Número do pedido (ex: v10089015vdb-01)

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "message": "Pedido encontrado",
  "data": {
    "id": 1,
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 10000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "id": 1,
        "idItem": "2434",
        "quantidadeItem": 2,
        "valorItem": 5000
      }
    ],
    "criadoEm": "2024-11-30T10:00:00.000Z",
    "atualizadoEm": "2024-11-30T10:00:00.000Z"
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X GET http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Swagger**:
1. Expanda `GET /order/{orderId}`
2. "Try it out"
3. Digite o número do pedido em `orderId`
4. "Execute"

**Postman**:
1. GET `http://localhost:3000/order/v10089015vdb-01`
2. Authorization: Bearer Token
3. Send

---

#### 7. Atualizar Pedido

**Endpoint**: `PUT /order/:orderId`

**Descrição**: Atualiza os dados de um pedido existente, incluindo seus itens.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
Content-Type: application/json
```

**Parâmetros de URL**:
- `orderId`: Número do pedido a ser atualizado

**Body (JSON)**:
```json
{
  "numeroPedido": "v10089015vdb-01",
  "valorTotal": 15000,
  "dataCriacao": "2023-07-19T12:24:11.529Z",
  "items": [
    {
      "idItem": "2434",
      "quantidadeItem": 3,
      "valorItem": 5000
    }
  ]
}
```

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "message": "Pedido atualizado com sucesso",
  "data": {
    "id": 1,
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "id": 3,
        "idItem": "2434",
        "quantidadeItem": 3,
        "valorItem": 5000
      }
    ],
    "criadoEm": "2024-11-30T10:00:00.000Z",
    "atualizadoEm": "2024-11-30T10:05:00.000Z"
  }
}
```

**Como Testar**:

**cURL**:
```bash
curl -X PUT http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroPedido": "v10089015vdb-01",
    "valorTotal": 15000,
    "dataCriacao": "2023-07-19T12:24:11.529Z",
    "items": [
      {
        "idItem": "2434",
        "quantidadeItem": 3,
        "valorItem": 5000
      }
    ]
  }'
```

**Swagger**:
1. Expanda `PUT /order/{orderId}`
2. "Try it out"
3. Digite o `orderId`
4. Edite o JSON
5. "Execute"

**Postman**:
1. PUT `http://localhost:3000/order/v10089015vdb-01`
2. Authorization: Bearer Token
3. Body (raw JSON): Cole o JSON
4. Send

---

#### 8. Deletar Pedido

**Endpoint**: `DELETE /order/:orderId`

**Descrição**: Remove permanentemente um pedido e todos os seus itens do sistema.

**Headers**:
```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Parâmetros de URL**:
- `orderId`: Número do pedido a ser deletado

**Resposta de Sucesso (200)**:
```json
{
  "success": true,
  "message": "Pedido v10089015vdb-01 deletado com sucesso"
}
```

**Como Testar**:

**cURL**:
```bash
curl -X DELETE http://localhost:3000/order/v10089015vdb-01 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**Swagger**:
1. Expanda `DELETE /order/{orderId}`
2. "Try it out"
3. Digite o `orderId`
4. "Execute"

**Postman**:
1. DELETE `http://localhost:3000/order/v10089015vdb-01`
2. Authorization: Bearer Token
3. Send

---

##  Descrição das Funcionalidades

###  Sistema de Autenticação

**Registro de Usuário** (`POST /auth/register`)
- Cria uma nova conta de usuário no sistema
- Valida formato de email e força mínima da senha
- Criptografa a senha usando bcrypt (hash seguro)
- Retorna automaticamente um token JWT para uso imediato
- Previne emails duplicados no banco de dados

**Login** (`POST /auth/login`)
- Autentica usuário com email e senha
- Compara senha fornecida com hash armazenado
- Gera token JWT válido por 24 horas
- Token contém ID e email do usuário
- Retorna dados do usuário junto com o token

**Perfil do Usuário** (`GET /auth/me`)
- Retorna informações do usuário autenticado
- Valida token JWT antes de retornar dados
- Busca dados atualizados do banco de dados
- Não expõe informações sensíveis (senha)

###  Gerenciamento de Pedidos

**Criar Pedido** (`POST /order`)
- Cria novo pedido com múltiplos itens
- Valida todos os campos obrigatórios
- Usa transação de banco para garantir consistência
- Previne duplicação de número de pedido
- Retorna pedido completo com IDs gerados

**Listar Pedidos** (`GET /order/list`)
- Retorna todos os pedidos do sistema
- Inclui todos os itens de cada pedido
- Ordenados por data de criação (mais recentes primeiro)
- Retorna contador total de pedidos
- Formato otimizado para exibição em listas

**Buscar Pedido** (`GET /order/:orderId`)
- Localiza pedido específico pelo número
- Retorna detalhes completos do pedido
- Inclui todos os itens associados
- Retorna erro 404 se não encontrado
- Útil para detalhamento e impressão

**Atualizar Pedido** (`PUT /order/:orderId`)
- Atualiza dados de um pedido existente
- Substitui completamente os itens anteriores
- Usa transação para garantir atomicidade
- Valida existência do pedido antes de atualizar
- Atualiza timestamp de modificação automaticamente

**Deletar Pedido** (`DELETE /order/:orderId`)
- Remove pedido e todos os seus itens
- Usa CASCADE para deletar itens relacionados
- Operação irreversível
- Retorna confirmação de exclusão
- Útil para cancelamentos e limpezas

###  Segurança e Validação

**Middleware de Autenticação**
- Valida formato do token (Bearer)
- Verifica assinatura e expiração do JWT
- Adiciona dados do usuário à requisição
- Bloqueia acesso não autorizado
- Retorna erros claros e específicos

**Validação de Dados**
- Valida tipos de dados em todas as entradas
- Verifica campos obrigatórios
- Valida formatos (email, datas, números)
- Previne SQL injection com queries parametrizadas
- Sanitiza dados antes de salvar no banco

**Tratamento de Erros**
- Captura e trata todos os erros da aplicação
- Retorna mensagens descritivas ao cliente
- Oculta detalhes internos em produção
- Registra erros em logs para debug
- Retorna status HTTP apropriados

###  Documentação Swagger

**Interface Interativa**
- Documenta todos os endpoints da API
- Permite testar requisições direto no navegador
- Mostra exemplos de request e response
- Valida dados antes de enviar
- Suporta autenticação JWT integrada

**Esquemas de Dados**
- Define estrutura de todos os objetos
- Documenta campos obrigatórios e opcionais
- Especifica tipos e formatos de dados
- Fornece exemplos realistas
- Facilita integração com outras aplicações

###  Banco de Dados

**PostgreSQL**
- Banco relacional robusto e confiável
- Transações ACID para consistência
- Índices para otimização de buscas
- Constraints para integridade de dados
- Timestamps automáticos de criação/atualização

**Pool de Conexões**
- Gerencia múltiplas conexões simultâneas
- Reutiliza conexões para performance
- Reconecta automaticamente em caso de falha
- Configurado para ambiente de produção
- Suporta SSL para segurança

---

##  Testes

```bash
# Executar todos os testes
npm test

# Executar testes em modo watch
npm run test:watch

# Gerar relatório de cobertura
npm run test:coverage

# Testes verbosos (mais detalhes)
npm run test:verbose
```

---



##  Variáveis de Ambiente

```env
# Banco de Dados
DATABASE_URL=postgresql://usuario:senha@host/database

# Servidor
PORT=3000
NODE_ENV=development

# JWT
JWT_SECRET=sua_chave_secreta_forte_aqui
```

---



##  Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abra um Pull Request

---



##  Autor

**Everton Eduardo**

- GitHub: [@evertonProgramadorCriativo](https://github.com/evertonProgramadorCriativo)
- LinkedIn: [Seu LinkedIn](https://www.linkedin.com/in/evertoneduardodesenvolvedor/)
- Projeto Online: [Veja o Site Online](https://processo-seletivo-jitterbit.onrender.com/)

---

##  Agradecimentos

- Jitterbit pelo desafio técnico
- Comunidade Node.js
- Documentação do Express.js
- Render.com pelo hosting gratuito

---

**Se este projeto foi útil, considere dar uma estrela!**

Primeiro Teste do Servido com Deploy do render.com

**npm run test**

Segundo Teste Criar as Tabelas (Pedidos e Itens).


 **npm run create-tables**

  Tabelas existentes no banco:
   - itens_pedido
   - pedidos


Outros Comandos 

Criar tabelas
**npm run create-tables**

 Deletar todas as tabelas

**npm run delete-tables**

Resetar banco (deletar e criar novamente)

**npm run reset-db**

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

### Mapeamento de pedido válido

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

## Camada de Controller (Lógica de Negócio)

Os **Controllers** são responsáveis por:

**Receber** requisições HTTP
**Validar** dados de entrada
**Chamar** os Models
**Transformar** dados (usar Mapper)
Retornar respostas HTTP adequadas
Tratar erros

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> node controllers/pedidoController.js 
Testando Controllers...

Criar Pedido Controller
==================================================
Controller: Criando novo pedido...
```
Body recebido: {
  "numeroPedido": "v10089022vdb-controller-1764520950833",
  "valorTotal": 12000,
  "dataCriacao": "2025-11-30T16:42:30.833Z",
  "items": [
    {
      "idItem": "6001",
      "quantidadeItem": 2,
      "valorItem": 6000
    }
  ]
}
Dados mapeados com sucesso
Conectado ao PostgreSQL (Render.com)
Pedido inserido com ID: 7
Item inserido com ID: 12
Transação confirmada com sucesso
Pedido criado no banco com ID: 7

Resposta HTTP:
Status: 201

```

```
Body: {
  "success": true,
  "message": "Pedido criado com sucesso",
  "data": {
    "id": 7,
    "numeroPedido": "v10089022vdb-controller-1764520950833",
    "valorTotal": 12000,
    "dataCriacao": "2025-11-30T19:42:30.833Z",
    "items": [
      {
        "id": 12,
        "idItem": "6001",
        "quantidadeItem": 2,
        "valorItem": 6000
      }
    ],
    "criadoEm": "2025-11-30T19:42:33.283Z",
    "atualizadoEm": "2025-11-30T19:42:33.283Z"
  }
}

OK - Pedido criado com sucesso via controller

```

```
 Obter Pedido Controller
==================================================
Controller: Buscando pedido: v10089022vdb-controller-1764520950833
Pedido encontrado: v10089022vdb-controller-1764520950833

Resposta HTTP:
Status: 200
Body: {
  "success": true,
  "message": "Pedido encontrado",
  "data": {
    "id": 7,
    "numeroPedido": "v10089022vdb-controller-1764520950833",
    "valorTotal": 12000,
    "dataCriacao": "2025-11-30T19:42:30.833Z",
    "items": [
      {
        "id": 12,
        "idItem": "6001",
        "quantidadeItem": 2,
        "valorItem": 6000
      }
    ],
    "criadoEm": "2025-11-30T19:42:33.283Z",
    "atualizadoEm": "2025-11-30T19:42:33.283Z"
  }
}

OK - Pedido encontrado via controller
```

 Listar Pedidos Controller
==================================================
```
Controller: Listando todos os pedidos...
Total de pedidos encontrados: 6

Resposta HTTP:
Status: 200
Body: {
  "success": true,
  "message": "6 pedido(s) encontrado(s)",
  "data": [
    {
      "id": 7,
      "numeroPedido": "v10089022vdb-controller-1764520950833",
      "valorTotal": 12000,
      "dataCriacao": "2025-11-30T19:42:30.833Z",
      "items": [
        {
          "id": 12,
          "idItem": "6001",
          "quantidadeItem": 2,
          "valorItem": 6000
        }
      ],
      "criadoEm": "2025-11-30T19:42:33.283Z",
      "atualizadoEm": "2025-11-30T19:42:33.283Z"
    },
    {
      "id": 5,
      "numeroPedido": "v10089020vdb-update-1764519511570",
      "valorTotal": 15000,
      "dataCriacao": "2025-11-30T19:18:33.824Z",
      "items": [
        {
          "id": 9,
          "idItem": "4001",
          "quantidadeItem": 3,
          "valorItem": 5000
        },
        {
          "id": 10,
          "idItem": "4002",
          "quantidadeItem": 1,
          "valorItem": 5000
        }
      ],
      "criadoEm": "2025-11-30T19:18:33.857Z",
      "atualizadoEm": "2025-11-30T19:18:34.953Z"
    },
    {
      "id": 4,
      "numeroPedido": "v10089019vdb-list-2-1764512749653",
      "valorTotal": 7500,
      "dataCriacao": "2025-11-30T17:25:49.653Z",
      "items": [
        {
          "id": 6,
          "idItem": "3002",
          "quantidadeItem": 2,
          "valorItem": 3000
        },
        {
          "id": 7,
          "idItem": "3003",
          "quantidadeItem": 1,
          "valorItem": 1500
        }
      ],
      "criadoEm": "2025-11-30T17:25:52.632Z",
      "atualizadoEm": "2025-11-30T17:25:52.632Z"
    },
    {
      "id": 3,
      "numeroPedido": "v10089018vdb-list-1-1764512749652",
      "valorTotal": 5000,
      "dataCriacao": "2025-11-30T17:25:49.652Z",
      "items": [
        {
          "id": 5,
          "idItem": "3001",
          "quantidadeItem": 1,
          "valorItem": 5000
        }
      ],
      "criadoEm": "2025-11-30T17:25:51.900Z",
      "atualizadoEm": "2025-11-30T17:25:51.900Z"
    },
    {
      "id": 2,
      "numeroPedido": "v10089017vdb-buscar-1764512099573",
      "valorTotal": 8500,
      "dataCriacao": "2025-11-30T17:14:59.573Z",
      "items": [
        {
          "id": 3,
          "idItem": "1001",
          "quantidadeItem": 3,
          "valorItem": 2500
        },
        {
          "id": 4,
          "idItem": "1002",
          "quantidadeItem": 1,
          "valorItem": 1000
        }
      ],
      "criadoEm": "2025-11-30T17:15:01.819Z",
      "atualizadoEm": "2025-11-30T17:15:01.819Z"
    },
    {
      "id": 1,
      "numeroPedido": "v10089016vdb-test-1764510460809",
      "valorTotal": 15000,
      "dataCriacao": "2025-11-30T16:47:40.809Z",
      "items": [
        {
          "id": 1,
          "idItem": "2434",
          "quantidadeItem": 2,
          "valorItem": 5000
        },
        {
          "id": 2,
          "idItem": "2435",
          "quantidadeItem": 1,
          "valorItem": 5000
        }
      ],
      "criadoEm": "2025-11-30T16:47:42.947Z",
      "atualizadoEm": "2025-11-30T16:47:42.947Z"
    }
  ]
}

OK - Listagem realizada via controller
```

 ## 10 API DE GERENCIAMENTO DE PEDIDOS ,Configuração das  Rotas (Express Router) e Criando Servidor Express


 Node.js v22.14.0
[nodemon] app crashed - waiting for file changes before starting...
[nodemon] restarting due to changes...
[nodemon] starting `node server.js`
Verificando conexão com banco de dados...
Conectado ao PostgreSQL (Render.com)
Teste de conexão bem-sucedido!
Hora do servidor: 2025-11-30T17:04:07.665Z
```
  
API DE GERENCIAMENTO DE PEDIDOS
  
Servidor rodando na porta: 3000
URL: http://localhost:3000
Ambiente: development
  
Endpoints disponíveis:
  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
  






  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
  



  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
  

  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
  


  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
  POST   http://localhost:3000/order
  GET    http://localhost:3000/order/:orderId
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
  GET    http://localhost:3000/order/list
  PUT    http://localhost:3000/order/:orderId
  DELETE http://localhost:3000/order/:orderId
  
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 
Pressione Ctrl+C para parar o servidor
Rotas auxiliares:
  GET    http://localhost:3000/
  GET    http://localhost:3000/health
  
 

  

```

## testando com CUrl
```
curl http://localhost:3000


StatusCode        : 200
StatusDescription : OK 
Content           : {"success":true,"message":"API de Gerenciamento de
                    Pedidos","version":"1.0.0","endpoints":{"criar_pedido":"POST
                    /order","obter_pedido":"GET /order/:orderId","listar_pedidos":"GET
                    /order/list","atualiz...
RawContent        : HTTP/1.1 200 OK
                    Access-Control-Allow-Origin: *
                    Connection: keep-alive
                    Keep-Alive: timeout=5
                    Content-Length: 368
                    Content-Type: application/json; charset=utf-8
                    Date: Sun, 30 Nov 2025 17:10:39 GMT...
Forms             : {}
Headers           : {[Access-Control-Allow-Origin, *], [Connection, keep-alive], [Keep-Alive, timeout=5],    
                    [Content-Length, 368]...}
Images            : {}
InputFields       : {}
Links             : {}
ParsedHtml        : System.__ComObject
RawContentLength  : 368


```


## 11 Usando Biblioteca Jest 

PS C:\Users\ogum\Documents\projetos-postefolio\projeto-pedidos-api\src> 
### npm test
```
npm test

> pedidos-api@1.0.0 test
> jest

 PASS  utils/mapper.test.js
  Mapper - mapearPedidoParaBanco
    √ deve mapear pedido válido corretamente (6 ms)
    √ deve lançar erro quando numeroPedido está ausente (23 ms)
    √ deve lançar erro quando valorTotal está ausente (2 ms)
    √ deve lançar erro quando dataCriacao está ausente (2 ms)
    √ deve lançar erro quando items está vazio (2 ms)
    √ deve lançar erro quando items não é um array (1 ms)
    √ deve lançar erro quando item não possui idItem (1 ms)
    √ deve lançar erro quando pedido é null (1 ms)
    √ deve converter strings numéricas corretamente (1 ms)
  Mapper - mapearPedidoParaAPI
    √ deve mapear pedido do banco para API corretamente (2 ms)
    √ deve retornar null quando pedido do banco é null (1 ms)
    √ deve mapear pedido com array de itens vazio (1 ms)
    √ deve converter valores string do banco para number (1 ms)
  Mapper - validarNumero
    √ deve validar número positivo corretamente (2 ms)
    √ deve lançar erro para número negativo (1 ms)
    √ deve lançar erro para valor não numérico (1 ms)
  Mapper - validarData
    √ deve validar data válida corretamente (1 ms)
    √ deve lançar erro para data inválida (1 ms)
    √ deve aceitar objeto Date (1 ms)

Test Suites: 1 passed, 1 total
Tests:       19 passed, 19 total
Snapshots:   0 total
Time:        0.616 s, estimated 1 s
Ran all test suites.

```


