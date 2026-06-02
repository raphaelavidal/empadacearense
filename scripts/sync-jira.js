const fs = require('fs');
const path = require('path');

// 1. Carregar variáveis de ambiente do .env manualmente (como fallback/facilidade)
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
const projectKey = process.env.JIRA_PROJECT_KEY;

if (!email || !token || !domain || !projectKey) {
  console.error('❌ Erro: Variáveis do Jira ausentes no .env!');
  console.error('Por favor, certifique-se de configurar JIRA_EMAIL, JIRA_API_TOKEN, JIRA_DOMAIN e JIRA_PROJECT_KEY.');
  process.exit(1);
}

// Limpar e padronizar o domínio
if (!domain.startsWith('http')) {
  domain = `https://${domain}`;
}
if (domain.endsWith('/')) {
  domain = domain.slice(0, -1);
}

async function fetchJiraTasks() {
  console.log(`🔍 Conectando ao Jira em: ${domain}...`);
  console.log(`📂 Buscando tarefas do projeto: ${projectKey}...`);

  // JQL para buscar tarefas não finalizadas ordenadas por atualização
  const jql = `project = "${projectKey}" AND statusCategory != Done ORDER BY rank ASC`;
  const url = `${domain}/rest/api/3/search/jql?jql=${encodeURIComponent(jql)}&fields=summary,status,priority,description`;
  const auth = Buffer.from(`${email}:${token}`).toString('base64');

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erro na API do Jira (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const issues = data.issues || [];

    console.log(`✅ Sucesso! Encontradas ${issues.length} tarefas pendentes.`);
    if (issues.length > 0) {
      console.log('Primeiro item:', JSON.stringify(issues[0], null, 2));
    }
    generateMarkdown(issues);

  } catch (error) {
    console.error('❌ Ocorreu um erro ao buscar as tarefas do Jira:');
    console.error(error.message);
    process.exit(1);
  }
}

function generateMarkdown(issues) {
  const outputPath = path.resolve(__dirname, '../jira-tasks.md');
  
  let mdContent = `# 📋 Tarefas Ativas do Jira (${projectKey})\n\n`;
  mdContent += `*Atualizado em: ${new Date().toLocaleString('pt-BR')}*\n\n`;
  mdContent += `Este arquivo foi gerado automaticamente pelo script de sincronização e contém as tarefas pendentes do board do Jira.\n\n`;
  
  if (issues.length === 0) {
    mdContent += `> 🎉 **Nenhuma tarefa pendente encontrada!** Todas as tarefas do projeto estão concluídas.\n`;
  } else {
    mdContent += `## 🚀 Backlog & Sprint Ativa\n\n`;
    
    issues.forEach(issue => {
      const key = issue.key;
      const summary = issue.fields.summary || 'Sem título';
      const status = issue.fields.status?.name || 'Pendente';
      const priority = issue.fields.priority?.name || 'Média';
      const descriptionObj = issue.fields.description;
      
      // Jira REST API v3 usa formato document/Atlassian Document Format (ADF) para descrição
      let description = '';
      if (descriptionObj && typeof descriptionObj === 'object') {
        description = parseADF(descriptionObj);
      } else if (typeof descriptionObj === 'string') {
        description = descriptionObj;
      }

      mdContent += `### 🟥 [${key}](${domain}/browse/${key}) - ${summary}\n`;
      mdContent += `- **Status:** \`${status}\`\n`;
      mdContent += `- **Prioridade:** \`${priority}\`\n`;
      if (description) {
        mdContent += `- **Descrição:**\n  \`\`\`text\n  ${description.trim().replace(/\n/g, '\n  ')}\n  \`\`\`\n`;
      }
      mdContent += `\n---\n\n`;
    });
  }

  fs.writeFileSync(outputPath, mdContent, 'utf-8');
  console.log(`💾 Arquivo gerado com sucesso em: ${outputPath}`);
}

// Função auxiliar simples para extrair texto de Atlassian Document Format (ADF)
function parseADF(doc) {
  if (!doc || !doc.content) return '';
  let text = '';
  
  function traverse(node) {
    if (node.type === 'text' && node.text) {
      text += node.text;
    }
    if (node.content) {
      node.content.forEach(traverse);
    }
    if (node.type === 'paragraph' || node.type === 'heading') {
      text += '\n';
    }
  }
  
  doc.content.forEach(traverse);
  return text;
}

fetchJiraTasks();
