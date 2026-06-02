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
const collectionUid = process.env.POSTMAN_COLLECTION_UID;

if (!apiKey || !collectionUid) {
  console.error('❌ Erro: POSTMAN_API_KEY ou POSTMAN_COLLECTION_UID ausentes no .env!');
  process.exit(1);
}

async function uploadPostman() {
  const collectionPath = path.resolve(__dirname, '../postman/collection.json');

  if (!fs.existsSync(collectionPath)) {
    console.error(`❌ Erro: Arquivo da coleção não encontrado localmente em: ${collectionPath}`);
    process.exit(1);
  }

  console.log(`📤 Carregando coleção local para subir na nuvem do Postman...`);
  
  try {
    const fileContent = fs.readFileSync(collectionPath, 'utf-8');
    const collectionData = JSON.parse(fileContent);

    // A API de PUT do Postman exige que o JSON seja envelopado em um objeto "collection"
    const requestBody = {
      collection: collectionData
    };

    console.log(`📡 Enviando PUT para: https://api.getpostman.com/collections/${collectionUid}...`);
    
    const res = await fetch(`https://api.getpostman.com/collections/${collectionUid}`, {
      method: 'PUT',
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!res.ok) {
      throw new Error(`Erro na API do Postman (${res.status}): ${await res.text()}`);
    }

    const responseData = await res.json();
    
    console.log(`\n✅ Sucesso absoluto! A coleção "${responseData.collection.name}" (UID: ${responseData.collection.uid}) foi atualizada e sincronizada na nuvem do seu Postman Desktop!`);
    console.log(`🕒 Sincronizado às: ${new Date().toLocaleTimeString('pt-BR')}\n`);

  } catch (err) {
    console.error('❌ Erro ao enviar a coleção para o Postman Cloud:');
    console.error(err.message);
    process.exit(1);
  }
}

uploadPostman();
