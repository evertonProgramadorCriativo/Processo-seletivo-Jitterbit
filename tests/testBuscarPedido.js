const { buscarPedidoPorOrderId, criarPedido } = require('../models/pedidoModel');

async function testarBuscarPedido() {
  try {
    console.log('Testando buscar pedido por ID \n');

    // Primeiro criar um pedido para buscar
    const pedidoTeste = {
      orderId: 'v10089017vdb-buscar-' + Date.now(),
      value: 8500,
      creationDate: new Date().toISOString(),
      items: [
        {
          itemId: '1001',
          quantity: 3,
          itemValue: 2500
        },
        {
          itemId: '1002',
          quantity: 1,
          itemValue: 1000
        }
      ]
    };

    console.log('Passo 1: Criando pedido de teste...');
    const pedidoCriado = await criarPedido(pedidoTeste);
    console.log('OK ---+- Pedido criado com order_id:', pedidoCriado.pedido.order_id);
    console.log('');

    // Teste 1: Buscar pedido existente
    console.log('Teste 1: Buscar pedido existente');
    console.log('Buscando order_id:', pedidoTeste.orderId);
    
    const resultado = await buscarPedidoPorOrderId(pedidoTeste.orderId);

    if (resultado) {
      console.log('OK ---+- Pedido encontrado!');
      console.log('');
      console.log('Dados do pedido:');
      console.log('---+- ID interno:', resultado.pedido.id);
      console.log('---+- Order ID:', resultado.pedido.order_id);
      console.log('---+- Valor:', resultado.pedido.value);
      console.log('---+- Data criação:', resultado.pedido.creation_date);
      console.log('---+- Quantidade de itens:', resultado.itens.length);
      
      console.log('Itens do pedido:');
      resultado.itens.forEach((item, index) => {
        console.log(`  Item ${index + 1}:`);
        console.log(`    ---+- ID: ${item.item_id}`);
        console.log(`    ---+- Quantidade: ${item.quantity}`);
        console.log(`    ---+- Valor: ${item.item_value}`);
      });
    } else {
      console.log('ERRO ---+- Pedido não encontrado');
    }

    console.log('\n');

    // Teste 2: Buscar pedido que não existe
    console.log('Teste 2: Buscar pedido inexistente');
    const orderIdInexistente = 'pedido-nao-existe-12345';
    console.log('Buscando order_id:', orderIdInexistente);
    
    const resultadoNulo = await buscarPedidoPorOrderId(orderIdInexistente);

    if (resultadoNulo === null) {
      console.log('OK ---+- Retornou null corretamente para pedido inexistente');
    } else {
      console.log('ERRO ---+- Deveria retornar null');
    }

    console.log('\n');
    console.log('Testes concluídos com sucesso!');
    console.log('Pedido de teste: ' + pedidoTeste.orderId);
    process.exit(0);

  } catch (error) {
    console.error('\nERRO no teste:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testarBuscarPedido();