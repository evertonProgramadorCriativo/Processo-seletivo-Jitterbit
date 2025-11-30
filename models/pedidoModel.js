const { pool } = require('../config/database');

/**
 * Model para operações de pedidos no banco de dados
 */

/**
 * Criar Pedido
 * Insere um novo pedido e seus itens no banco de dados
 * Usa transação para garantir consistência dos dados
 * 
 * @param {Object} pedido - Objeto com dados do pedido
 * @param {string} pedido.orderId - Número do pedido
 * @param {number} pedido.value - Valor total
 * @param {string} pedido.creationDate - Data de criação
 * @param {Array} pedido.items - Array de itens do pedido
 * @returns {Object} Pedido criado com seus itens
 */
async function criarPedido(pedido) {
  const client = await pool.connect();

  try {
    // Iniciar transação
    await client.query('BEGIN');

    // 1. Inserir pedido na tabela 'pedidos'
    const queryPedido = `
      INSERT INTO pedidos (order_id, value, creation_date)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;

    const resultPedido = await client.query(queryPedido, [
      pedido.orderId,
      pedido.value,
      pedido.creationDate
    ]);

    const pedidoCriado = resultPedido.rows[0];
    console.log('Pedido inserido com ID:', pedidoCriado.id);

    // 2. Inserir itens na tabela 'itens_pedido'
    const itensInseridos = [];

    for (const item of pedido.items) {
      const queryItem = `
        INSERT INTO itens_pedido (pedido_id, item_id, quantity, item_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const resultItem = await client.query(queryItem, [
        pedidoCriado.id,
        item.itemId,
        item.quantity,
        item.itemValue
      ]);

      itensInseridos.push(resultItem.rows[0]);
      console.log('Item inserido com ID:', resultItem.rows[0].id);
    }

    // Confirmar transação
    await client.query('COMMIT');
    console.log('Transação confirmada com sucesso');

    // Retornar pedido com seus itens
    return {
      pedido: pedidoCriado,
      itens: itensInseridos
    };

  } catch (error) {
    // Reverter transação em caso de erro
    await client.query('ROLLBACK');
    console.error('Erro ao criar pedido, transação revertida:', error.message);
    throw error;
  } finally {
    // Liberar conexão
    client.release();
  }
}

/**
 * BUSCAR PEDIDO POR ORDER_ID
 * Busca um pedido específico pelo número do pedido
 * 
 * @param {string} orderId - Número do pedido
 * @returns {Object|null} Pedido com seus itens ou null se não encontrado
 */
async function buscarPedidoPorOrderId(orderId) {
  try {
    // Buscar pedido
    const queryPedido = `
      SELECT * FROM pedidos
      WHERE order_id = $1;
    `;

    const resultPedido = await pool.query(queryPedido, [orderId]);

    if (resultPedido.rows.length === 0) {
      return null;
    }

    const pedido = resultPedido.rows[0];

    // Buscar itens do pedido
    const queryItens = `
      SELECT * FROM itens_pedido
      WHERE pedido_id = $1
      ORDER BY id;
    `;

    const resultItens = await pool.query(queryItens, [pedido.id]);

    return {
      pedido: pedido,
      itens: resultItens.rows
    };

  } catch (error) {
    console.error('Erro ao buscar pedido:', error.message);
    throw error;
  }
}

/**
 * LISTAR TODOS OS PEDIDOS
 * Retorna todos os pedidos com seus itens
 * 
 * @returns {Array} Lista de pedidos
 */
async function listarTodosPedidos() {
  try {
    // Buscar todos os pedidos
    const queryPedidos = `
      SELECT * FROM pedidos
      ORDER BY created_at DESC;
    `;

    const resultPedidos = await pool.query(queryPedidos);

    // Para cada pedido, buscar seus itens
    const pedidosComItens = [];

    for (const pedido of resultPedidos.rows) {
      const queryItens = `
        SELECT * FROM itens_pedido
        WHERE pedido_id = $1
        ORDER BY id;
      `;

      const resultItens = await pool.query(queryItens, [pedido.id]);

      pedidosComItens.push({
        pedido: pedido,
        itens: resultItens.rows
      });
    }

    return pedidosComItens;

  } catch (error) {
    console.error('Erro ao listar pedidos:', error.message);
    throw error;
  }
}

