const { listarTodosPedidos, criarPedido } = require('../models/pedidoModel');

async function testarListarPedidos() {
  try {
    console.log('Testando listar todos os pedidos\n');

    // Criar alguns pedidos de teste
    console.log('Criando pedidos de teste...');
    
    const pedido1 = {
      orderId: 'v10089018vdb-list-1-' + Date.now(),
      value: 5000,
      creationDate: new Date().toISOString(),
      items: [
        { itemId: '3001', quantity: 1, itemValue: 5000 }
      ]
    };

    const pedido2 = {
      orderId: 'v10089019vdb-list-2-' + Date.now(),
      value: 7500,
      creationDate: new Date().toISOString(),
      items: [
        { itemId: '3002', quantity: 2, itemValue: 3000 },
        { itemId: '3003', quantity: 1, itemValue: 1500 }
      ]
    };

    await criarPedido(pedido1);
    console.log('OK - Pedido 1 criado:', pedido1.orderId);
    
    await criarPedido(pedido2);
    console.log('OK - Pedido 2 criado:', pedido2.orderId);
     

    // Listar todos os pedidos
    console.log('Teste: Listando todos os pedidos do banco...');
     

    const todosPedidos = await listarTodosPedidos();

    console.log('OK - Total de pedidos encontrados:', todosPedidos.length);
     

    if (todosPedidos.length > 0) {
      console.log('Listagem dos pedidos:');
      console.log('='.repeat(60));
      
      todosPedidos.forEach((registro, index) => {
        const { pedido, itens } = registro;
        
        console.log(`\nPedido ${index + 1}:`);
        console.log('  Order ID:', pedido.order_id);
        console.log('  Valor Total:', pedido.value);
        console.log('  Data Criação:', pedido.creation_date);
        console.log('  Criado em:', pedido.created_at);
        console.log('  Quantidade de itens:', itens.length);
        
        if (itens.length > 0) {
          console.log('  Itens:');
          itens.forEach((item, idx) => {
            console.log(`    ${idx + 1}. ID: ${item.item_id} | Qtd: ${item.quantity} | Valor: ${item.item_value}`);
          });
        }
      });

      console.log('\n' + '='.repeat(60));
    } else {
      console.log('Nenhum pedido encontrado no banco');
    }

    console.log('\n');
    console.log('Teste finalizado com sucesso!');
    process.exit(0);

  } catch (error) {
    console.error('\nERRO no teste:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

testarListarPedidos();