const { criarPedido, deletarPedido, buscarPedidoPorOrderId } = require('../src/models/pedidoModel');

async function testarDeletarPedido() {
  try {
    console.log('Testando deletar pedido\n');

    // Criar pedido para deletar
    const pedidoTeste = {
      orderId: 'v10089021vdb-delete-' + Date.now(),
      value: 6000,
      creationDate: new Date().toISOString(),
      items: [
        { itemId: '5001', quantity: 2, itemValue: 3000 }
      ]
    };

    console.log('Criando pedido de teste...');
    await criarPedido(pedidoTeste);
    console.log('OK - Pedido criado:', pedidoTeste.orderId);
    console.log('');

    // Verificar que o pedido existe
    console.log('Verificando que o pedido existe...');
    const pedidoAntesDeletar = await buscarPedidoPorOrderId(pedidoTeste.orderId);
    
    if (pedidoAntesDeletar) {
      console.log('OK - Pedido confirmado no banco');
      console.log('  Order ID:', pedidoAntesDeletar.pedido.order_id);
      console.log('  Valor:', pedidoAntesDeletar.pedido.value);
      console.log('  Itens:', pedidoAntesDeletar.itens.length);
    } else {
      console.log('ERRO - Pedido não encontrado');
    }

    console.log('');

    // Deletar pedido
    console.log('Passo 3: Deletando pedido...');
    const resultadoDelete = await deletarPedido(pedidoTeste.orderId);

    if (resultadoDelete) {
      console.log('OK - Pedido deletado com sucesso!');
    } else {
      console.log('ERRO - Falha ao deletar pedido');
    }

    console.log('');

    // Verificar que o pedido não existe mais
    console.log('Verificando que o pedido foi deletado...');
    const pedidoDepoisDeletar = await buscarPedidoPorOrderId(pedidoTeste.orderId);

    if (pedidoDepoisDeletar === null) {
      console.log('OK - Pedido não existe mais no banco (deletado corretamente)');
    } else {
      console.log('ERRO - Pedido ainda existe no banco');
    }

    console.log('');

    // Teste 2: Tentar deletar pedido inexistente
    console.log('Teste 2: Tentar deletar pedido inexistente');
    const orderIdInexistente = 'pedido-nao-existe-777';
    console.log('Tentando deletar order_id:', orderIdInexistente);
    
    const resultadoDeleteInexistente = await deletarPedido(orderIdInexistente);

    if (resultadoDeleteInexistente === false) {
      console.log('OK - Retornou false corretamente para pedido inexistente');
    } else {
      console.log('ERRO - Deveria retornar false');
    }

    console.log('\n');
    console.log('ETAPA 10 concluída com sucesso!');
    console.log('Pedido de teste deletado: ' + pedidoTeste.orderId);
    process.exit(0);

  } catch (error) {
    console.error('\nERRO no teste:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testarDeletarPedido();