/**
 * ATUALIZAR PEDIDO
 * Atualiza os dados de um pedido existente
 * 
 * @param {string} orderId - Número do pedido
 * @param {Object} dadosAtualizacao - Dados a serem atualizados
 * @returns {Object|null} Pedido atualizado ou null
 */
async function atualizarPedido(orderId, dadosAtualizacao) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Atualizar pedido
    const queryPedido = `
      UPDATE pedidos
      SET value = $1, 
          creation_date = $2,
          updated_at = CURRENT_TIMESTAMP
      WHERE order_id = $3
      RETURNING *;
    `;

    const resultPedido = await client.query(queryPedido, [
      dadosAtualizacao.value,
      dadosAtualizacao.creationDate,
      orderId
    ]);

    if (resultPedido.rows.length === 0) {
      await client.query('ROLLBACK');
      return null;
    }

    const pedidoAtualizado = resultPedido.rows[0];

    // Deletar itens antigos
    await client.query('DELETE FROM itens_pedido WHERE pedido_id = $1', [
      pedidoAtualizado.id
    ]);

    // Inserir novos itens
    const itensAtualizados = [];

    for (const item of dadosAtualizacao.items) {
      const queryItem = `
        INSERT INTO itens_pedido (pedido_id, item_id, quantity, item_value)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

      const resultItem = await client.query(queryItem, [
        pedidoAtualizado.id,
        item.itemId,
        item.quantity,
        item.itemValue
      ]);

      itensAtualizados.push(resultItem.rows[0]);
    }

    await client.query('COMMIT');

    return {
      pedido: pedidoAtualizado,
      itens: itensAtualizados
    };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao atualizar pedido:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * DELETAR PEDIDO
 * Remove um pedido e seus itens do banco
 * 
 * @param {string} orderId - Número do pedido
 * @returns {boolean} true se deletado, false se não encontrado
 */
async function deletarPedido(orderId) {
  try {
    // Deletar pedido (CASCADE deleta os itens automaticamente)
    const query = `
      DELETE FROM pedidos
      WHERE order_id = $1
      RETURNING *;
    `;

    const result = await pool.query(query, [orderId]);

    return result.rows.length > 0;

  } catch (error) {
    console.error('Erro ao deletar pedido:', error.message);
    throw error;
  }
}

// Exportar funções
module.exports = {
  criarPedido,
  buscarPedidoPorOrderId,
  listarTodosPedidos,
  atualizarPedido,
  deletarPedido
};


// Teste (executar este arquivo diretamente)

if (require.main === module) {
  console.log('Testando Model - Criar Pedido...\n');

  async function testarCriarPedido() {
    try {
      // Dados de teste
      const pedidoTeste = {
        orderId: 'v10089016vdb-test-' + Date.now(),
        value: 15000,
        creationDate: new Date().toISOString(),
        items: [
          {
            itemId: '2434',
            quantity: 2,
            itemValue: 5000
          },
          {
            itemId: '2435',
            quantity: 1,
            itemValue: 5000
          }
        ]
      };

      console.log('Teste 1: Criar pedido no banco');
      console.log('Dados do pedido:');
      console.log(JSON.stringify(pedidoTeste, null, 2));
      console.log('\nInserindo no banco...');

      const resultado = await criarPedido(pedidoTeste);

      console.log('\nPedido criado com sucesso!');
      console.log('ID do pedido no banco:', resultado.pedido.id);
      console.log('Order ID:', resultado.pedido.order_id);
      console.log('Quantidade de itens:', resultado.itens.length);
      console.log('\nDetalhes completos:');
      console.log(JSON.stringify(resultado, null, 2));

      // Teste 2: Buscar o pedido criado
      console.log('\n\nTeste 2: Buscar pedido por order_id');
      const pedidoBuscado = await buscarPedidoPorOrderId(pedidoTeste.orderId);
      
      if (pedidoBuscado) {
        console.log('Pedido encontrado!');
        console.log('Order ID:', pedidoBuscado.pedido.order_id);
        console.log('Valor:', pedidoBuscado.pedido.value);
        console.log('Itens:', pedidoBuscado.itens.length);
      } else {
        console.log('Pedido não encontrado');
      }

      console.log('\n\nTodos os testes concluídos com sucesso!');
      console.log('Pedido de teste criado: ' + pedidoTeste.orderId);
      process.exit(0);

    } catch (error) {
      console.error('\nERRO no teste:', error.message);
      console.error('Stack:', error.stack);
      process.exit(1);
    }
  }

  testarCriarPedido();
}