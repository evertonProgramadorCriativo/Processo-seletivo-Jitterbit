const { 
  criarPedido, 
  buscarPedidoPorOrderId, 
  listarTodosPedidos,
  atualizarPedido,
  deletarPedido 
} = require('../models/pedidoModel');

const { 
  mapearPedidoParaBanco, 
  mapearPedidoParaAPI 
} = require('../utils/mapper');

const { 
  validationError, 
  notFoundError,
  conflictError 
} = require('../middlewares/errorHandler');

/**
 * CRIAR PEDIDO
 * POST /order
 * 
 * Recebe pedido no formato da API, transforma e salva no banco
 */
async function criarPedidoController(req, res, next) {
  try {
    console.log('Controller: Criando novo pedido...');
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));

    // Validar se o body existe
    if (!req.body || Object.keys(req.body).length === 0) {
      throw validationError('Body da requisição está vazio');
    }

    // Mapear dados de entrada para formato do banco
    let pedidoMapeado;
    try {
      pedidoMapeado = mapearPedidoParaBanco(req.body);
      console.log('Dados mapeados com sucesso');
    } catch (error) {
      throw validationError(error.message);
    }

    // Verificar se o pedido já existe (orderId único)
    const pedidoExistente = await buscarPedidoPorOrderId(pedidoMapeado.orderId);
    if (pedidoExistente) {
      throw conflictError(`Pedido com número ${pedidoMapeado.orderId} já existe`);
    }

    //  Criar pedido no banco
    const resultado = await criarPedido(pedidoMapeado);
    console.log('Pedido criado no banco com ID:', resultado.pedido.id);

    //  Mapear resultado para formato da API
    const pedidoResposta = mapearPedidoParaAPI(resultado.pedido, resultado.itens);

    //  Retornar resposta de sucesso
    return res.status(201).json({
      success: true,
      message: 'Pedido criado com sucesso',
      data: pedidoResposta
    });

  } catch (error) {
    console.error('Erro no controller criarPedido:', error.message);
    next(error);
  }
}

/**
 * OBTER PEDIDO POR ID
 * GET /order/:orderId
 * 
 * Busca um pedido específico pelo número do pedido
 */
async function obterPedidoController(req, res, next) {
  try {
    const { orderId } = req.params;
    console.log('Controller: Buscando pedido:', orderId);

    //  Validar parâmetro
    if (!orderId) {
      throw validationError('Número do pedido não fornecido');
    }

    //  Buscar pedido no banco
    const resultado = await buscarPedidoPorOrderId(orderId);

    //  Verificar se encontrou
    if (!resultado) {
      throw notFoundError(`Pedido ${orderId} não encontrado`);
    }

    console.log('Pedido encontrado:', resultado.pedido.order_id);

    //  Mapear resultado para formato da API
    const pedidoResposta = mapearPedidoParaAPI(resultado.pedido, resultado.itens);

    //  Retornar resposta de sucesso
    return res.status(200).json({
      success: true,
      message: 'Pedido encontrado',
      data: pedidoResposta
    });

  } catch (error) {
    console.error('Erro no controller obterPedido:', error.message);
    next(error);
  }
}

/**
 * LISTAR TODOS OS PEDIDOS
 * GET /order/list
 * 
 * Lista todos os pedidos cadastrados
 */
async function listarPedidosController(req, res, next) {
  try {
    console.log('Controller: Listando todos os pedidos...');

    //  Buscar todos os pedidos
    const todosPedidos = await listarTodosPedidos();
    console.log('Total de pedidos encontrados:', todosPedidos.length);

    //  Mapear cada pedido para formato da API
    const pedidosResposta = todosPedidos.map(item => 
      mapearPedidoParaAPI(item.pedido, item.itens)
    );

    // 3. Retornar resposta de sucesso
    return res.status(200).json({
      success: true,
      message: `${pedidosResposta.length} pedido(s) encontrado(s)`,
      data: pedidosResposta
    });

  } catch (error) {
    console.error('Erro no controller listarPedidos:', error.message);
    next(error);
  }
}

/**
 * ATUALIZAR PEDIDO
 * PUT /order/:orderId
 * 
 * Atualiza um pedido existente
 */
