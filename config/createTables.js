const { pool } = require('./database');

/**
 * Criando as tabelas necessárias no banco de dados
 * 
 * Estrutura:
 * - Tabela: pedidos (orders)
 * - Tabela: itens_pedido (order_items)
 */

async function criarTabelas() {
  try {
    console.log('Iniciando criação das tabelas...\n');

    // TABELA: pedidos
    const criarTabelaPedidos = `
      CREATE TABLE IF NOT EXISTS pedidos (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(100) UNIQUE NOT NULL,
        value DECIMAL(10, 2) NOT NULL,
        creation_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(criarTabelaPedidos);
    console.log('Tabela "pedidos" criada com sucesso!');

    // TABELA: itens_pedido
    const criarTabelaItensPedido = `
      CREATE TABLE IF NOT EXISTS itens_pedido (
        id SERIAL PRIMARY KEY,
        pedido_id INTEGER NOT NULL,
        item_id VARCHAR(50) NOT NULL,
        quantity INTEGER NOT NULL,
        item_value DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id) ON DELETE CASCADE
      );
    `;

    await pool.query(criarTabelaItensPedido);
    console.log('Tabela "itens_pedido" criada com sucesso!');

    // Criar índices para melhor performance
    const criarIndices = `
      CREATE INDEX IF NOT EXISTS idx_pedidos_order_id ON pedidos(order_id);
      CREATE INDEX IF NOT EXISTS idx_itens_pedido_pedido_id ON itens_pedido(pedido_id);
    `;

    await pool.query(criarIndices);
    console.log('Índices criados com sucesso!');

    // Verificar tabelas criadas
    const verificarTabelas = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `;

    const resultado = await pool.query(verificarTabelas);
    console.log('\n  Tabelas existentes no banco:');
    resultado.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });

    console.log('\n Todas as tabelas foram criadas com sucesso!');
    return true;

  } catch (error) {
    console.error('Erro ao criar tabelas:', error.message);
    console.error('Detalhes:', error);
    return false;
  }
}

/**
 * Função para deletar todas as tabelas (útil para recomeçar do zero)
 */
async function deletarTabelas() {
  try {
    console.log(' Deletando tabelas...\n');

    await pool.query('DROP TABLE IF EXISTS itens_pedido CASCADE;');
    console.log('Tabela "itens_pedido" deletada');

    await pool.query('DROP TABLE IF EXISTS pedidos CASCADE;');
    console.log('Tabela "pedidos" deletada');

    console.log('\n Todas as tabelas foram deletadas!');
    return true;

  } catch (error) {
    console.error(' Erro ao deletar tabelas:', error.message);
    return false;
  }
}

/**
 * Função para resetar o banco (deletar e criar novamente)
 */
async function resetarBanco() {
  console.log('Resetando banco de dados...\n');
  await deletarTabelas();
  console.log('');
  await criarTabelas();
}

// Se executar este arquivo diretamente
if (require.main === module) {
  const args = process.argv.slice(2);
  const comando = args[0];

  if (comando === 'reset') {
    resetarBanco()
      .then(() => {
        console.log('\n Banco resetado com sucesso!');
        process.exit(0);
      })
      .catch(err => {
        console.error(' Erro:', err);
        process.exit(1);
      });
  } else if (comando === 'delete') {
    deletarTabelas()
      .then(() => {
        console.log('\n Tabelas deletadas!');
        process.exit(0);
      })
      .catch(err => {
        console.error(' Erro:', err);
        process.exit(1);
      });
  } else {
    criarTabelas()
      .then(() => {
        console.log('\n Processo concluído!');
        process.exit(0);
      })
      .catch(err => {
        console.error(' Erro:', err);
        process.exit(1);
      });
  }
}

module.exports = { criarTabelas, deletarTabelas, resetarBanco };