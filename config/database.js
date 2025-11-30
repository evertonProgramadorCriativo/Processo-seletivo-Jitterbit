require('dotenv').config();
const { Pool } = require('pg');

/**
 * Configuração do Pool de conexões do PostgreSQL
 * Pool gerencia múltiplas conexões automaticamente
 */
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para Render.com
  }
});

// Evento de conexão bem-sucedida
pool.on('connect', () => {
  console.log('Conectado ao PostgreSQL (Render.com)');
});

// Evento de erro
pool.on('error', (err) => {
  console.error('Erro inesperado no PostgreSQL:', err);
  process.exit(-1);
});

/**
 * Função para testar a conexão com o banco
 */
async function testarConexao() {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('Teste de conexão bem-sucedido!');
    console.log('Hora do servidor:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('Erro ao testar conexão:', error.message);
    return false;
  }
}

// Se executar este arquivo diretamente, testa a conexão
if (require.main === module) {
  testarConexao()
    .then(() => {
      console.log('\n Conexão funcionando! Pressione Ctrl+C para sair.');
    })
    .catch((err) => {
      console.error(' Falha na conexão:', err);
      process.exit(1);
    });
}

module.exports = { pool, testarConexao };