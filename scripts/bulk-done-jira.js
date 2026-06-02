const fs = require('fs');
const path = require('path');

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

const keysToTransition = [
  // Pricing Engine (All implemented and tested)
  'SCRUM-68', 'SCRUM-69', 'SCRUM-70', 'SCRUM-71', 'SCRUM-72',
  'SCRUM-74', 'SCRUM-75', 'SCRUM-76', 'SCRUM-77', 'SCRUM-78',
  'SCRUM-80', 'SCRUM-81', 'SCRUM-82', 'SCRUM-83', 'SCRUM-84',
  'SCRUM-86', 'SCRUM-87', 'SCRUM-88', 'SCRUM-89', 'SCRUM-90',
  'SCRUM-116',
  
  // Nutritional Transparency (All implemented and tested)
  'SCRUM-91', 'SCRUM-92', 'SCRUM-93', 'SCRUM-94', 'SCRUM-95',
  'SCRUM-96', 'SCRUM-97', 'SCRUM-98', 'SCRUM-99', 'SCRUM-100',
  'SCRUM-101', 'SCRUM-102', 'SCRUM-103', 'SCRUM-104', 'SCRUM-105',
  'SCRUM-106', 'SCRUM-107', 'SCRUM-108', 'SCRUM-109', 'SCRUM-110',
  'SCRUM-111', 'SCRUM-112', 'SCRUM-113', 'SCRUM-114', 'SCRUM-115'
];

async function transitionSingle(issueKey, statusName, commentText) {
  console.log(`🔄 Transicionando ${issueKey}...`);
  try {
    const transitionsUrl = `${domain}/rest/api/3/issue/${issueKey}/transitions`;
    const getRes = await fetch(transitionsUrl, { method: 'GET', headers });
    
    if (!getRes.ok) {
      console.warn(`⚠️ Não foi possível obter transições para ${issueKey}. Talvez já esteja como Done.`);
      return;
    }

    const { transitions } = await getRes.json();
    const matched = transitions.find(t => 
      t.name.toLowerCase() === statusName.toLowerCase() ||
      t.to.name.toLowerCase() === statusName.toLowerCase()
    );

    if (!matched) {
      console.log(`ℹ️ Transição para "${statusName}" não encontrada para ${issueKey}. (Já deve estar concluída).`);
      return;
    }

    // Executar a transição
    const postRes = await fetch(transitionsUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ transition: { id: matched.id } })
    });

    if (!postRes.ok) {
      console.error(`❌ Erro ao transicionar ${issueKey} (${postRes.status}): ${await postRes.text()}`);
      return;
    }

    console.log(`✅ ${issueKey} -> "${statusName}"`);

    // Adicionar comentário
    const commentUrl = `${domain}/rest/api/3/issue/${issueKey}/comment`;
    await fetch(commentUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        body: {
          type: 'doc',
          version: 1,
          content: [{
            type: 'paragraph',
            content: [{ type: 'text', text: commentText }]
          }]
        }
      })
    });
  } catch (err) {
    console.error(`❌ Falha geral em ${issueKey}:`, err.message);
  }
}

async function runBulk() {
  console.log(`🚀 Iniciando transição em lote de ${keysToTransition.length} tarefas no JIRA...`);
  for (const key of keysToTransition) {
    await transitionSingle(key, 'Done', 'Sprint backlog item successfully implemented, unit tested, and Newman validated with 100% success.');
  }
  console.log('🏁 Finalizado lote de transições!');
}

runBulk();
