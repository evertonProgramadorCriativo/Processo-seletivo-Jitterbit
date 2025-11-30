const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Gerenciamento de Pedidos',
      version: '1.0.0',
      description: `
        API RESTful para gerenciamento de pedidos com autenticação JWT.
        
        ## Autenticação
        Esta API usa JWT (JSON Web Tokens) para autenticação.
        
        ### Como usar:
        1. Registre um usuário em POST /auth/register
        2. Faça login em POST /auth/login para receber o token
        3. Use o token no header: Authorization: Bearer {seu_token}
        4. Acesse as rotas protegidas com o token
        
        ## Recursos Principais
        - Gerenciamento completo de pedidos (CRUD)
        - Autenticação e autorização com JWT
        - Documentação interativa com Swagger
      `,
      contact: {
        name: 'Everton Eduardo',
        email: 'evertonprogramadorcriativo@gmail.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://processo-seletivo-jitterbit.onrender.com/',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Insira o token JWT recebido no login'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          required: ['nome', 'email', 'senha'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID do usuário',
              example: 1
            },
            nome: {
              type: 'string',
              description: 'Nome completo do usuário',
              example: 'João Silva'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email do usuário',
              example: 'joao@exemplo.com'
            },
            senha: {
              type: 'string',
              format: 'password',
              description: 'Senha do usuário (mínimo 6 caracteres)',
              example: 'senha123'
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
              example: '2024-11-30T10:00:00Z'
            }
          }
        },
        Pedido: {
          type: 'object',
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID interno do pedido',
              example: 1
            },
            numeroPedido: {
              type: 'string',
              description: 'Número único do pedido',
              example: 'v10089015vdb-01'
            },
            valorTotal: {
              type: 'number',
              format: 'float',
              description: 'Valor total do pedido',
              example: 10000.00
            },
            dataCriacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do pedido',
              example: '2023-07-19T12:24:11.529Z'
            },
            items: {
              type: 'array',
              description: 'Lista de itens do pedido',
              items: {
                $ref: '#/components/schemas/ItemPedido'
              }
            },
            criadoEm: {
              type: 'string',
              format: 'date-time',
              example: '2024-11-30T10:00:00Z'
            },
            atualizadoEm: {
              type: 'string',
              format: 'date-time',
              example: '2024-11-30T10:00:00Z'
            }
          }
        },
        ItemPedido: {
          type: 'object',
          required: ['idItem', 'quantidadeItem', 'valorItem'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID interno do item',
              example: 1
            },
            idItem: {
              type: 'string',
              description: 'ID do item/produto',
              example: '2434'
            },
            quantidadeItem: {
              type: 'integer',
              description: 'Quantidade do item',
              example: 2
            },
            valorItem: {
              type: 'number',
              format: 'float',
              description: 'Valor unitário do item',
              example: 5000.00
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  example: 'Mensagem de erro'
                },
                statusCode: {
                  type: 'integer',
                  example: 400
                }
              }
            }
          }
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Token de autenticação ausente ou inválido',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  message: 'Token não fornecido',
                  statusCode: 401
                }
              }
            }
          }
        },
        NotFoundError: {
          description: 'Recurso não encontrado',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                success: false,
                error: {
                  message: 'Pedido não encontrado',
                  statusCode: 404
                }
              }
            }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: [
    './routes/*.js',
    './controllers/*.js'
  ]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

const swaggerSetup = {
  swaggerDocs,
  swaggerUi,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Pedidos - Documentação',
  customfavIcon: '/favicon.ico'
};

module.exports = swaggerSetup;