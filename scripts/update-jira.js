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

const email = process.env.JIRA_EMAIL;
const token = process.env.JIRA_API_TOKEN;
let domain = process.env.JIRA_DOMAIN;

if (!email || !token || !domain) {
  console.error('❌ Erro: Variáveis do Jira ausentes no .env!');
  process.exit(1);
}

if (!domain.startsWith('http')) domain = `https://${domain}`;
if (domain.endsWith('/')) domain = domain.slice(0, -1);

const auth = Buffer.from(`${email}:${token}`).toString('base64');
const headers = {
  'Authorization': `Basic ${auth}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

const issueKey = process.argv[2];
const targetStatusName = process.argv[3]; // Ex: "Done", "Concluído", "Em Andamento"
const commentText = process.argv[4];      // Ex: "Fiz o DTO de listagem."

if (!issueKey || !targetStatusName) {
  console.log('\n📖 Como usar o script de transição:');
  console.log('node scripts/update-jira.js <CHAVE-DA-TASK> <NOME-DO-STATUS-OU-TRANSICAO> "[COMENTARIO]"\n');
  console.log('Exemplos:');
  console.log('node scripts/update-jira.js SCRUM-19 "Done" "Cadastro concluído e testes passando."');
  console.log('node scripts/update-jira.js SCRUM-20 "Done" "Paginação e busca adicionadas com sucesso!"\n');
  process.exit(0);
}

async function updateJiraIssue() {
  console.log(`🔄 Iniciando atualização da tarefa: ${issueKey}...`);

  try {
    // 1. Obter transições disponíveis para a issue
    const transitionsUrl = `${domain}/rest/api/3/issue/${issueKey}/transitions`;
    const getRes = await fetch(transitionsUrl, { method: 'GET', headers });
    
    if (!getRes.ok) {
      throw new Error(`Erro ao buscar transições (${getRes.status}): ${await getRes.text()}`);
    }

    const { transitions } = await getRes.json();
    
    // Procurar transição compatível
    const matchedTransition = transitions.find(t => 
      t.name.toLowerCase() === targetStatusName.toLowerCase() ||
      t.to.name.toLowerCase() === targetStatusName.toLowerCase()
    );

    if (!matchedTransition) {
      console.error(`❌ Erro: Transição para "${targetStatusName}" não encontrada.`);
      console.log('Transições disponíveis para esta tarefa:');
      transitions.forEach(t => console.log(` - ID: ${t.id} | Nome: "${t.name}" -> Para: "${t.to.name}"`));
      process.exit(1);
    }

    console.log(`🎯 Transição encontrada: "${matchedTransition.name}" (ID: ${matchedTransition.id})`);

    // 2. Executar a transição
    const postRes = await fetch(transitionsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        transition: {
          id: matchedTransition.id
        }
      })
    });

    if (!postRes.ok) {
      throw new Error(`Erro ao transicionar issue (${postRes.status}): ${await postRes.text()}`);
    }

    console.log(`✅ Sucesso! Status da tarefa ${issueKey} atualizado para "${targetStatusName}".`);

    // 3. Adicionar comentário (opcional)
    if (commentText) {
      console.log(`💬 Adicionando comentário na tarefa...`);
      const commentUrl = `${domain}/rest/api/3/issue/${issueKey}/comment`;
      
      const commentRes = await fetch(commentUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          body: {
            type: 'doc',
            version: 1,
            content: [
              {
                type: 'paragraph',
                content: [
                  {
                    type: 'text',
                    text: commentText
                  }
                ]
              }
            ]
          }
        })
      });

      if (!commentRes.ok) {
        console.warn(`⚠️ Comentário não pôde ser enviado (${commentRes.status}): ${await commentRes.text()}`);
      } else {
        console.log(`💬 Comentário adicionado com sucesso!`);
      }
    }

  } catch (error) {
    console.error(`❌ Ocorreu um erro ao atualizar o Jira:`);
    console.error(error.message);
    process.exit(1);
  }
}

updateJiraIssue();
