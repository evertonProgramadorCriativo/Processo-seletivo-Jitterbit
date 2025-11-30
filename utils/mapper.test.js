
const {
  mapearPedidoParaBanco,
  mapearPedidoParaAPI,
  validarNumero,
  validarData
} = require('./mapper');

describe('Mapper - mapearPedidoParaBanco', () => {
  
  test('deve mapear pedido válido corretamente', () => {
    const pedidoEntrada = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.529Z",
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

    expect(resultado).toHaveProperty('orderId', 'v10089015vdb-01');
    expect(resultado).toHaveProperty('value', 10000);
    expect(resultado).toHaveProperty('creationDate');
    expect(resultado.items).toHaveLength(2);
    expect(resultado.items[0]).toHaveProperty('itemId', '2434');
    expect(resultado.items[0]).toHaveProperty('quantity', 1);
    expect(resultado.items[0]).toHaveProperty('itemValue', 1000);
  });

  test('deve lançar erro quando numeroPedido está ausente', () => {
    const pedidoInvalido = {
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.529Z",
      items: [{ idItem: "2434", quantidadeItem: 1, valorItem: 1000 }]
    };

    expect(() => {
      mapearPedidoParaBanco(pedidoInvalido);
    }).toThrow('Campo obrigatório ausente: numeroPedido');
  });

  test('deve lançar erro quando valorTotal está ausente', () => {
    const pedidoInvalido = {
      numeroPedido: "v10089015vdb-01",
      dataCriacao: "2023-07-19T12:24:11.529Z",
      items: [{ idItem: "2434", quantidadeItem: 1, valorItem: 1000 }]
    };

    expect(() => {
      mapearPedidoParaBanco(pedidoInvalido);
    }).toThrow('Campo obrigatório ausente: valorTotal');
  });

  test('deve lançar erro quando dataCriacao está ausente', () => {
    const pedidoInvalido = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      items: [{ idItem: "2434", quantidadeItem: 1, valorItem: 1000 }]
    };

    expect(() => {
      mapearPedidoParaBanco(pedidoInvalido);
    }).toThrow('Campo obrigatório ausente: dataCriacao');
  });

  test('deve lançar erro quando items está vazio', () => {
    const pedidoInvalido = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.529Z",
      items: []
    };

    expect(() => {
      mapearPedidoParaBanco(pedidoInvalido);
    }).toThrow('O pedido deve conter pelo menos um item');
  });

  test('deve lançar erro quando items não é um array', () => {
    const pedidoInvalido = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.529Z",
      items: "não é array"
    };

    expect(() => {
      mapearPedidoParaBanco(pedidoInvalido);
    }).toThrow('Campo obrigatório ausente ou inválido: items');
  });

  test('deve lançar erro quando item não possui idItem', () => {
    const pedidoInvalido = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: 10000,
      dataCriacao: "2023-07-19T12:24:11.529Z",
      items: [
        { quantidadeItem: 1, valorItem: 1000 }
      ]
    };

    expect(() => {
      mapearPedidoParaBanco(pedidoInvalido);
    }).toThrow('Item 1: campo obrigatório ausente: idItem');
  });

  test('deve lançar erro quando pedido é null', () => {
    expect(() => {
      mapearPedidoParaBanco(null);
    }).toThrow('Pedido inválido: dados não fornecidos');
  });

  test('deve converter strings numéricas corretamente', () => {
    const pedidoEntrada = {
      numeroPedido: "v10089015vdb-01",
      valorTotal: "10000",
      dataCriacao: "2023-07-19T12:24:11.529Z",
      items: [
        {
          idItem: "2434",
          quantidadeItem: "1",
          valorItem: "1000"
        }
      ]
    };

    const resultado = mapearPedidoParaBanco(pedidoEntrada);

    expect(typeof resultado.value).toBe('number');
    expect(resultado.value).toBe(10000);
    expect(typeof resultado.items[0].quantity).toBe('number');
    expect(typeof resultado.items[0].itemValue).toBe('number');
  });
});

