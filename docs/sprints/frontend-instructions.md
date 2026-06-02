# Guia de Design & Diretrizes de Frontend (Mobile-First)

Este documento estabelece as especificações de design, experiência do usuário (UX/UI) e engenharia de prompts para a criação de uma interface de frontend equilibrada, elegante e extremamente simples de usar, projetada especificamente para **empreendedoras gastronômicas artesanais**.

---

## 📱 1. Diretrizes de UX/UI Mobile-First (Otimizadas para Cozinha)

Empreendedoras da culinária artesanal usam o celular **enquanto trabalham**, muitas vezes na própria cozinha, com mãos ocupadas ou engorduradas. O design deve refletir essa realidade física:

*   **Telas Limpas e Livre de Ruído:** Zero poluição visual. Cada fluxo de tela deve resolver apenas uma ação por vez.
*   **Alvos de Toque Generosos:** Botões com tamanho mínimo de `48px × 48px` para evitar toques acidentais com dedos molhados ou engordurados.
*   **Inputs Simplificados:** Minimizar a digitação. Usar seletores rápidos, sliders de porcentagem de lucro (ex: de 50% a 200%) e botões de incremento/decremento (`+` e `-`).
*   **Modo de Visualização "Cozinha" (Hands-Free):** Um modo de tela cheia com letras grandes para ler o modo de preparo da receita mantendo o celular apoiado na bancada sem precisar tocá-lo constantemente.

---

## 🎨 2. Direcionamento Estético e Paleta de Cores

Evitar o visual "corporativo corporativo frio" ou "tecnologia escura". A estética deve transmitir calor humano, cuidado artesanal, confiança e saudabilidade:

*   **Estilo:** Minimalismo acolhedor (*Cozy Minimalist*). Bordas arredondadas generosas (`rounded-2xl` a `rounded-3xl`), sombras muito suaves e profundidade delicada.
*   **Paleta de Cores Sugerida:**
    *   **Terracota Suave/Argila (`Primary`):** Transmite o calor do forno e a tradição cearense artesanal.
    *   **Verde Oliva Claro (`Success/Natural`):** Usado para destacar o selo de classificação "Natural" e "Clean Label".
    *   **Creme/Areia de Fundo (`Background`):** Tom aconchegante que acalma a vista (evitando o branco puro hospitalar).
    *   **Chocolate Escuro (`Text`):** Para legibilidade premium das tipografias.

---

## 📋 3. Arquitetura das Telas Principais

### Tela A: O Dashboard Executivo
- **Destaque Visual:** Resumo mensal simplificado de "Faturamento Esperado" vs "Custo de Produção".
- **Lista de Acesso Rápido:** Receitas mais lucrativas em destaque.

### Tela B: Calculadora e Breakdown de Custo da Receita
- **Visão Principal:** Exibição do "Preço Sugerido" em tamanho gigante com destaque visual.
- **Breakdown Gráfico:** Gráfico de setores (pizza) simplificado dividindo o preço sugerido em: **CMV** (ingredientes), **Mão de Obra** (tempo), **Custo Operacional** (gás/energia), **Embalagem** e **Lucro Líquido**.
- **Ajuste Dinâmico:** Um slider interativo para alterar a margem de lucro e ver o preço de venda sugerido flutuar em tempo real.

### Tela C: Ficha Técnica & Rótulo Nutricional
- **Selo NOVA em Destaque:** O selo "Natural", "Processado" ou "Ultraprocessado" no topo com explicações claras sobre o porquê de cada classificação de forma didática.

---

## 🤖 4. Minha Capacidade vs IAs Especializadas de Frontend

### 🧠 Como Eu (Antigravity) Posso Te Ajudar Diretamente
**Sim, eu sou 100% capaz de criar o seu frontend completo e conectá-lo a este backend NestJS aqui mesmo no repositório!** 
- Eu posso inicializar um projeto em **React (com Vite e Tailwind CSS)** ou **Next.js** na pasta raiz.
- Posso programar as conexões de API (Axios/Fetch), estruturar os componentes baseados em boas práticas mobile-first e construir uma UI linda usando CSS customizado.
- **Vantagem:** Eu tenho o contexto total das suas tabelas de banco de dados (`Prisma`), APIs de custos e DTOs de classificação NOVA. Eu crio o código integrado pronto para rodar.

### 🌟 Quando Usar Outras IAs Especializadas
Se você deseja gerar protótipos de interfaces visuais em segundos apenas para validação visual ou interações ultra rápidas em nuvem:
*   **v0.dev (by Vercel):** A melhor IA do mundo para gerar componentes **React + Tailwind + Shadcn UI** a partir de um prompt textual. Perfeito para copiar e colar blocos de layout inteiros.
*   **Bolt.new (by StackBlitz):** Cria e roda aplicações full-stack diretamente no navegador. Ótimo para brincar e testar ideias sem mexer na sua máquina.

---

## 📝 5. Prompt de Alta Fidelidade (Engenharia de Prompt)

Caso você decida pedir para mim (Antigravity) iniciar o frontend no próximo ciclo, ou queira alimentar o **v0.dev** ou **Bolt.new**, copie e use o prompt estruturado abaixo:

```text
Crie uma aplicação Web Frontend Mobile-First responsiva em React, Tailwind CSS e Lucide Icons chamada "Empada Cearense - Gestão e CMV". 
O design deve ser focado em microempreendedoras de confeitaria/gastronomia artesanal.

Estética do Design:
- Cozy Minimalist: Tons acolhedores (Fundo creme #FAF8F5, Primária Terracota #C87A53, Sucesso Verde Oliva #608066, Texto principal #2B1D16).
- Bordas bastante arredondadas (rounded-2xl ou rounded-3xl), sombras sutis, fontes elegantes e limpas (semelhante a Inter/Outfit).
- Layout vertical otimizado para celulares rápidos.

Telas Necessárias:
1. Dashboard de Entrada:
   - Exibe dois cards simplificados de topo: "Rendimento Médio" e "Preço de Venda Praticado".
   - Exibe a lista das receitas com um chip colorido indicando sua classificação NOVA (Verde para "Natural", Amarelo para "Processada", Vermelho para "Contém ultraprocessados").
2. Detalhe e Breakdown de Custos da Receita (Ex: GET /recipes/:id/cost):
   - Exibe em destaque no topo o preço unitário sugerido de venda com fonte gigante.
   - Um slider interativo interconectado para que o usuário ajuste a Margem de Lucro % (de 50% a 200%) e veja o preço sugerido recalcular instantaneamente.
   - Um gráfico de pizza ou barras horizontais empilhadas mostrando a divisão proporcional: Ingredientes (CMV), Mão de Obra (Tempo), Custos Indiretos (Gás/Luz) e Embalagem.
3. Ficha Técnica da Receita:
   - Mostra o selo NOVA consolidado com explicações simples.
   - Lista os ingredientes da receita mostrando de forma compacta: quantidade, composição do rótulo e se é "Verificado".
   - Passo a passo de preparo estruturado em modo de "Visualização Cozinha" (Letras grandes, contraste alto e botão para marcar passos concluídos).

Garanta que todos os botões e áreas clicáveis tenham no mínimo 48px de altura para uso fácil na cozinha com mãos ocupadas. Torne as animações de transição suaves.
```
