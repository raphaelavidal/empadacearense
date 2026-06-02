import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  ChefHat, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Package, 
  Coins, 
  Info, 
  Trash2, 
  Check, 
  FileText,
  AlertCircle,
  HelpCircle,
  Activity,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function App() {
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('recipes');

  // Interactive Terminology Explainers Modal or Sidebar
  const [explainerKey, setExplainerKey] = useState(null);

  // Global Financial Configurations (Operational Costs)
  const [config, setConfig] = useState({
    hourlyRate: 20.00,       // "Salário" da confeiteira por hora de trabalho
    profitMargin: 100.00,     // Margem de lucro desejada em %
    operationalTax: 15.00,   // Taxa de custos invisíveis (gás, água, luz) em %
    packagingCost: 1.00,     // Custo unitário da embalagem/sacola
  });

  // Mock Database - Ingredients
  const [ingredients, setIngredients] = useState([
    { id: 1, name: 'Farinha de Trigo', brand: 'Dona Benta', unit: 'KG', novaClassification: 'NOVA_1', compositionLabel: 'Farinha de trigo enriquecida com ferro e ácido fólico.', isNovaVerified: true, purchasePrice: 5.50, purchaseQuantity: 1.00 },
    { id: 2, name: 'Manteiga', brand: 'Aviação', unit: 'KG', novaClassification: 'NOVA_2', compositionLabel: 'Creme de leite pasteurizado, sal.', isNovaVerified: true, purchasePrice: 32.00, purchaseQuantity: 0.50 },
    { id: 3, name: 'Ovos', brand: 'Granja Cearense', unit: 'UNIT', novaClassification: 'NOVA_1', compositionLabel: 'Ovos caipiras frescos.', isNovaVerified: true, purchasePrice: 12.00, purchaseQuantity: 12 },
    { id: 4, name: 'Frango Desfiado', brand: 'Sadia', unit: 'KG', novaClassification: 'NOVA_1', compositionLabel: 'Peito de frango congelado.', isNovaVerified: true, purchasePrice: 22.00, purchaseQuantity: 1.00 },
    { id: 5, name: 'Requeijão Cremoso', brand: 'Nestlé', unit: 'KG', novaClassification: 'NOVA_3', compositionLabel: 'Leite, creme de leite, cloreto de sódio, fermento lácteo.', isNovaVerified: false, purchasePrice: 18.00, purchaseQuantity: 0.40 },
    { id: 6, name: 'Aditivos e Conservantes Industriais', brand: 'Química Food', unit: 'KG', novaClassification: 'NOVA_4', compositionLabel: 'Ácido sórbico, benzoato de sódio, aromatizantes artificiais de fumaça, estabilizantes.', isNovaVerified: true, purchasePrice: 50.00, purchaseQuantity: 1.00 },
  ]);

  // Mock Database - Recipes
  const [recipes, setRecipes] = useState([
    {
      id: 1,
      name: 'Empada Cearense de Frango',
      description: 'Nossa famosa empada folhada com temperos típicos e recheio cremoso.',
      yield: 12,
      yieldUnit: 'UNIT',
      prepTime: 45,
      category: 'Salgados',
      prepMethod: 'Misturar a farinha e manteiga até obter a massa podre. Rechear com frango e assar.',
      ingredients: [
        { ingredientId: 1, quantity: 0.300 }, // 300g Farinha
        { ingredientId: 2, quantity: 0.150 }, // 150g Manteiga
        { ingredientId: 3, quantity: 2 },     // 2 Ovos
        { ingredientId: 4, quantity: 0.250 }, // 250g Frango
        { ingredientId: 5, quantity: 0.100 }, // 100g Requeijão
      ],
      steps: [
        { id: 1, order: 1, description: 'Misturar farinha, manteiga e 1 ovo até obter massa lisa.' },
        { id: 2, order: 2, description: 'Modelar metade da massa nas forminhas de empada.' },
        { id: 3, order: 3, description: 'Rechear com o frango cozido misturado ao requeijão.' },
        { id: 4, order: 4, description: 'Fechar com tampa de massa, pincelar com ovo e assar a 180°C por 30 minutos.' },
      ]
    },
    {
      id: 2,
      name: 'Empada Doce de Leite Premium',
      description: 'Empadinha de sobremesa feita com massa doce recheada.',
      yield: 10,
      yieldUnit: 'UNIT',
      prepTime: 30,
      category: 'Doces',
      prepMethod: 'Massa podre doce assada e recheada com doce de leite caseiro.',
      ingredients: [
        { ingredientId: 1, quantity: 0.200 },
        { ingredientId: 2, quantity: 0.100 },
        { ingredientId: 3, quantity: 1 },
      ],
      steps: [
        { id: 1, order: 1, description: 'Fazer a massa doce e assar nas forminhas vazias.' },
        { id: 2, order: 2, description: 'Preencher com o recheio cremoso gelado.' }
      ]
    }
  ]);

  // Dictionary of explanations for terms
  const termsExplanations = {
    novaClassification: {
      title: "Classificação NOVA (Nível de Processamento)",
      desc: "É um método recomendado por cientistas de saúde do Brasil para entender o quão natural é um ingrediente. Ele divide os alimentos em 4 níveis:",
      bullets: [
        "🌱 Grupo 1: Natural ou Minimamente Processado (Ovos, farinha pura, frango, leite). São excelentes para a saúde!",
        "🧈 Grupo 2: Ingredientes Culinários (Manteiga, sal, açúcar, óleos). Usados para dar sabor às preparações do dia a dia.",
        "🧀 Grupo 3: Alimentos Processados (Queijos tradicionais, conservas simples, pães artesanais). Fabricados com sal ou açúcar adicionados.",
        "🧪 Grupo 4: Ultraprocessados (Aditivos químicos, corantes artificiais, conservantes industriais). Alimentos artificiais. Se sua receita contiver pelo menos um ingrediente do Grupo 4, ela receberá um rótulo de alerta."
      ],
      tip: "💡 Dica de Negócio: Se você usar apenas ingredientes do Grupo 1 e 2, você pode anunciar suas empadas como '100% Naturais'. Clientes premium pagam até 30% a mais por produtos saudáveis!"
    },
    hourlyRate: {
      title: "Seu Valor-Hora (Mão de Obra)",
      desc: "Seu tempo vale ouro! A mão de obra é o pagamento pelo tempo real que você gasta preparando a receita. Muitas confeiteiras e salgadeiras não calculam isso e acabam trabalhando de graça.",
      example: "Exemplo: Se você quer um salário de R$ 3.200,00 por mês trabalhando 160 horas (40 horas por semana), o seu valor-hora é de R$ 20,00. Se uma receita demora 30 minutos de trabalho manual, o sistema adiciona automaticamente R$ 10,00 ao custo da receita para pagar o seu salário!",
      tip: "💡 Nunca trabalhe de graça. O lucro da sua empresa só deve ser calculado depois de pagar as horas de trabalho do seu próprio salário!"
    },
    operationalTax: {
      title: "Despesas Invisíveis (Taxa Operacional)",
      desc: "São os custos que você não consegue ver facilmente no prato final, mas que pesam no fim do mês: o gás de cozinha, a eletricidade do forno, a água para lavar a louça e os produtos de limpeza.",
      example: "Para simplificar a sua vida e evitar fórmulas matemáticas complexas de engenharia, adicionamos uma taxinha padrão de 15% sobre o custo dos ingredientes. Se você gastou R$ 10,00 em ingredientes, adicionamos R$ 1,50 para pagar a conta de água, gás e luz!",
      tip: "💡 Não ignore estes custos. Pequenas despesas somadas representam a diferença entre lucrar ou falir no final do mês."
    },
    profitMargin: {
      title: "Margem de Lucro Real",
      desc: "O lucro NÃO é o salário da cozinheira! O lucro é o dinheiro limpo que sobra para a sua empresa crescer após pagar todas as contas de produção (ingredientes, mão de obra, água/luz e embalagem).",
      bullets: [
        "Usado para comprar batedeiras melhores, reformar a cozinha ou investir em propagandas.",
        "Sugerimos manter a margem de lucro entre 80% e 150% para salgados e doces finos artesanais."
      ],
      tip: "💡 Dica: Um produto vendido sem lucro faz seu negócio ficar estagnado. Valorize seu empenho e sua marca!"
    }
  };

  // Helper calculation for recipe costs
  const calculateCosts = (recipe) => {
    let totalBaseCost = 0;
    const ingredientsCosts = (recipe.ingredients || []).map(ri => {
      const ing = ingredients.find(i => i.id === ri.ingredientId);
      if (!ing) return { proportionalCost: 0 };
      const propCost = Number(((Number(ing.purchasePrice) / Number(ing.purchaseQuantity)) * Number(ri.quantity)).toFixed(2));
      totalBaseCost += propCost;
      return {
        ...ri,
        name: ing.name,
        unit: ing.unit,
        novaClassification: ing.novaClassification,
        proportionalCost: propCost
      };
    });

    const yieldQty = Number(recipe.yield);
    const unitBaseCost = yieldQty > 0 ? Number((totalBaseCost / yieldQty).toFixed(2)) : 0;

    // Labor Cost: (prepTime / 60) * config.hourlyRate
    const laborCost = Number(((recipe.prepTime / 60) * config.hourlyRate).toFixed(2));

    // Kitchen Overhead (operationalTax over raw ingredients)
    const operationalCost = Number((totalBaseCost * (config.operationalTax / 100)).toFixed(2));

    // Packaging cost per unit yield
    const packagingCost = Number(config.packagingCost);

    // Total Production Cost = Ingredients + Labor + Overhead + (Packaging * Yield)
    const totalProductionCost = Number((totalBaseCost + laborCost + operationalCost + (packagingCost * yieldQty)).toFixed(2));

    // Profit Amount
    const profitAmount = Number((totalProductionCost * (config.profitMargin / 100)).toFixed(2));

    // Suggested sell price total and unit
    const suggestedPrice = Number((totalProductionCost + profitAmount).toFixed(2));
    const unitSuggestedPrice = yieldQty > 0 ? Number((suggestedPrice / yieldQty).toFixed(2)) : 0;

    // Automatically determine Recipe NOVA Classification
    const hasNova4 = ingredientsCosts.some(c => c.novaClassification === 'NOVA_4');
    const hasNova3 = ingredientsCosts.some(c => c.novaClassification === 'NOVA_3');
    
    let classification = 'Natural';
    if (hasNova4) classification = 'Contém ultraprocessados';
    else if (hasNova3) classification = 'Processada';

    return {
      totalBaseCost,
      unitBaseCost,
      laborCost,
      operationalCost,
      packagingCost: packagingCost * yieldQty,
      totalProductionCost,
      profitAmount,
      suggestedPrice,
      unitSuggestedPrice,
      classification,
      ingredientsDetails: ingredientsCosts
    };
  };

  // --- WIZARD STATE FOR NEW RECIPE ---
  const [wizardStep, setWizardStep] = useState(1);
  const [newRecipe, setNewRecipe] = useState({
    name: '',
    description: '',
    yield: 12,
    yieldUnit: 'UNIT',
    prepTime: 45,
    category: 'Salgados',
    prepMethod: '',
    ingredients: [], // Array or { ingredientId, quantity }
  });
  
  const [selectedIngs, setSelectedIngs] = useState({}); // { [id]: quantity_string }

  const handleToggleIngredient = (id) => {
    setSelectedIngs(prev => {
      const updated = { ...prev };
      if (updated[id] !== undefined) {
        delete updated[id];
      } else {
        updated[id] = '100'; // Default quantity: 100g
      }
      return updated;
    });
  };

  const handleIngQuantityChange = (id, val) => {
    setSelectedIngs(prev => ({
      ...prev,
      [id]: val
    }));
  };

  const handleSaveRecipe = () => {
    if (!newRecipe.name) {
      alert('Por favor, dê um nome carinhoso para a sua receita!');
      return;
    }
    const mappedIngredients = Object.keys(selectedIngs).map(idKey => {
      const ing = ingredients.find(i => i.id === Number(idKey));
      const parsedQty = Number(selectedIngs[idKey]);
      // Convert to KG/L if unit is G/ML for calculation
      const quantity = (ing.unit === 'G' || ing.unit === 'ML') ? parsedQty : (ing.unit === 'KG' || ing.unit === 'L' ? parsedQty / 1000 : parsedQty);
      return {
        ingredientId: Number(idKey),
        quantity
      };
    });

    const created = {
      ...newRecipe,
      id: recipes.length + 1,
      ingredients: mappedIngredients,
      steps: []
    };

    setRecipes(prev => [created, ...prev]);
    // Reset wizard
    setNewRecipe({
      name: '',
      description: '',
      yield: 12,
      yieldUnit: 'UNIT',
      prepTime: 45,
      category: 'Salgados',
      prepMethod: '',
      ingredients: [],
    });
    setSelectedIngs({});
    setWizardStep(1);
    setActiveTab('recipes');
  };

  // --- INGREDIENT REGISTRATION STATE ---
  const [showAddIngForm, setShowAddIngForm] = useState(false);
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    brand: '',
    unit: 'KG',
    novaClassification: 'NOVA_1',
    compositionLabel: '',
    purchasePrice: '',
    purchaseQuantity: '',
    isNovaVerified: false
  });

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (!newIngredient.name || !newIngredient.purchasePrice || !newIngredient.purchaseQuantity) {
      alert('Preencha os campos obrigatórios para o ingrediente!');
      return;
    }
    const created = {
      ...newIngredient,
      id: ingredients.length + 1,
      purchasePrice: Number(newIngredient.purchasePrice),
      purchaseQuantity: Number(newIngredient.purchaseQuantity),
      isNovaVerified: true // Auto verified because chef knows it
    };
    setIngredients(prev => [...prev, created]);
    setNewIngredient({
      name: '',
      brand: '',
      unit: 'KG',
      novaClassification: 'NOVA_1',
      compositionLabel: '',
      purchasePrice: '',
      purchaseQuantity: '',
      isNovaVerified: false
    });
    setShowAddIngForm(false);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] pb-24 text-[#2b1d16] font-sans">
      
      {/* 🥞 HEADER / BRANDING */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#f0eae1] px-6 py-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#f5eae4] p-2.5 rounded-2xl text-[#c87a53]">
            <ChefHat size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#2b1d16]">Empada Cearense</h1>
            <p className="text-xs text-[#6e5e55] font-medium">Finanças e Nutrição Descomplicada para Boleiras e Salgadeiras 🥧</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => { setActiveTab('wizard'); setWizardStep(1); }}
            className="cozy-btn text-sm px-4 py-2"
          >
            <Plus size={18} />
            Nova Receita
          </button>
        </div>
      </header>

      {/* 📱 VIEWPORT WRAPPER */}
      <main className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
        
        {/* 📚 TAB SELECTOR */}
        <div className="flex bg-[#ebdcd3]/40 p-1.5 rounded-2xl mb-8 max-w-md">
          <button 
            onClick={() => setActiveTab('recipes')}
            className={`flex-1 py-3 text-center font-bold rounded-xl text-sm flex items-center justify-center gap-2 ${activeTab === 'recipes' ? 'bg-white text-[#c87a53] shadow-sm' : 'text-[#6e5e55]'}`}
          >
            <Sparkles size={16} />
            Minhas Delícias
          </button>
          <button 
            onClick={() => setActiveTab('ingredients')}
            className={`flex-1 py-3 text-center font-bold rounded-xl text-sm flex items-center justify-center gap-2 ${activeTab === 'ingredients' ? 'bg-white text-[#c87a53] shadow-sm' : 'text-[#6e5e55]'}`}
          >
            <Package size={16} />
            Despensa de Compras
          </button>
          <button 
            onClick={() => setActiveTab('config')}
            className={`flex-1 py-3 text-center font-bold rounded-xl text-sm flex items-center justify-center gap-2 ${activeTab === 'config' ? 'bg-white text-[#c87a53] shadow-sm' : 'text-[#6e5e55]'}`}
          >
            <Coins size={16} />
            Minhas Taxas
          </button>
        </div>

        {/* 💡 EXPLANATION DRAWER SIDEBAR */}
        {explainerKey && (
          <div className="fixed inset-0 z-50 bg-[#2b1d16]/30 backdrop-blur-sm flex justify-center items-end sm:items-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-lg w-full cozy-card animate-fade-in relative">
              <button 
                onClick={() => setExplainerKey(null)}
                className="absolute top-4 right-4 text-[#6e5e55] font-bold text-lg hover:text-[#2b1d16] bg-[#faf8f5] w-8 h-8 rounded-full flex items-center justify-center"
              >
                ✕
              </button>
              <div className="flex items-start gap-4 mt-2">
                <div className="bg-[#f5eae4] p-3 rounded-2xl text-[#c87a53]">
                  <HelpCircle size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2b1d16]">{termsExplanations[explainerKey].title}</h3>
                  <p className="text-[#6e5e55] mt-3 text-base leading-relaxed">{termsExplanations[explainerKey].desc}</p>
                  
                  {termsExplanations[explainerKey].bullets && (
                    <ul className="mt-4 space-y-2.5">
                      {termsExplanations[explainerKey].bullets.map((b, i) => (
                        <li key={i} className="text-[#2b1d16] font-medium text-sm leading-relaxed">{b}</li>
                      ))}
                    </ul>
                  )}

                  {termsExplanations[explainerKey].example && (
                    <div className="bg-[#faf8f5] border border-[#f0eae1] p-4 rounded-2xl mt-4 text-[#6e5e55] text-sm italic leading-relaxed">
                      {termsExplanations[explainerKey].example}
                    </div>
                  )}

                  <div className="bg-[#ebf2ec] border border-[#d6e3d8] text-[#608066] p-4 rounded-2xl mt-5 text-sm font-semibold flex gap-2">
                    <span>{termsExplanations[explainerKey].tip}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/*   TAB: MY DELIGHTS / RECIPES LIST       */}
        {/* ======================================= */}
        {activeTab === 'recipes' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-[#2b1d16]">Suas Receitas Cadastradas</h2>
                <p className="text-sm text-[#6e5e55]">Veja abaixo o preço de venda sugerido e a nota de saúde de cada receita de forma simples.</p>
              </div>
            </div>

            <div className="layout-grid">
              {recipes.map(recipe => {
                const costs = calculateCosts(recipe);
                return (
                  <div key={recipe.id} className="cozy-card animate-fade-in flex flex-col justify-between h-full">
                    <div>
                      {/* Recipe Header */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#c87a53] bg-[#f5eae4] px-2.5 py-1 rounded-lg">
                          {recipe.category}
                        </span>
                        
                        {/* Selo NOVA Acolhedor */}
                        {costs.classification === 'Natural' && (
                          <span className="cozy-badge cozy-badge-natural text-xs cursor-pointer" onClick={() => setExplainerKey('novaClassification')}>
                            🌱 Super Natural
                          </span>
                        )}
                        {costs.classification === 'Processada' && (
                          <span className="cozy-badge cozy-badge-processed text-xs cursor-pointer" onClick={() => setExplainerKey('novaClassification')}>
                            🧈 Caseiro Simples
                          </span>
                        )}
                        {costs.classification === 'Contém ultraprocessados' && (
                          <span className="cozy-badge cozy-badge-ultra text-xs cursor-pointer" onClick={() => setExplainerKey('novaClassification')}>
                            ⚠️ Ultraprocessado
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-[#2b1d16] mb-1">{recipe.name}</h3>
                      <p className="text-xs text-[#6e5e55] line-clamp-2 mb-4">{recipe.description || 'Sem descrição cadastrada.'}</p>
                      
                      {/* Cost metrics */}
                      <div className="grid grid-cols-2 gap-3 bg-[#faf8f5] p-3 rounded-2xl mb-4 border border-[#f0eae1]">
                        <div>
                          <p className="text-[10px] text-[#6e5e55] font-bold uppercase">Custo p/ Produzir</p>
                          <p className="text-sm font-extrabold text-[#2b1d16]">R$ {(costs.totalProductionCost / recipe.yield).toFixed(2)} <span className="text-[10px] font-normal text-[#6e5e55]">unidade</span></p>
                        </div>
                        <div>
                          <p className="text-[10px] text-[#c87a53] font-bold uppercase flex items-center gap-1">
                            Venda Sugerida 
                            <HelpCircle size={10} className="cursor-pointer" onClick={() => setExplainerKey('profitMargin')} />
                          </p>
                          <p className="text-sm font-extrabold text-[#608066]">R$ {costs.unitSuggestedPrice.toFixed(2)} <span className="text-[10px] font-normal text-[#6e5e55]">unidade</span></p>
                        </div>
                      </div>

                      {/* Recipe Stats */}
                      <div className="flex items-center gap-4 text-xs text-[#6e5e55] font-semibold mb-4">
                        <span className="flex items-center gap-1"><Clock size={14} /> {recipe.prepTime} min</span>
                        <span className="flex items-center gap-1"><Package size={14} /> Rende {recipe.yield} {recipe.yieldUnit === 'UNIT' ? 'unidades' : recipe.yieldUnit}</span>
                      </div>
                    </div>

                    <div className="border-t border-[#f0eae1] pt-4 mt-2 flex gap-2">
                      <button 
                        onClick={() => {
                          // Quick view modal or open detailed view
                          alert(`Ficha técnica da receita: ${recipe.name}\n\nIngredientes:\n${costs.ingredientsDetails.map(i => `- ${i.name}: ${i.quantity * (i.unit === 'KG' || i.unit === 'L' ? 1000 : 1)} ${i.unit === 'KG' || i.unit === 'L' ? 'g/ml' : i.unit}`).join('\n')}\n\nPreço sugerido: R$ ${costs.unitSuggestedPrice} / un`);
                        }}
                        className="cozy-btn-secondary text-xs flex-1 py-2"
                      >
                        <FileText size={14} />
                        Ficha Técnica
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Deseja excluir esta receita carinhosa?')) {
                            setRecipes(prev => prev.filter(r => r.id !== recipe.id));
                          }
                        }}
                        className="p-2 text-[#c95252] hover:bg-red-50 rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/*   TAB: INGREDIENTS LIST / DESPENSA     */}
        {/* ======================================= */}
        {activeTab === 'ingredients' && (
          <div>
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-[#2b1d16]">Sua Despensa de Insumos</h2>
                <p className="text-sm text-[#6e5e55]">Cadastre os ingredientes como você compra no supermercado. Calculamos a fração exata usada na receita!</p>
              </div>
              <button 
                onClick={() => setShowAddIngForm(!showAddIngForm)}
                className="cozy-btn text-sm"
              >
                <Plus size={16} />
                {showAddIngForm ? 'Fechar Cadastro' : 'Cadastrar Ingrediente'}
              </button>
            </div>

            {/* Form for new ingredient */}
            {showAddIngForm && (
              <div className="cozy-card bg-[#faf8f5]/50 border-2 border-[#ebdcd3] rounded-3xl p-6 mb-8 animate-fade-in">
                <h3 className="text-lg font-bold text-[#2b1d16] mb-4">Novo Ingrediente</h3>
                <form onSubmit={handleAddIngredient} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Nome do Ingrediente *</label>
                    <input 
                      type="text" 
                      placeholder="Ex: Açúcar Refinado"
                      className="cozy-input"
                      value={newIngredient.name}
                      onChange={e => setNewIngredient(p => ({ ...p, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Marca (Opcional)</label>
                    <input 
                      type="text" 
                      placeholder="Ex: União"
                      className="cozy-input"
                      value={newIngredient.brand}
                      onChange={e => setNewIngredient(p => ({ ...p, brand: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Tipo de Medida *</label>
                    <select 
                      className="cozy-input"
                      value={newIngredient.unit}
                      onChange={e => setNewIngredient(p => ({ ...p, unit: e.target.value }))}
                    >
                      <option value="KG">Quilo (KG)</option>
                      <option value="G">Grama (G)</option>
                      <option value="L">Litro (L)</option>
                      <option value="ML">Mililitro (ML)</option>
                      <option value="UNIT">Unidade (Ex: Ovo, Embalagem)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Preço Pago no Pacote * (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Ex: 5.50"
                      className="cozy-input"
                      value={newIngredient.purchasePrice}
                      onChange={e => setNewIngredient(p => ({ ...p, purchasePrice: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Quantidade no Pacote *</label>
                    <input 
                      type="number" 
                      step="0.01"
                      placeholder="Ex: 1"
                      className="cozy-input"
                      value={newIngredient.purchaseQuantity}
                      onChange={e => setNewIngredient(p => ({ ...p, purchaseQuantity: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1 flex items-center gap-1">
                      Nível de Saúde (NOVA) *
                      <HelpCircle size={12} className="cursor-pointer text-[#c87a53]" onClick={() => setExplainerKey('novaClassification')} />
                    </label>
                    <select 
                      className="cozy-input"
                      value={newIngredient.novaClassification}
                      onChange={e => setNewIngredient(p => ({ ...p, novaClassification: e.target.value }))}
                    >
                      <option value="NOVA_1">Grupo 1 - Muito Natural</option>
                      <option value="NOVA_2">Grupo 2 - Ingrediente Simples</option>
                      <option value="NOVA_3">Grupo 3 - Processado Caseiro</option>
                      <option value="NOVA_4">Grupo 4 - Industrializado Químico</option>
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Ingredientes contidos no Rótulo *</label>
                    <textarea 
                      placeholder="Digite a lista de ingredientes que vem descrita no rótulo..."
                      className="cozy-input"
                      rows={2}
                      value={newIngredient.compositionLabel}
                      onChange={e => setNewIngredient(p => ({ ...p, compositionLabel: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="md:col-span-3 flex justify-end gap-2 mt-2">
                    <button type="button" onClick={() => setShowAddIngForm(false)} className="cozy-btn-secondary text-sm">Cancelar</button>
                    <button type="submit" className="cozy-btn text-sm">Salvar Ingrediente</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-3xl border border-[#f0eae1] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#faf8f5] border-b border-[#f0eae1]">
                      <th className="p-4 text-xs font-extrabold uppercase text-[#6e5e55]">Nome / Marca</th>
                      <th className="p-4 text-xs font-extrabold uppercase text-[#6e5e55]">Preço Pacote</th>
                      <th className="p-4 text-xs font-extrabold uppercase text-[#6e5e55]">Qtd. Embalagem</th>
                      <th className="p-4 text-xs font-extrabold uppercase text-[#6e5e55]">Selo de Saúde</th>
                      <th className="p-4 text-xs font-extrabold uppercase text-[#6e5e55]">Rótulo Textual</th>
                      <th className="p-4 text-xs font-extrabold uppercase text-[#6e5e55]">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredients.map(ing => (
                      <tr key={ing.id} className="border-b border-[#f0eae1] hover:bg-[#faf8f5]/40 text-sm">
                        <td className="p-4 font-bold">
                          {ing.name}
                          {ing.brand && <span className="block text-xs font-medium text-[#6e5e55]">{ing.brand}</span>}
                        </td>
                        <td className="p-4 font-semibold text-[#608066]">R$ {Number(ing.purchasePrice).toFixed(2)}</td>
                        <td className="p-4 font-medium">{ing.purchaseQuantity} {ing.unit}</td>
                        <td className="p-4">
                          {ing.novaClassification === 'NOVA_1' && <span className="cozy-badge cozy-badge-natural text-xs">🌱 G1 - Natural</span>}
                          {ing.novaClassification === 'NOVA_2' && <span className="cozy-badge cozy-badge-natural text-xs">🧈 G2 - Simples</span>}
                          {ing.novaClassification === 'NOVA_3' && <span className="cozy-badge cozy-badge-processed text-xs">🧀 G3 - Processado</span>}
                          {ing.novaClassification === 'NOVA_4' && <span className="cozy-badge cozy-badge-ultra text-xs">🧪 G4 - Industrial</span>}
                        </td>
                        <td className="p-4 max-w-xs truncate text-xs text-[#6e5e55]" title={ing.compositionLabel}>
                          {ing.compositionLabel}
                        </td>
                        <td className="p-4">
                          <button 
                            onClick={() => {
                              if (confirm('Deseja deletar este ingrediente? Ele pode sumir das suas receitas.')) {
                                setIngredients(prev => prev.filter(i => i.id !== ing.id));
                              }
                            }}
                            className="text-[#c95252] hover:bg-red-50 p-2 rounded-xl"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================= */}
        {/*   TAB: FINANCIAL CONFIG / TAXES         */}
        {/* ======================================= */}
        {activeTab === 'config' && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#2b1d16]">Configurações da Sua Cozinha</h2>
              <p className="text-sm text-[#6e5e55]">Ajuste seus custos gerais. O preço de venda sugerido de todas as receitas se recalcula automaticamente com base nestes números!</p>
            </div>

            <div className="cozy-card space-y-6 animate-fade-in">
              
              {/* Valor Hora / Mao de Obra */}
              <div className="border-b border-[#f0eae1] pb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-extrabold text-base text-[#2b1d16] flex items-center gap-1.5">
                    Seu Valor-Hora (Salário)
                    <HelpCircle size={16} className="text-[#c87a53] cursor-pointer" onClick={() => setExplainerKey('hourlyRate')} />
                  </label>
                  <span className="text-lg font-black text-[#c87a53]">R$ {config.hourlyRate.toFixed(2)}/h</span>
                </div>
                <p className="text-xs text-[#6e5e55] mb-4">Quanto você quer ganhar por hora de produção ativa na sua cozinha? (Ex: R$ 20,00 por hora equivale a R$ 3.200,00 por mês).</p>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  className="w-full accent-[#c87a53] h-2 bg-[#ebdcd3] rounded-lg cursor-pointer"
                  value={config.hourlyRate}
                  onChange={e => setConfig(prev => ({ ...prev, hourlyRate: Number(e.target.value) }))}
                />
              </div>

              {/* Margem de Lucro */}
              <div className="border-b border-[#f0eae1] pb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-extrabold text-base text-[#2b1d16] flex items-center gap-1.5">
                    Margem de Lucro Desejada
                    <HelpCircle size={16} className="text-[#c87a53] cursor-pointer" onClick={() => setExplainerKey('profitMargin')} />
                  </label>
                  <span className="text-lg font-black text-[#608066]">{config.profitMargin}%</span>
                </div>
                <p className="text-xs text-[#6e5e55] mb-4">A margem limpa que sua empresa ganha para poder crescer após pagar todas as contas e insumos.</p>
                <input 
                  type="range" 
                  min="20" 
                  max="300" 
                  className="w-full accent-[#608066] h-2 bg-[#ebdcd3] rounded-lg cursor-pointer"
                  value={config.profitMargin}
                  onChange={e => setConfig(prev => ({ ...prev, profitMargin: Number(e.target.value) }))}
                />
              </div>

              {/* Taxa Operacional */}
              <div className="border-b border-[#f0eae1] pb-6">
                <div className="flex justify-between items-center mb-1">
                  <label className="font-extrabold text-base text-[#2b1d16] flex items-center gap-1.5">
                    Custos Invisíveis (Água, Gás, Luz)
                    <HelpCircle size={16} className="text-[#c87a53] cursor-pointer" onClick={() => setExplainerKey('operationalTax')} />
                  </label>
                  <span className="text-lg font-black text-[#d19f4b]">{config.operationalTax}%</span>
                </div>
                <p className="text-xs text-[#6e5e55] mb-4">Taxa sobre os ingredientes usada para cobrir o desgaste invisível de gás, luz do forno e sabão de pia.</p>
                <input 
                  type="range" 
                  min="0" 
                  max="50" 
                  className="w-full accent-[#d19f4b] h-2 bg-[#ebdcd3] rounded-lg cursor-pointer"
                  value={config.operationalTax}
                  onChange={e => setConfig(prev => ({ ...prev, operationalTax: Number(e.target.value) }))}
                />
              </div>

              {/* Embalagem */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-extrabold text-base text-[#2b1d16] flex items-center gap-1.5">
                    Custo por Embalagem / Sacola
                  </label>
                  <span className="text-lg font-black text-[#2b1d16]">R$ {config.packagingCost.toFixed(2)}</span>
                </div>
                <p className="text-xs text-[#6e5e55] mb-4">O custo de 1 caixa de entrega e fita de presente agregada a cada porção ou unidade.</p>
                <input 
                  type="number" 
                  step="0.10"
                  className="cozy-input"
                  value={config.packagingCost}
                  onChange={e => setConfig(prev => ({ ...prev, packagingCost: Number(e.target.value) }))}
                />
              </div>

            </div>
          </div>
        )}

        {/* ======================================= */}
        {/*   WIZARD: STEP-BY-STEP NEW RECIPE       */}
        {/* ======================================= */}
        {activeTab === 'wizard' && (
          <div className="max-w-2xl mx-auto">
            {/* Wizard Header Progress */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-[#2b1d16]">Criando Nova Delícia 🧑‍🍳</h2>
                <p className="text-sm text-[#6e5e55]">Preencha o passo a passo simplificado sem preencher formulários assustadores!</p>
              </div>
              <span className="text-xs font-bold bg-[#ebdcd3] text-[#c87a53] px-3 py-1.5 rounded-full">Passo {wizardStep} de 5</span>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-3 mb-8">
              {[1, 2, 3, 4, 5].map(step => (
                <div key={step} className={`step-dot ${wizardStep === step ? 'active' : ''}`} />
              ))}
            </div>

            {/* ==================================== */}
            {/* STEP 1: Name and General Data */}
            {/* ==================================== */}
            {wizardStep === 1 && (
              <div className="cozy-card space-y-5 animate-fade-in">
                <h3 className="text-lg font-bold text-[#2b1d16] mb-2 flex items-center gap-2">
                  <Sparkles size={20} className="text-[#c87a53]" />
                  Passo 1: Qual o nome da sua nova delícia artesanal?
                </h3>
                
                <div>
                  <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Como vamos chamar esta criação?</label>
                  <input 
                    type="text"
                    placeholder="Ex: Empada de Frango Clássica"
                    className="cozy-input text-lg font-bold"
                    value={newRecipe.name}
                    onChange={e => setNewRecipe(p => ({ ...p, name: e.target.value }))}
                  />
                  <p className="text-xs text-[#6e5e55] mt-1.5">Escolha um nome comercial atraente para os seus clientes de Fortaleza!</p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Quanto rende cada fornada?</label>
                  <div className="flex gap-2">
                    <input 
                      type="number"
                      placeholder="Ex: 12"
                      className="cozy-input font-bold"
                      value={newRecipe.yield}
                      onChange={e => setNewRecipe(p => ({ ...p, yield: Number(e.target.value) }))}
                    />
                    <select 
                      className="cozy-input"
                      value={newRecipe.yieldUnit}
                      onChange={e => setNewRecipe(p => ({ ...p, yieldUnit: e.target.value }))}
                    >
                      <option value="UNIT">Unidades / Empadas</option>
                      <option value="KG">Quilos (KG)</option>
                      <option value="L">Litros (L)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#6e5e55] uppercase mb-1">Breve Descrição (Marketing)</label>
                  <textarea 
                    placeholder="Escreva algo gostoso sobre este salgado..."
                    className="cozy-input"
                    rows={3}
                    value={newRecipe.description}
                    onChange={e => setNewRecipe(p => ({ ...p, description: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    onClick={() => {
                      if (!newRecipe.name) {
                        alert('Dê um nome carinhoso para a receita!');
                        return;
                      }
                      setWizardStep(2);
                    }}
                    className="cozy-btn"
                  >
                    Próximo Passo
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================== */}
            {/* STEP 2: Ingredients Selector */}
            {/* ==================================== */}
            {wizardStep === 2 && (
              <div className="cozy-card space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-[#2b1d16] mb-1 flex items-center gap-2">
                    <Package size={20} className="text-[#c87a53]" />
                    Passo 2: Vamos colocar os ingredientes na receita?
                  </h3>
                  <p className="text-xs text-[#6e5e55]">Marque os ingredientes que você vai utilizar e ajuste as gramas ou quantidades usadas.</p>
                </div>

                <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
                  {ingredients.map(ing => {
                    const isSelected = selectedIngs[ing.id] !== undefined;
                    return (
                      <div 
                        key={ing.id} 
                        className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${isSelected ? 'border-[#c87a53] bg-[#f5eae4]/20' : 'border-[#f0eae1]'}`}
                      >
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleIngredient(ing.id)}
                            className={`w-7 h-7 rounded-lg border flex items-center justify-center ${isSelected ? 'bg-[#c87a53] text-white border-[#c87a53]' : 'border-[#ebdcd3] bg-white'}`}
                          >
                            {isSelected && <Check size={16} />}
                          </button>
                          <div>
                            <span className="font-bold text-sm text-[#2b1d16]">{ing.name}</span>
                            <span className="block text-[10px] font-semibold text-[#6e5e55] uppercase">
                              Comprado por: R$ {ing.purchasePrice.toFixed(2)} o pacote de {ing.purchaseQuantity}{ing.unit}
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-2 max-w-[150px]">
                            <input 
                              type="number"
                              className="cozy-input py-1.5 px-3 font-bold text-right text-sm"
                              value={selectedIngs[ing.id]}
                              onChange={e => handleIngQuantityChange(ing.id, e.target.value)}
                            />
                            <span className="text-xs font-bold text-[#6e5e55]">
                              {ing.unit === 'KG' || ing.unit === 'G' ? 'g' : (ing.unit === 'L' || ing.unit === 'ML' ? 'ml' : 'un')}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between pt-4 border-t border-[#f0eae1]">
                  <button onClick={() => setWizardStep(1)} className="cozy-btn-secondary">Voltar</button>
                  <button 
                    onClick={() => {
                      if (Object.keys(selectedIngs).length === 0) {
                        alert('Adicione pelo menos 1 ingrediente para cozinhar!');
                        return;
                      }
                      setWizardStep(3);
                    }} 
                    className="cozy-btn"
                  >
                    Próximo Passo
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================== */}
            {/* STEP 3: Labor (Mão de Obra) */}
            {/* ==================================== */}
            {wizardStep === 3 && (
              <div className="cozy-card space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-[#2b1d16] mb-1 flex items-center gap-2">
                    <Clock size={20} className="text-[#c87a53]" />
                    Passo 3: Quanto tempo você passa na cozinha para preparar?
                  </h3>
                  <p className="text-xs text-[#6e5e55]">Você deve receber pelo seu tempo de trabalho físico! Estipulamos o seu salário dividindo por hora.</p>
                </div>

                <div className="bg-[#faf8f5] border border-[#f0eae1] p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-sm text-[#2b1d16]">Tempo de Trabalho Manual</span>
                    <span className="text-lg font-black text-[#c87a53]">{newRecipe.prepTime} minutos</span>
                  </div>
                  <p className="text-xs text-[#6e5e55] mb-4">Inclui pesar ingredientes, amassar, rechear, modelar e assar de forma ativa.</p>
                  
                  {/* Preset quick buttons */}
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {[15, 30, 45, 60, 120].map(time => (
                      <button 
                        key={time}
                        onClick={() => setNewRecipe(p => ({ ...p, prepTime: time }))}
                        className={`py-2 px-1 text-center text-xs font-bold rounded-xl border ${newRecipe.prepTime === time ? 'bg-[#c87a53] text-white border-[#c87a53]' : 'bg-white border-[#ebdcd3] text-[#6e5e55]'}`}
                      >
                        {time >= 60 ? `${time/60}h` : `${time}min`}
                      </button>
                    ))}
                  </div>

                  <input 
                    type="range" 
                    min="5" 
                    max="180" 
                    step="5"
                    className="w-full accent-[#c87a53] h-2 bg-[#ebdcd3] rounded-lg cursor-pointer"
                    value={newRecipe.prepTime}
                    onChange={e => setNewRecipe(p => ({ ...p, prepTime: Number(e.target.value) }))}
                  />
                </div>

                <div className="bg-[#ebf2ec] p-4 rounded-2xl text-sm font-medium border border-[#d6e3d8] flex gap-3 text-[#608066]">
                  <Info size={24} className="shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Como isso vira dinheiro?</span>
                    Com seu Valor-Hora configurado em <strong className="underline">R$ {config.hourlyRate.toFixed(2)}/h</strong>, esta fornada adicionará automaticamente <strong className="text-base font-black">R$ {((newRecipe.prepTime / 60) * config.hourlyRate).toFixed(2)}</strong> de remuneração direta para pagar pelo seu tempo!
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#f0eae1]">
                  <button onClick={() => setWizardStep(2)} className="cozy-btn-secondary">Voltar</button>
                  <button onClick={() => setWizardStep(4)} className="cozy-btn">
                    Próximo Passo
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================== */}
            {/* STEP 4: Overhead & Margins */}
            {/* ==================================== */}
            {wizardStep === 4 && (
              <div className="cozy-card space-y-6 animate-fade-in">
                <div>
                  <h3 className="text-lg font-bold text-[#2b1d16] mb-1 flex items-center gap-2">
                    <TrendingUp size={20} className="text-[#608066]" />
                    Passo 4: Qual a margem de lucro para a empresa crescer?
                  </h3>
                  <p className="text-xs text-[#6e5e55]">O lucro é o dinheiro que sobra para reinvestir no seu negócio após pagar as despesas de luz, gás, insumos e o seu salário!</p>
                </div>

                <div className="bg-[#faf8f5] border border-[#f0eae1] p-4 rounded-2xl">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-extrabold text-sm text-[#2b1d16]">Margem de Lucro da Receita</span>
                    <span className="text-xl font-black text-[#608066]">{config.profitMargin}%</span>
                  </div>
                  <p className="text-xs text-[#6e5e55] mb-4">A margem adicionada ao preço final de fábrica para financiar o crescimento da sua empresa artesanal.</p>
                  
                  <input 
                    type="range" 
                    min="30" 
                    max="200" 
                    className="w-full accent-[#608066] h-2 bg-[#ebdcd3] rounded-lg cursor-pointer"
                    value={config.profitMargin}
                    onChange={e => setConfig(prev => ({ ...prev, profitMargin: Number(e.target.value) }))}
                  />
                </div>

                {/* Friendly tips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#faf5eb] border border-[#f5e6cc] p-4 rounded-2xl text-xs leading-relaxed text-[#c87a53]">
                    <span className="font-extrabold block text-sm mb-1">💡 Despesas de Cozinha inclusas:</span>
                    O sistema adiciona uma pequena taxa de <strong>{config.operationalTax}%</strong> para garantir que as contas de água, gás e energia consumidas para assar a receita sejam cobertas!
                  </div>
                  <div className="bg-[#ebf2ec] border border-[#d6e3d8] p-4 rounded-2xl text-xs leading-relaxed text-[#608066]">
                    <span className="font-extrabold block text-sm mb-1">🎁 Caixinha incluída:</span>
                    Já computamos também <strong>R$ {config.packagingCost.toFixed(2)}</strong> por unidade de rendimento para pagar pela caixinha ou sacola de entrega!
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-[#f0eae1]">
                  <button onClick={() => setWizardStep(3)} className="cozy-btn-secondary">Voltar</button>
                  <button onClick={() => setWizardStep(5)} className="cozy-btn">
                    Ver Preço Sugerido!
                    <Sparkles size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* ==================================== */}
            {/* STEP 5: Results & Save */}
            {/* ==================================== */}
            {wizardStep === 5 && (() => {
              // Create temporary recipe object to calculate cost
              const mappedIngredients = Object.keys(selectedIngs).map(idKey => {
                const ing = ingredients.find(i => i.id === Number(idKey));
                const parsedQty = Number(selectedIngs[idKey]);
                const quantity = (ing.unit === 'G' || ing.unit === 'ML') ? parsedQty : (ing.unit === 'KG' || ing.unit === 'L' ? parsedQty / 1000 : parsedQty);
                return {
                  ingredientId: Number(idKey),
                  quantity
                };
              });

              const tempRecipe = {
                ...newRecipe,
                ingredients: mappedIngredients
              };

              const costs = calculateCosts(tempRecipe);

              return (
                <div className="cozy-card space-y-6 animate-fade-in">
                  <div className="text-center pb-4 border-b border-[#f0eae1]">
                    <h3 className="text-[#6e5e55] font-bold text-sm uppercase tracking-widest mb-1">Resultado Mágico da Precificação</h3>
                    <h2 className="text-2xl font-black text-[#2b1d16]">{newRecipe.name || 'Nova Empada'}</h2>
                    
                    {/* Selo Nutricional Acolhedor */}
                    <div className="mt-2 flex justify-center">
                      {costs.classification === 'Natural' && (
                        <span className="cozy-badge cozy-badge-natural text-sm">
                          🌱 Receita Super Natural! (Livre de aditivos industriais)
                        </span>
                      )}
                      {costs.classification === 'Processada' && (
                        <span className="cozy-badge cozy-badge-processed text-sm">
                          🧈 Receita de Processamento Caseiro Simples
                        </span>
                      )}
                      {costs.classification === 'Contém ultraprocessados' && (
                        <span className="cozy-badge cozy-badge-ultra text-sm">
                          ⚠️ Contém ingredientes industrializados químicos
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Gigante Suggested Sell Price */}
                  <div className="bg-[#608066]/5 rounded-3xl p-6 text-center border-2 border-dashed border-[#608066]/20">
                    <span className="text-xs font-bold text-[#608066] uppercase tracking-wider block mb-1">Preço Sugerido de Venda</span>
                    <span className="text-4xl font-black text-[#608066] block">R$ {costs.unitSuggestedPrice.toFixed(2)}</span>
                    <span className="text-xs text-[#6e5e55] font-semibold block mt-1">por unidade (Fornada de {newRecipe.yield} unidades)</span>
                  </div>

                  {/* Financial Breakdown Invoice */}
                  <div className="space-y-3 bg-[#faf8f5] p-5 rounded-2xl border border-[#f0eae1] font-mono text-sm">
                    <div className="flex justify-between border-b border-dashed border-[#ebdcd3] pb-2">
                      <span className="font-bold text-[#6e5e55]">1. Custo dos Ingredientes:</span>
                      <span className="font-extrabold">R$ {costs.totalBaseCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#ebdcd3] pb-2">
                      <span className="font-bold text-[#6e5e55]">2. Seu Salário (Tempo):</span>
                      <span className="font-extrabold">R$ {costs.laborCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#ebdcd3] pb-2">
                      <span className="font-bold text-[#6e5e55]">3. Gás, Água e Luz (Operacional):</span>
                      <span className="font-extrabold">R$ {costs.operationalCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between border-b border-dashed border-[#ebdcd3] pb-2">
                      <span className="font-bold text-[#6e5e55]">4. Caixas e Embalagem (Total):</span>
                      <span className="font-extrabold">R$ {costs.packagingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold border-b border-[#ebdcd3] pb-2 text-base text-[#2b1d16]">
                      <span>Custo Total de Produção:</span>
                      <span>R$ {costs.totalProductionCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#608066] font-bold text-base">
                      <span>5. Lucro Líquido (+{config.profitMargin}%):</span>
                      <span>R$ {costs.profitAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Friendly text justification */}
                  <div className="text-xs leading-relaxed text-[#6e5e55] bg-[#faf5eb] border border-[#f5e6cc] p-4 rounded-2xl">
                    🍰 <strong>O que esse preço significa?</strong> Significa que vendendo cada empada por <strong>R$ {costs.unitSuggestedPrice.toFixed(2)}</strong>, você cobre o preço de todas as compras, paga o seu valor-hora trabalhado de <strong>R$ {((newRecipe.prepTime / 60) * config.hourlyRate).toFixed(2)}</strong> e ainda sobram <strong>R$ {costs.profitAmount.toFixed(2)}</strong> no caixa da sua doceria para investimentos futuros!
                  </div>

                  {/* Actions */}
                  <div className="flex justify-between pt-4 border-t border-[#f0eae1]">
                    <button onClick={() => setWizardStep(4)} className="cozy-btn-secondary">Voltar</button>
                    <button onClick={handleSaveRecipe} className="cozy-btn">
                      <Check size={18} />
                      Salvar Delícia no Cardápio!
                    </button>
                  </div>
                </div>
              );
            })()}

          </div>
        )}

      </main>

      {/* 🥧 FOOTER BRAND */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f0eae1] py-4 text-center text-xs text-[#6e5e55] font-medium shadow-lg z-30">
        Empada Cearense SaaS 🥧 Desenvolvido com amor e exatidão para impulsionar negócios locais de Fortaleza.
      </footer>

    </div>
  );
}
