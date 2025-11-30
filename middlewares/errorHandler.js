/**
 * Classe para erros personalizados da aplicação
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware para tratamento de erros
 * Captura todos os erros da aplicação
 *  e retorna respostas HTTP adequadas
 */
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Erro interno do servidor';

  // Log do erro no console (útil para debug)
  console.error('--- Erro Capturado Pelo Error Handler');  
  console.error('Status:', statusCode);
  console.error('Mensagem:', message);
  console.error('Stack:', err.stack);
  

  // Erros de validação do PostgreSQL
  if (err.code === '23505') {
    // Violação de constraint UNIQUE
    statusCode = 409;
    message = 'Pedido já existe com este número';
  }

  if (err.code === '23503') {
    // Violação de FOREIGN KEY
    statusCode = 404;
    message = 'Registro relacionado não encontrado';
  }

  if (err.code === '22P02') {
    // Erro de sintaxe SQL ou tipo inválido
    statusCode = 400;
    message = 'Formato de dados inválido';
  }

  // Erros de validação de dados
  if (message.includes('obrigatório') || message.includes('inválido')) {
    statusCode = 400;
  }

  // Erro de pedido não encontrado
  if (message.includes('não encontrado') || message.includes('não existe')) {
    statusCode = 404;
  }

  // Resposta ao cliente
  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      statusCode: statusCode,
      ...(process.env.NODE_ENV === 'development' && {
        stack: err.stack,
        details: err
      })
    }
  });
}

/**
 * Middleware para rotas não encontradas (404)
 */
function notFoundHandler(req, res, next) {
  const error = new AppError(
    `Rota não encontrada: ${req.method} ${req.originalUrl}`,
    404
  );
  next(error);
}

/**
 * Função auxiliar para criar erros de validação
 */
function validationError(message) {
  return new AppError(message, 400);
}

/**
 * Função auxiliar para criar erros de não encontrado
 */
function notFoundError(message) {
  return new AppError(message || 'Recurso não encontrado', 404);
}

/**
 * Função auxiliar para criar erros de conflito
 */
function conflictError(message) {
  return new AppError(message || 'Conflito de dados', 409);
}

/**
 * Middleware para validar JSON mal formatado
 */
function jsonErrorHandler(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'JSON inválido no body da requisição',
        statusCode: 400
      }
    });
  }
  next(err);
}

// Exportar middlewares e classes
module.exports = {
  AppError,
  errorHandler,
  notFoundHandler,
  validationError,
  notFoundError,
  conflictError,
  jsonErrorHandler
};


// TESTES (executar este arquivo diretamente)

if (require.main === module) {
  console.log('Testando funções do Error Handler...\n');

  // Teste 1: Criar erro customizado
  console.log('Teste 1: Criar AppError customizado');
  try {
    const erro = new AppError('Teste de erro', 400);
    console.log('AppError criado:');
    console.log('--+- Mensagem:', erro.message);
    console.log('--+-  Status Code:', erro.statusCode);
    console.log('---+-  Is Operational:', erro.isOperational);
    console.log('OK ---+-  AppError funcionando\n');
  } catch (error) {
    console.error('ERRO no teste 1:', error.message);
  }

  // Teste 2: Função validationError
  console.log('Teste 2: Função validationError');
  try {
    const erro = validationError('Campo obrigatório ausente');
    console.log('Erro de validação criado:');
    console.log('---+-  Mensagem:', erro.message);
    console.log('--+-  Status Code:', erro.statusCode);
    console.log('OK ---+-  validationError funcionando\n');
  } catch (error) {
    console.error('ERRO no teste 2:', error.message);
  }

  // Teste 3: Função notFoundError
  console.log('Teste 3: Função notFoundError');
  try {
    const erro = notFoundError('Pedido não encontrado');
    console.log('Erro not found criado:');
    console.log('---+-  Mensagem:', erro.message);
    console.log('---+-  Status Code:', erro.statusCode);
    console.log('OK --+-  notFoundError funcionando\n');
  } catch (error) {
    console.error('ERRO no teste 3:', error.message);
  }

  // Teste 4: Função conflictError
  console.log('Teste 4: Função conflictError');
  try {
    const erro = conflictError('Pedido já existe');
    console.log('Erro de conflito criado:');
    console.log('--+-  Mensagem:', erro.message);
    console.log('---+-  Status Code:', erro.statusCode);
    console.log('OK ---+-  conflictError funcionando\n');
  } catch (error) {
    console.error('ERRO no teste 4:', error.message);
  }

  // Teste 5: Simular resposta do errorHandler
  console.log('Teste 5: Simular errorHandler');
  try {
    const erro = new AppError('Erro de teste', 400);
    
    // Mock de objetos req e res
    const req = { method: 'POST', originalUrl: '/order' };
    const res = {
      status: function(code) {
        console.log('Status HTTP:', code);
        return this;
      },
      json: function(data) {
        console.log('Resposta JSON:');
        console.log(JSON.stringify(data, null, 2));
      }
    };

    errorHandler(erro, req, res, () => {});
    console.log('OK ---+-  errorHandler funcionando\n');
  } catch (error) {
    console.error('ERRO no teste 5:', error.message);
  }

  console.log('Testes do Error Handler concluídos!');
}