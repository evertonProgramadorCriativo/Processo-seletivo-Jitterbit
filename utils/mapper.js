/**
 * Esta função é um adaptador de dados que converte
 *  o formato recebido da API externa para o
 *  formato esperado pelo seu banco de dados PostgreSQL.
 * 
 * @param {Object} pedidoEntrada - Pedido no formato da API
 * @returns {Object} Pedido no formato do banco de dados
 */
function mapearPedidoParaBanco(pedidoEntrada) {
  // Validar se o pedido existe
  if (!pedidoEntrada) {
    throw new Error('Pedido inválido: dados não fornecidos');
  }

  // Validar campos obrigatórios
  if (!pedidoEntrada.numeroPedido) {
    throw new Error('Campo obrigatório ausente: numeroPedido');
  }
  if (pedidoEntrada.valorTotal === undefined || pedidoEntrada.valorTotal === null) {
    throw new Error('Campo obrigatório ausente: valorTotal');
  }
  if (!pedidoEntrada.dataCriacao) {
    throw new Error('Campo obrigatório ausente: dataCriacao');
  }
  if (!pedidoEntrada.items || !Array.isArray(pedidoEntrada.items)) {
    throw new Error('Campo obrigatório ausente ou inválido: items (deve ser um array)');
  }
  if (pedidoEntrada.items.length === 0) {
    throw new Error('O pedido deve conter pelo menos um item');
  }

  // Mapear pedido
  const pedidoMapeado = {
    orderId: pedidoEntrada.numeroPedido,
    value: parseFloat(pedidoEntrada.valorTotal),
    creationDate: new Date(pedidoEntrada.dataCriacao).toISOString(),
    items: pedidoEntrada.items.map((item, index) => {
      // Validar cada item
      if (!item.idItem) {
        throw new Error(`Item ${index + 1}: campo obrigatório ausente: idItem`);
      }
      if (item.quantidadeItem === undefined || item.quantidadeItem === null) {
        throw new Error(`Item ${index + 1}: campo obrigatório ausente: quantidadeItem`);
      }
      if (item.valorItem === undefined || item.valorItem === null) {
        throw new Error(`Item ${index + 1}: campo obrigatório ausente: valorItem`);
      }

      return {
        itemId: item.idItem,
        quantity: parseInt(item.quantidadeItem),
        itemValue: parseFloat(item.valorItem)
      };
    })
  };

  return pedidoMapeado;
}

/**
  * Esta função é um adaptador de dados que converte
 *  o formato recebido da API externa para o
 *  formato esperado pelo seu banco de dados PostgreSQL.
 * 
 * @param {Object} pedidoBanco - Pedido no formato do banco
 * @param {Array} itensBanco - Itens do pedido no formato do banco
 * @returns {Object} Pedido no formato da API
 */
function mapearPedidoParaAPI(pedidoBanco, itensBanco = []) {
  if (!pedidoBanco) {
    return null;
  }

  return {
    id: pedidoBanco.id,
    numeroPedido: pedidoBanco.order_id,
    valorTotal: parseFloat(pedidoBanco.value),
    dataCriacao: pedidoBanco.creation_date,
    items: itensBanco.map(item => ({
      id: item.id,
      idItem: item.item_id,
      quantidadeItem: item.quantity,
      valorItem: parseFloat(item.item_value)
    })),
    criadoEm: pedidoBanco.created_at,
    atualizadoEm: pedidoBanco.updated_at
  };
}

/**
 * Função para validar dados numéricos
 */
function validarNumero(valor, nomeCampo) {
  const numero = parseFloat(valor);
  if (isNaN(numero) || numero < 0) {
    throw new Error(`${nomeCampo} deve ser um número válido e positivo`);
  }
  return numero;
}

/**
 * Função para validar e formatar data
 */
function validarData(data, nomeCampo) {
  const dataObj = new Date(data);
  if (isNaN(dataObj.getTime())) {
    throw new Error(`${nomeCampo} deve ser uma data válida`);
  }
  return dataObj.toISOString();
}

// Exportar funções
module.exports = {
  mapearPedidoParaBanco,
  mapearPedidoParaAPI,
  validarNumero,
  validarData
};


// Testando dados de mapeamento

if (require.main === module) {
  console.log('Testando funções do Mapper...\n');

  // Teste 1: Mapeamento bem-sucedido
  console.log('Teste 1: Mapeamento de pedido válido');
  try {
    const pedidoEntrada = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.5299601+00:00",
      items: [
        {
          idItem: "2434",
          quantidadeItem: 1,
          valorItem: 1000
        },
        {
          idItem: "2435",
          quantidadeItem: 2,
          valorItem: 2000
        }
      ]
    };

    const resultado = mapearPedidoParaBanco(pedidoEntrada);
    console.log('Mapeamento bem-sucedido!');
    console.log('Pedido de entrada:');
    console.log(JSON.stringify(pedidoEntrada, null, 2));
    console.log('\n Pedido mapeado (formato do banco):');
    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error('Erro no teste 1:', error.message);
  }

  // Teste 2: Pedido sem numeroPedido (deve falhar)
  console.log('\nTeste 2: Pedido sem numeroPedido (esperado: erro)');
  try {
    const pedidoInvalido = {
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.5299601+00:00",
      items: []
    };
    mapearPedidoParaBanco(pedidoInvalido);
    console.log('Teste falhou - deveria ter gerado erro');
  } catch (error) {
    console.log('Erro capturado corretamente:', error.message);
  }

  // Teste 3: Pedido sem items (deve falhar)
  console.log('\n Teste 3: Pedido sem items (esperado: erro)');
  try {
    const pedidoSemItems = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.5299601+00:00",
      items: []
    };
    mapearPedidoParaBanco(pedidoSemItems);
    console.log('Teste falhou - deveria ter gerado erro');
  } catch (error) {
    console.log('Erro capturado corretamente:', error.message);
  }

  // Teste 4: Mapeamento do banco para API
  console.log('\n Teste 4: Mapeamento do banco para API');
  try {
    const pedidoBanco = {
      id: 1,
      order_id: 'v10089015vdb-01',
      value: 10000,
      creation_date: '2023-07-19T12:24:11.529Z',
      created_at: '2024-11-29T10:00:00Z',
      updated_at: '2024-11-29T10:00:00Z'
    };

    const itensBanco = [
      {
        id: 1,
        item_id: '2434',
        quantity: 1,
        item_value: 1000
      }
    ];

    const resultado = mapearPedidoParaAPI(pedidoBanco, itensBanco);
    console.log('Mapeamento banco → API bem-sucedido!');
    console.log(JSON.stringify(resultado, null, 2));
  } catch (error) {
    console.error(' Erro no teste 4:', error.message);
  }

  console.log('\n Testes passaram com sucesso!');
}