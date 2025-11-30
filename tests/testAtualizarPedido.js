const { criarPedido, atualizarPedido, buscarPedidoPorOrderId } = require('../models/pedidoModel');

async function testarAtualizarPedido() {
  try {
    console.log('Testando atualizar pedido \n');

    // Criar pedido inicial
    const pedidoInicial = {
      orderId: 'v10089020vdb-update-' + Date.now(),
      value: 10000,
      creationDate: new Date().toISOString(),
      items: [
        { itemId: '4001', quantity: 2, itemValue: 5000 }
      ]
    };

    console.log('Criando pedido inicial...');
    await criarPedido(pedidoInicial);
    console.log('OK - Pedido criado:', pedidoInicial.orderId);
    console.log('Valor inicial:', pedidoInicial.value);
    console.log('Itens iniciais:', pedidoInicial.items.length);
    

    // Buscar pedido antes da atualização
    console.log(' Buscando pedido antes da atualização...');
    const pedidoAntes = await buscarPedidoPorOrderId(pedidoInicial.orderId);
    console.log('OK - Pedido encontrado');
    console.log('Valor:', pedidoAntes.pedido.value);
    console.log('Quantidade de itens:', pedidoAntes.itens.length);
   

    // Atualizar pedido
    console.log('Atualizando pedido...');
    const dadosAtualizacao = {
      value: 15000, // Valor atualizado
      creationDate: new Date().toISOString(),
      items: [
        { itemId: '4001', quantity: 3, itemValue: 5000 }, // Item atualizado
        { itemId: '4002', quantity: 1, itemValue: 5000 }  // Novo item
      ]
    };

    const pedidoAtualizado = await atualizarPedido(pedidoInicial.orderId, dadosAtualizacao);

    if (pedidoAtualizado) {
      console.log('OK - Pedido atualizado com sucesso!');
   
      console.log('Comparação:');
      console.log('Valor ANTES:', pedidoAntes.pedido.value);
      console.log('Valor DEPOIS:', pedidoAtualizado.pedido.value);

      console.log('Itens ANTES:', pedidoAntes.itens.length);
      console.log('Itens DEPOIS:', pedidoAtualizado.itens.length);

      console.log('Novos itens:');
      pedidoAtualizado.itens.forEach((item, index) => {
        console.log(`  Item ${index + 1}:`);
        console.log(` - ID: ${item.item_id}`);
        console.log(` - Quantidade: ${item.quantity}`);
        console.log(` - Valor: ${item.item_value}`);
      });
    } else {
      console.log('ERRO - Pedido não encontrado para atualizar');
    }

    console.log('');

    //Tentar atualizar pedido inexistente
    console.log('Tentar atualizar pedido inexistente');
    const orderIdInexistente = 'pedido-nao-existe-999';
    console.log('Tentando atualizar order_id:', orderIdInexistente);
    
    const resultadoNulo = await atualizarPedido(orderIdInexistente, dadosAtualizacao);

    if (resultadoNulo === null) {
      console.log('OK - Retornou null corretamente para pedido inexistente');
    } else {
      console.log('ERRO - Deveria retornar null');
    }

    console.log('\n');
    console.log('Testes concluídos com sucesso!');
    console.log('Pedido de teste: ' + pedidoInicial.orderId);
    process.exit(0);

  } catch (error) {
    console.error('\n ERRO no teste:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testarAtualizarPedido();