const fs = require('fs');
const path = require('path');

// 1. Carregar variáveis de ambiente do .env
function loadEnv() {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split(/\r?\n/).forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const index = trimmed.indexOf('=');
      if (index > 0) {
        const key = trimmed.substring(0, index).trim();
        let val = trimmed.substring(index + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        process.env[key] = val;
      }
    });
  }
}

loadEnv();

const apiKey = process.env.POSTMAN_API_KEY;

if (!apiKey) {
  console.error('❌ Erro: Variável POSTMAN_API_KEY ausente no .env!');
  console.error('Por favor, certifique-se de configurar seu token do Postman.');
  process.exit(1);
}

const collectionUid = process.argv[2] || process.env.POSTMAN_COLLECTION_UID;

async function syncPostman() {
  if (!collectionUid) {
    // Modo 1: Listar coleções
    console.log('🔍 Conectando ao Postman Cloud API (Listar)...');
    try {
      const res = await fetch('https://api.getpostman.com/collections', {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Erro na API do Postman (${res.status}): ${await res.text()}`);
      }

      const data = await res.json();
      const collections = data.collections || [];

      if (collections.length === 0) {
        console.log('⚠️ Nenhuma coleção encontrada na sua conta do Postman.');
        return;
      }

      console.log('\n📂 Coleções Encontradas no seu Postman:\n');
      console.log('-----------------------------------------------------------------------------------');
      console.log(String('Nome da Coleção').padEnd(40) + ' | ' + 'UID da Coleção (Use para baixar)');
      console.log('-----------------------------------------------------------------------------------');
      collections.forEach(col => {
        console.log(String(col.name).padEnd(40) + ' | ' + col.uid);
      });
      console.log('-----------------------------------------------------------------------------------\n');
      console.log('📖 Para baixar uma coleção localmente, execute o comando:');
      console.log('node scripts/sync-postman.js <UID-DA-COLECAO>\n');

    } catch (err) {
      console.error('❌ Erro ao listar as coleções:');
      console.error(err.message);
      process.exit(1);
    }
  } else {
    // Modo 2: Baixar coleção específica
    console.log(`📥 Baixando coleção com UID: ${collectionUid}...`);
    try {
      const res = await fetch(`https://api.getpostman.com/collections/${collectionUid}`, {
        method: 'GET',
        headers: {
          'X-Api-Key': apiKey,
          'Accept': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`Erro na API do Postman (${res.status}): ${await res.text()}`);
      }

      const data = await res.json();
      
      // Criar a pasta postman/ se não existir
      const postmanDir = path.resolve(__dirname, '../postman');
      if (!fs.existsSync(postmanDir)) {
        fs.mkdirSync(postmanDir);
      }

      const outputPath = path.join(postmanDir, 'collection.json');
      fs.writeFileSync(outputPath, JSON.stringify(data.collection, null, 2), 'utf-8');

      console.log(`\n💾 Sucesso! Coleção "${data.collection.info.name}" salva localmente em:`);
      console.log(`📂 ${outputPath}\n`);

    } catch (err) {
      console.error('❌ Erro ao baixar a coleção:');
      console.error(err.message);
      process.exit(1);
    }
  }
}

syncPostman();
