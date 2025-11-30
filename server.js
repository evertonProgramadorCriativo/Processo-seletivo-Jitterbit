require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importar configurações e middlewares
const { testarConexao } = require('./config/database');
const { 
  errorHandler, 
  notFoundHandler,
  jsonErrorHandler 
} = require('./middlewares/errorHandler');

const swaggerSetup = require('./config/swagger');

// Importar rotas
const pedidoRoutes = require('./routes/pedidoRoutes');

// Criar aplicação Express
const app = express();
const PORT = process.env.PORT || 3000;

/**
 * MIDDLEWARES GLOBAIS
 */

// CORS - permitir requisições de qualquer origem
app.use(cors());

// Body Parser - interpretar JSON no body das requisições
app.use(express.json());

// Middleware para JSON mal formatado
app.use(jsonErrorHandler);

// Middleware de log de requisições
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.url}`);
  next();
});

/**
 * ROTA RAIZ
 * GET /
 * Rota de boas-vindas e informações da API
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API de Gerenciamento de Pedidos',
    version: '1.0.0',
    endpoints: {
      criar_pedido: 'POST /order',
      obter_pedido: 'GET /order/:orderId',
      listar_pedidos: 'GET /order/list',
      atualizar_pedido: 'PUT /order/:orderId',
      deletar_pedido: 'DELETE /order/:orderId'
    },
    documentation: '/api-docs'
  });
});

/**
 * ROTA DE HEALTH CHECK
 * GET /health
 * Verificar se a API está funcionando
 */
app.get('/health', async (req, res) => {
  try {
    const dbOk = await testarConexao();
    res.status(200).json({
      success: true,
      message: 'API está funcionando',
      database: dbOk ? 'conectado' : 'desconectado',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({
      success: false,
      message: 'Serviço indisponível',
      database: 'desconectado',
      error: error.message
    });
  }
});

/**
 * ROTA DE DOCUMENTAÇÃO SWAGGER
 * GET /api-docs
 * Documentação interativa da API
 */

app.use(
  '/api-docs', 
  swaggerSetup.swaggerUi.serve, 
  swaggerSetup.swaggerUi.setup(swaggerSetup.swaggerDocs, {
    customCss: swaggerSetup.customCss,
    customSiteTitle: swaggerSetup.customSiteTitle,
    customfavIcon: swaggerSetup.customfavIcon
  })
);
/**
 * ROTAS DA API
 * Base URL: /order
 */
app.use('/order', pedidoRoutes);

/**
 * MIDDLEWARE DE ROTA NÃO ENCONTRADA
 * Captura todas as rotas que não existem
 */
app.use(notFoundHandler);

/**
 * MIDDLEWARE DE TRATAMENTO DE ERROS
 * Deve ser o último middleware
 */
app.use(errorHandler);

/**
 * INICIAR SERVIDOR
 */
async function iniciarServidor() {
  try {
    // Testar conexão com banco de dados
    console.log('Verificando conexão com banco de dados...');
    const dbConectado = await testarConexao();
    
    if (!dbConectado) {
      console.error('ERRO: Não foi possível conectar ao banco de dados');
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
       
      console.log('API DE GERENCIAMENTO DE PEDIDOS');
       
      console.log(`Servidor rodando na porta: ${PORT}`);
      console.log(`URL: http://localhost:${PORT}`);
      console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
      console.log('---*--*--');
      console.log('Endpoints disponíveis:');
      console.log(`  POST   http://localhost:${PORT}/order`);
      console.log(`  GET    http://localhost:${PORT}/order/:orderId`);
      console.log(`  GET    http://localhost:${PORT}/order/list`);
      console.log(`  PUT    http://localhost:${PORT}/order/:orderId`);
      console.log(`  DELETE http://localhost:${PORT}/order/:orderId`);
      console.log('---*--*--');
      console.log('Rotas auxiliares:');
      console.log(`  GET    http://localhost:${PORT}/`);
      console.log(`  GET    http://localhost:${PORT}/health`);
       
      console.log('---*-|-*--');
      console.log('Pressione Ctrl+C para parar o servidor');
      console.log('---*--*--');
    });

  } catch (error) {
    console.error('ERRO ao iniciar servidor:', error.message);
    process.exit(1);
  }
}

// Tratamento de erros não capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Iniciar servidor se este arquivo for executado diretamente
if (require.main === module) {
  iniciarServidor();
}

module.exports = app;