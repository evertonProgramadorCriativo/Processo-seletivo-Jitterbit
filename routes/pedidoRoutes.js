const express = require('express');
const router = express.Router();

// Importar controllers
const {
  criarPedidoController,
  obterPedidoController,
  listarPedidosController,
  atualizarPedidoController,
  deletarPedidoController
} = require('../controllers/pedidoController');

/**
 * ROTAS DE PEDIDOS
 * 
 * Base URL: /order
 */

/**
 * POST /order
 * Criar um novo pedido 
 */
router.post('/', criarPedidoController);

/**
 * GET /order/list
 */
router.get('/list', listarPedidosController);

/**
 * GET /order/:orderId
 */
router.get('/:orderId', obterPedidoController);

/**
 * PUT /order/:orderId
 */
router.put('/:orderId', atualizarPedidoController);

/**
 * DELETE /order/:orderId
 */
router.delete('/:orderId', deletarPedidoController);

module.exports = router;