async function atualizarPedidoController(req, res, next) {
  try {
    const { orderId } = req.params;
    console.log('Controller: Atualizando pedido:', orderId);
    console.log('Body recebido:', JSON.stringify(req.body, null, 2));

    //  Validar parâmetro
    if (!orderId) {
      throw validationError('Número do pedido não fornecido');
    }

    //  Validar body
    if (!req.body || Object.keys(req.body).length === 0) {
      throw validationError('Body da requisição está vazio');
    }

    //  Verificar se o pedido existe
    const pedidoExistente = await buscarPedidoPorOrderId(orderId);
    if (!pedidoExistente) {
      throw notFoundError(`Pedido ${orderId} não encontrado`);
    }

    //  Mapear dados de entrada
    let dadosMapeados;
    try {
      dadosMapeados = mapearPedidoParaBanco(req.body);
    } catch (error) {
      throw validationError(error.message);
    }

    //  Atualizar pedido no banco
    const resultado = await atualizarPedido(orderId, dadosMapeados);

    if (!resultado) {
      throw notFoundError(`Erro ao atualizar pedido ${orderId}`);
    }

    console.log('Pedido atualizado com sucesso');

    //  Mapear resultado para formato da API
    const pedidoResposta = mapearPedidoParaAPI(resultado.pedido, resultado.itens);

    //  Retornar resposta de sucesso
    return res.status(200).json({
      success: true,
      message: 'Pedido atualizado com sucesso',
      data: pedidoResposta
    });

  } catch (error) {
    console.error('Erro no controller atualizarPedido:', error.message);
    next(error);
  }
}

/**
 * DELETAR PEDIDO
 * DELETE /order/:orderId
 * 
 * Remove um pedido do banco de dados
 */
async function deletarPedidoController(req, res, next) {
  try {
    const { orderId } = req.params;
    console.log('Controller: Deletando pedido:', orderId);

    //  Validar parâmetro
    if (!orderId) {
      throw validationError('Número do pedido não fornecido');
    }

    //  Verificar se o pedido existe
    const pedidoExistente = await buscarPedidoPorOrderId(orderId);
    if (!pedidoExistente) {
      throw notFoundError(`Pedido ${orderId} não encontrado`);
    }

    //  Deletar pedido
    const sucesso = await deletarPedido(orderId);

    if (!sucesso) {
      throw new Error('Erro ao deletar pedido');
    }

    console.log('Pedido deletado com sucesso');

    //  Retornar resposta de sucesso
    return res.status(200).json({
      success: true,
      message: `Pedido ${orderId} deletado com sucesso`
    });

  } catch (error) {
    console.error('Erro no controller deletarPedido:', error.message);
    next(error);
  }
}

// Exportar controllers
module.exports = {
  criarPedidoController,
  obterPedidoController,
  listarPedidosController,
  atualizarPedidoController,
  deletarPedidoController
};

 
// Teste (executar este arquivo diretamente)
 
if (require.main === module) {
  console.log('Testando Controllers...\n');

  // Mock de objetos req e res para simular Express
  function criarMockReqRes(body = {}, params = {}) {
    const req = {
      body: body,
      params: params
    };

    const res = {
      statusCode: null,
      responseData: null,
      status: function(code) {
        this.statusCode = code;
        return this;
      },
      json: function(data) {
        this.responseData = data;
        console.log('\nResposta HTTP:');
        console.log('Status:', this.statusCode);
        console.log('Body:', JSON.stringify(data, null, 2));
        return this;
      }
    };

    const next = (error) => {
      if (error) {
        console.error('\nErro capturado pelo next():');
        console.error('Mensagem:', error.message);
        console.error('Status Code:', error.statusCode);
      }
    };

    return { req, res, next };
  }

  async function testarControllers() {
    try {
      console.log('Criar Pedido Controller');
      console.log('='.repeat(50));

      const pedidoTeste = {
        numeroPedido: 'v10089022vdb-controller-' + Date.now(),
        valorTotal: 12000,
        dataCriacao: new Date().toISOString(),
        items: [
          { idItem: '6001', quantidadeItem: 2, valorItem: 6000 }
        ]
      };

      const { req: req1, res: res1, next: next1 } = criarMockReqRes(pedidoTeste);
      await criarPedidoController(req1, res1, next1);

      if (res1.statusCode === 201 && res1.responseData.success) {
        console.log('\nOK - Pedido criado com sucesso via controller');
        
        // Teste 2: Buscar o pedido criado
        console.log('\n\n Obter Pedido Controller');
        console.log('='.repeat(50));
        
        const { req: req2, res: res2, next: next2 } = criarMockReqRes(
          {}, 
          { orderId: pedidoTeste.numeroPedido }
        );
        await obterPedidoController(req2, res2, next2);

        if (res2.statusCode === 200 && res2.responseData.success) {
          console.log('\nOK - Pedido encontrado via controller');
        }

        // Teste 3: Listar pedidos
        console.log('\n\n Listar Pedidos Controller');
        console.log('='.repeat(50));
        
        const { req: req3, res: res3, next: next3 } = criarMockReqRes();
        await listarPedidosController(req3, res3, next3);

        if (res3.statusCode === 200 && res3.responseData.success) {
          console.log('\nOK - Listagem realizada via controller');
        }
      }

      console.log('\n\nTestes dos Controllers concluídos!');
      process.exit(0);

    } catch (error) {
      console.error('\nERRO no teste:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    }
  }

  testarControllers();
}