describe('Mapper - mapearPedidoParaAPI', () => {
  
  test('deve mapear pedido do banco para API corretamente', () => {
    const pedidoBanco = {
      id: 1,
      order_id: 'v10089015vdb-01',
      value: '10000.00',
      creation_date: '2023-07-19T12:24:11.529Z',
      created_at: '2024-11-29T10:00:00Z',
      updated_at: '2024-11-29T10:00:00Z'
    };

    const itensBanco = [
      {
        id: 1,
        item_id: '2434',
        quantity: 1,
        item_value: '1000.00'
      },
      {
        id: 2,
        item_id: '2435',
        quantity: 2,
        item_value: '2000.00'
      }
    ];

    const resultado = mapearPedidoParaAPI(pedidoBanco, itensBanco);

    expect(resultado).toHaveProperty('id', 1);
    expect(resultado).toHaveProperty('numeroPedido', 'v10089015vdb-01');
    expect(resultado).toHaveProperty('valorTotal', 10000);
    expect(resultado).toHaveProperty('dataCriacao');
    expect(resultado.items).toHaveLength(2);
    expect(resultado.items[0]).toHaveProperty('idItem', '2434');
    expect(resultado).toHaveProperty('criadoEm');
    expect(resultado).toHaveProperty('atualizadoEm');
  });

  test('deve retornar null quando pedido do banco é null', () => {
    const resultado = mapearPedidoParaAPI(null, []);
    expect(resultado).toBeNull();
  });

  test('deve mapear pedido com array de itens vazio', () => {
    const pedidoBanco = {
      id: 1,
      order_id: 'v10089015vdb-01',
      value: '10000.00',
      creation_date: '2023-07-19T12:24:11.529Z',
      created_at: '2024-11-29T10:00:00Z',
      updated_at: '2024-11-29T10:00:00Z'
    };

    const resultado = mapearPedidoParaAPI(pedidoBanco, []);

    expect(resultado.items).toHaveLength(0);
    expect(Array.isArray(resultado.items)).toBe(true);
  });

  test('deve converter valores string do banco para number', () => {
    const pedidoBanco = {
      id: 1,
      order_id: 'v10089015vdb-01',
      value: '10000.00',
      creation_date: '2023-07-19T12:24:11.529Z',
      created_at: '2024-11-29T10:00:00Z',
      updated_at: '2024-11-29T10:00:00Z'
    };

    const itensBanco = [
      {
        id: 1,
        item_id: '2434',
        quantity: 1,
        item_value: '1000.00'
      }
    ];

    const resultado = mapearPedidoParaAPI(pedidoBanco, itensBanco);

    expect(typeof resultado.valorTotal).toBe('number');
    expect(typeof resultado.items[0].valorItem).toBe('number');
  });
});

describe('Mapper - validarNumero', () => {
  
  test('deve validar número positivo corretamente', () => {
    expect(validarNumero(100, 'valor')).toBe(100);
    expect(validarNumero('100', 'valor')).toBe(100);
    expect(validarNumero(0, 'valor')).toBe(0);
  });

  test('deve lançar erro para número negativo', () => {
    expect(() => {
      validarNumero(-100, 'valor');
    }).toThrow('valor deve ser um número válido e positivo');
  });

  test('deve lançar erro para valor não numérico', () => {
    expect(() => {
      validarNumero('abc', 'valor');
    }).toThrow('valor deve ser um número válido e positivo');
  });
});

describe('Mapper - validarData', () => {
  
  test('deve validar data válida corretamente', () => {
    const data = '2023-07-19T12:24:11.529Z';
    const resultado = validarData(data, 'dataCriacao');
    
    expect(resultado).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  test('deve lançar erro para data inválida', () => {
    expect(() => {
      validarData('data-invalida', 'dataCriacao');
    }).toThrow('dataCriacao deve ser uma data válida');
  });

  test('deve aceitar objeto Date', () => {
    const data = new Date();
    const resultado = validarData(data, 'dataCriacao');
    
    expect(resultado).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });
});