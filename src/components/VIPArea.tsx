"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  Clock, 
  ChefHat, 
  CheckCircle2, 
  ArrowRight,
  Plus,
  Minus,
  Search,
  Sparkles,
  Menu,
  Trophy,
  LayoutDashboard,
  BookOpen,
  Gift,
  Calculator,
  Package,
  ArrowUpRight,
  Activity,
  Zap,
  ShoppingCart,
  Trash2,
  Store,
  Target,
  MessageCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import recipesData from "@/data/receitas.json";
import dynamic from "next/dynamic";

// --- Lazy loaded Modals ---
const UpsellModal = dynamic(() => import("./Modals").then(m => m.UpsellModal), { ssr: false });
const SuccessModal = dynamic(() => import("./Modals").then(m => m.SuccessModal), { ssr: false });
const SidebarDrawer = dynamic(() => import("./Modals").then(m => m.SidebarDrawer), { ssr: false });
const ScriptsWhatsApp = dynamic(() => import("./bonuses/ScriptsWhatsApp"));
const GuiaEmbalagens = dynamic(() => import("./bonuses/GuiaEmbalagens"));
const ControleEstoque = dynamic(() => import("./bonuses/ControleEstoque"));

interface Recipe {
  id: number;
  titulo: string;
  categoria: string;
  imagem: string;
  tempo: string;
  dificuldade: string;
  custo: string;
  ingredientes: string[];
  preparo: string[];
  rendimento?: string;
  segredo?: string;
  harmonizacao?: string;
  diferencial?: string;
}

export default function VIPArea() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'recipes' | 'bonuses' | 'shopping'>('dashboard');
  const [activeBonus, setActiveBonus] = useState<string | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("🍫 Brigadeiros de Elite");
  const [yieldMultiplier, setYieldMultiplier] = useState(1);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);

  const categories = useMemo(() => ["Todas", ...new Set((recipesData as Recipe[]).map(r => r.categoria))], []);
  
  useEffect(() => {
    const saved = localStorage.getItem("doces-progress");
    if (saved) {
      try { setCompletedItems(JSON.parse(saved)); } catch (e) { console.error("Error loading progress", e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("doces-progress", JSON.stringify(completedItems));
  }, [completedItems]);

  const toggleItem = (recipeId: number, type: "ing" | "step", index: number) => {
    const key = `${recipeId}-${type}-${index}`;
    const newCompleted = { ...completedItems, [key]: !completedItems[key] };
    setCompletedItems(newCompleted);
    
    if (newCompleted[key]) {
      const recipe = (recipesData as Recipe[]).find(r => r.id === recipeId);
      if (recipe) {
        const total = recipe.ingredientes.length + recipe.preparo.length;
        const done = Object.keys(newCompleted).filter(k => k.startsWith(`${recipeId}-`) && newCompleted[k]).length;
        if (done === total) triggerSuccess();
      }
    }
  };

  const triggerSuccess = async () => {
    const confetti = (await import("canvas-confetti")).default;
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    setTimeout(() => setShowSuccessModal(true), 800);
  };

  const filteredRecipes = useMemo(() => {
    return (recipesData as Recipe[]).filter(recipe => {
      const matchesSearch = recipe.titulo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Todas" || recipe.categoria === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const completedCount = Array.from(new Set(Object.keys(completedItems).map(k => k.split('-')[0]))).length;
  const globalProgress = Math.round((completedCount / recipesData.length) * 100);

  return (
    <main className="min-h-screen bg-[#FDF9F6] selection:bg-secondary/30 antialiased overflow-x-hidden">
      <AnimatePresence>
        {isMenuOpen && (
          <SidebarDrawer 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)}
            categories={categories}
            activeCategory={activeCategory}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onSelectCategory={(cat: string) => { setActiveCategory(cat); setActiveTab('recipes'); setIsMenuOpen(false); }}
            globalProgress={globalProgress}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {selectedRecipe ? (
          <RecipeDetailView 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
            completedItems={completedItems}
            toggleItem={toggleItem}
            yieldMultiplier={yieldMultiplier}
            setYieldMultiplier={setYieldMultiplier}
          />
        ) : activeTab === 'dashboard' ? (
            <DashboardView 
              globalProgress={globalProgress} 
              completedCount={completedCount}
              totalCount={recipesData.length}
              onNavigate={(tab: any) => setActiveTab(tab)}
            />
        ) : activeTab === 'recipes' ? (
          <RecipesListView 
            recipes={filteredRecipes} 
            categories={categories}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenMenu={() => setIsMenuOpen(true)}
            onSelect={(r: Recipe) => { setYieldMultiplier(1); setSelectedRecipe(r); }} 
            isDone={(id: number) => {
              const recipe = (recipesData as any[]).find(r => r.id === id);
              if (!recipe) return false;
              const total = recipe.ingredientes.length + recipe.preparo.length;
              return Object.keys(completedItems).filter(k => k.startsWith(`${id}-`) && completedItems[k]).length >= total;
            }}
          />
        ) : activeTab === 'bonuses' && activeBonus === 'scripts' ? (
            <ScriptsWhatsApp onBack={() => setActiveBonus(null)} />
        ) : activeTab === 'bonuses' && activeBonus === 'embalagens' ? (
            <GuiaEmbalagens onBack={() => setActiveBonus(null)} />
        ) : activeTab === 'bonuses' && activeBonus === 'estoque' ? (
            <ControleEstoque onBack={() => setActiveBonus(null)} />
        ) : activeTab === 'shopping' ? (
            <ShoppingView onBack={() => setActiveTab('dashboard')} />
        ) : (
            <BonusesView 
              onBack={() => setActiveTab('dashboard')} 
              onSelect={(bonusId: string) => setActiveBonus(bonusId)} 
            />
        )}
      </AnimatePresence>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-primary/95 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center gap-1 shadow-2xl">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
            { id: 'recipes', icon: BookOpen, label: 'Doce' },
            { id: 'shopping', icon: Package, label: 'Produção' },
            { id: 'bonuses', icon: Gift, label: 'Bônus' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { 
                setActiveTab(tab.id as any); 
                setSelectedRecipe(null); 
                setActiveBonus(null); 
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full transition-all ${activeTab === tab.id ? "bg-secondary text-white shadow-lg" : "text-white/40 hover:text-white"}`}
            >
              <tab.icon size={18} />
              {activeTab === tab.id && <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>}
            </button>
          ))}
        </div>
      </div>

      <UpsellModal isOpen={showUpsellModal} onClose={() => setShowUpsellModal(false)} />
      <SuccessModal isOpen={showSuccessModal} onClose={() => { setShowSuccessModal(false); setSelectedRecipe(null); }} />
    </main>
  );
}

function DashboardView({ globalProgress, completedCount, totalCount, onNavigate }: any) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-6 max-w-lg mx-auto pb-32 pt-12">
          <header className="mb-10">
            <div className="flex items-center justify-between mb-8">
               <div className="flex flex-col"><span className="text-secondary font-black text-[10px] uppercase tracking-[0.4em] mb-1">Boas-vindas, Mestre</span><h1 className="text-4xl font-black text-primary tracking-tight">Sugar VIP</h1></div>
               <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-secondary shadow-xl border border-primary/5"><ChefHat size={24} /></div>
            </div>
            <div className="bg-primary p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6"><span className="text-[10px] font-black uppercase tracking-widest text-white/40">Domínio Gourmet</span><span className="text-3xl font-black">{globalProgress}%</span></div>
                <div className="h-2 w-full bg-white/10 rounded-full mb-6 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${globalProgress}%` }} className="h-full bg-secondary" /></div>
                <p className="text-sm font-medium text-white/60">Você já domina <span className="text-white font-black">{completedCount}</span> de <span className="text-white font-black">{totalCount}</span> segredos de elite.</p>
              </div>
            </div>
          </header>
          <div className="grid grid-cols-1 gap-4">
             <button onClick={() => onNavigate('recipes')} className="group bg-white p-6 rounded-[2.5rem] border-2 border-primary/5 shadow-xl text-left flex items-center justify-between hover:border-secondary/20 transition-all">
                <div className="flex items-center gap-5">
                   <div className="h-14 w-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary"><BookOpen size={28} /></div>
                   <div>
                      <h3 className="font-black text-primary text-sm uppercase tracking-widest">Receitas Gourmet</h3>
                      <p className="text-[10px] text-primary/70 font-bold uppercase italic">Criações de Elite</p>
                   </div>
                </div>
                <ArrowRight size={20} className="text-primary/10 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
             </button>

             <button onClick={() => onNavigate('shopping')} className="group bg-white p-6 rounded-[2.5rem] border-2 border-primary/5 shadow-xl text-left flex items-center justify-between hover:border-accent/20 transition-all">
                <div className="flex items-center gap-5">
                   <div className="h-14 w-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent"><Package size={28} /></div>
                   <div>
                      <h3 className="font-black text-primary text-sm uppercase tracking-widest">Sistema de Lucro</h3>
                      <p className="text-[10px] text-primary/70 font-bold uppercase italic">Produção & Escala</p>
                   </div>
                </div>
                <ArrowRight size={20} className="text-primary/10 group-hover:text-accent group-hover:translate-x-1 transition-all" />
             </button>

             <button onClick={() => onNavigate('bonuses')} className="group bg-white p-6 rounded-[2.5rem] border-2 border-primary/5 shadow-xl text-left flex items-center justify-between hover:border-secondary/20 transition-all">
                <div className="flex items-center gap-5">
                   <div className="h-14 w-14 bg-secondary/10 rounded-2xl flex items-center justify-center text-secondary"><Gift size={28} /></div>
                   <div>
                      <h3 className="font-black text-primary text-sm uppercase tracking-widest">Bônus Exclusivos</h3>
                      <p className="text-[10px] text-primary/70 font-bold uppercase italic">Mentoria Expert</p>
                   </div>
                </div>
                <ArrowRight size={20} className="text-primary/10 group-hover:text-secondary group-hover:translate-x-1 transition-all" />
             </button>
          </div>
        </motion.div>
    );
}

function RecipesListView({ recipes, categories, activeCategory, setActiveCategory, searchQuery, setSearchQuery, onOpenMenu, onSelect, isDone }: any) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-6 max-w-lg mx-auto pb-32">
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#FDF9F6]/95 backdrop-blur-lg border-b border-primary/5 px-6 py-4 flex items-center justify-between">
         <button onClick={onOpenMenu} className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg border border-primary/5"><Menu size={20} /></button>
         <span className="font-black text-[10px] uppercase tracking-[0.4em] text-primary">Doce Expert</span>
         <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-[10px] font-black text-primary">{recipes.length}</div>
      </div>
      <header className="mt-20 mb-8">
        <h1 className="text-4xl font-black text-primary mb-4 tracking-tight">{activeCategory}</h1>
        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={16} /><input type="text" placeholder="Filtrar por nome..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 bg-white rounded-2xl pl-12 pr-4 outline-none border border-primary/5 font-black text-xs uppercase" /></div>
      </header>
      <div className="grid gap-6">
        {recipes.map((r: any) => (
          <div key={r.id} onClick={() => onSelect(r)} className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-primary/5 cursor-pointer active:scale-95 transition-all relative">
            <div className="relative h-48 w-full">
              <Image src={r.imagem} alt={r.titulo} fill className="object-cover" />
              {isDone(r.id) && <div className="absolute top-4 right-4 bg-success text-white p-2 rounded-xl shadow-lg animate-fade-in"><CheckCircle2 size={16} /></div>}
            </div>
            <div className="p-6"><h3 className="font-black text-xl text-primary leading-tight">{r.titulo}</h3></div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecipeDetailView({ recipe, onBack, completedItems, toggleItem, yieldMultiplier, setYieldMultiplier }: any) {
    const [detailTab, setDetailTab] = useState<'cozinha' | 'lucro' | 'dicas'>('cozinha');
    const [calcData, setCalcData] = useState<Record<number, { price: string; totalQty: string; usedQty: string }>>({});
    const [extraCosts, setExtraCosts] = useState({ gas: '1.5', labor: '8', energy: '0.8', packaging: '2.5', sellMultiplier: '3' });
    const [monthlyGoal, setMonthlyGoal] = useState('3000');

    const saveGlobalPrice = (ingName: string, price: string, totalQty: string) => {
        const saved = localStorage.getItem('doces-global-prices');
        const prices = saved ? JSON.parse(saved) : {};
        const cleanName = ingName.split('(')[0].trim().toLowerCase();
        prices[cleanName] = { price, totalQty };
        localStorage.setItem('doces-global-prices', JSON.stringify(prices));
    };

    useEffect(() => {
        const saved = localStorage.getItem('doces-global-prices');
        const globalPrices = saved ? JSON.parse(saved) : {};
        const initial: any = {};

        recipe.ingredientes.forEach((ing: string, i: number) => {
            const cleanName = ing.split('(')[0].trim().toLowerCase();
            const match = ing.match(/(\d+)(g|ml)/i);
            initial[i] = { 
                price: globalPrices[cleanName]?.price || '', 
                totalQty: globalPrices[cleanName]?.totalQty || (match ? match[1] : '1000'), 
                usedQty: match ? match[1] : '100' 
            };
        });
        setCalcData(initial);
    }, [recipe]);

    const handlePriceUpdate = (index: number, field: 'price' | 'totalQty', value: string) => {
        const newData = { ...calcData, [index]: { ...calcData[index], [field]: value } };
        setCalcData(newData);
        saveGlobalPrice(recipe.ingredientes[index], newData[index].price, newData[index].totalQty);
    };

    const totalIngCost = Object.values(calcData).reduce((acc, item) => {
        const p = parseFloat(item.price.replace(',', '.'));
        const t = parseFloat(item.totalQty.replace(',', '.'));
        const u = parseFloat(item.usedQty.replace(',', '.'));
        if (isNaN(p) || isNaN(t) || isNaN(u) || t === 0) return acc;
        return acc + (p / t) * u;
    }, 0);

    const extrasSum = (parseFloat(extraCosts.gas) || 0) + (parseFloat(extraCosts.labor) || 0) + (parseFloat(extraCosts.energy) || 0) + (parseFloat(extraCosts.packaging) || 0);
    const costPerRecipe = (totalIngCost + extrasSum) * yieldMultiplier;
    const sellPrice = costPerRecipe * parseFloat(extraCosts.sellMultiplier);
    const profitPerRecipe = sellPrice - costPerRecipe;
    const unitsToGoal = profitPerRecipe > 0 ? Math.ceil(parseFloat(monthlyGoal) / profitPerRecipe) : 0;

    return (
      <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="pb-48 bg-[#FDF9F6] min-h-screen">
        <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-primary/5 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2.5 bg-primary/10 rounded-xl text-primary active:scale-90 transition-transform"><ChevronLeft size={20} /></button>
            <h2 className="font-black text-[13px] text-primary truncate max-w-[150px] leading-tight tracking-tight">{recipe.titulo}</h2>
          </div>
          <div className="flex bg-primary/5 p-1.5 rounded-2xl border border-primary/10">
              {[
                { id: 'cozinha', icon: ChefHat },
                { id: 'lucro', icon: Calculator },
                { id: 'dicas', icon: Sparkles }
              ].map((t: any) => (
                  <button key={t.id} onClick={() => setDetailTab(t.id as any)} className={`flex items-center justify-center p-3 rounded-xl transition-all ${detailTab === t.id ? "bg-primary text-white shadow-xl scale-110" : "text-primary/60 hover:text-primary"}`}>
                      <t.icon size={20}/>
                  </button>
              ))}
          </div>
        </header>

        <div className="relative h-[30vh] w-full">
            <Image src={recipe.imagem} alt={recipe.titulo} fill className="object-cover" priority />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FDF9F6] via-transparent to-transparent" />
        </div>

        <div className="px-5 -mt-8 relative z-10 max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {detailTab === 'cozinha' && (
              <motion.div key="cozinha" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
                <section className="bg-primary text-white p-6 rounded-[2.5rem] shadow-2xl relative overflow-hidden border-b-4 border-secondary/50">
                    <div className="relative z-10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center text-highlight shadow-inner"><Calculator size={18} /></div>
                            <div>
                                <h3 className="text-sm font-black tracking-tight leading-none mb-1">Escala</h3>
                                <p className="text-[9px] font-bold text-white/70 uppercase tracking-widest">Rendibilidade</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-2xl border border-white/5">
                            <button onClick={() => setYieldMultiplier(Math.max(1, yieldMultiplier - 1))} className="h-8 w-8 bg-white/10 rounded-lg flex items-center justify-center active:scale-90 transition-all"><Minus size={14} /></button>
                            <div className="px-3 text-center min-w-[50px]"><span className="text-xl font-black text-highlight leading-none">{yieldMultiplier}x</span></div>
                            <button onClick={() => setYieldMultiplier(yieldMultiplier + 1)} className="h-8 w-8 bg-secondary rounded-lg flex items-center justify-center text-white active:scale-90 transition-all font-black"><Plus size={14} /></button>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-primary/5">
                    <h3 className="text-2xl font-black text-primary mb-6 tracking-tight">Arquitetura de Insumos</h3>
                    <div className="space-y-3">
                    {recipe.ingredientes.map((ing: string, i: number) => (
                        <div key={i} onClick={() => toggleItem(recipe.id, "ing", i)} className={`flex items-center gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${completedItems[`${recipe.id}-ing-${i}`] ? "bg-secondary/5 opacity-40 grayscale" : "bg-white border-primary/5 shadow-sm active:scale-[0.98]"}`}>
                        <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${completedItems[`${recipe.id}-ing-${i}`] ? "bg-secondary border-secondary text-white" : "border-primary/20 bg-primary/5"}`}>{completedItems[`${recipe.id}-ing-${i}`] && <CheckCircle2 size={16} />}</div>
                        <span className="text-[14px] font-bold text-primary leading-tight">{yieldMultiplier > 1 && <span className="text-secondary mr-2">{yieldMultiplier}x</span>}{ing}</span>
                        </div>
                    ))}
                    </div>
                </section>

                <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-primary/5">
                    <h3 className="text-2xl font-black text-primary mb-8 flex items-center gap-3 tracking-tight"><ChefHat size={28} className="text-secondary" /> Ritual de Preparo</h3>
                    <div className="space-y-8">
                    {recipe.preparo.map((step: string, i: number) => (
                        <div key={i} onClick={() => toggleItem(recipe.id, "step", i)} className={`flex gap-5 p-6 rounded-[2.5rem] border transition-all cursor-pointer ${completedItems[`${recipe.id}-step-${i}`] ? "bg-secondary/5 opacity-40 grayscale" : "bg-white border-primary/5 shadow-sm active:scale-[0.98]"}`}>
                        <div className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center font-black text-lg ${completedItems[`${recipe.id}-step-${i}`] ? "bg-secondary text-white" : "bg-primary/5 text-primary"}`}>{i + 1}</div>
                        <p className="text-[15px] font-bold leading-relaxed text-primary/90">{step}</p>
                        </div>
                    ))}
                    </div>
                </section>
              </motion.div>
            )}

            {detailTab === 'lucro' && (
              <motion.div key="lucro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="bg-primary text-white p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black mb-1 flex items-center gap-2"><Calculator size={24} /> ROI de Elite</h3>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Cálculo técnico de lucratividade</p>
                    </div>
                    <div className="absolute top-[-40%] right-[-10%] w-48 h-48 bg-secondary/10 blur-[50px] rounded-full" />
                </div>

                <section className="bg-white p-8 rounded-[3rem] shadow-2xl border border-primary/10">
                    <h4 className="text-[11px] font-black text-primary/40 uppercase tracking-widest mb-6 pl-2">Insumos (Custos Atuais)</h4>
                    <div className="space-y-4">
                        {recipe.ingredientes.map((ing: string, i: number) => (
                            <div key={i} className="bg-primary/[0.02] p-6 rounded-[2.5rem] border border-primary/5 space-y-4">
                                <span className="text-[13px] font-black text-primary block leading-tight">{ing}</span>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white p-3 rounded-xl border border-primary/10">
                                        <span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Preço (R$)</span>
                                        <input type="text" value={calcData[i]?.price || ''} onChange={(e) => handlePriceUpdate(i, 'price', e.target.value)} className="w-full bg-transparent outline-none font-black text-xs" placeholder="0,00" />
                                    </div>
                                    <div className="bg-white p-3 rounded-xl border border-primary/10">
                                        <span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Peso (g/ml)</span>
                                        <input type="text" value={calcData[i]?.totalQty || ''} onChange={(e) => handlePriceUpdate(i, 'totalQty', e.target.value)} className="w-full bg-transparent outline-none font-black text-xs" placeholder="1000" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-primary text-white p-10 rounded-[4rem] shadow-2xl space-y-8 relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="flex justify-between items-center bg-white/10 p-6 rounded-[2rem] border-2 border-white/5 mb-6">
                            <div><span className="text-[10px] font-black uppercase text-white/50">Custo Total x{yieldMultiplier}</span><p className="text-3xl font-black text-highlight">R$ {costPerRecipe.toFixed(2).replace('.', ',')}</p></div>
                            <div className="text-right">
                                <span className="text-[11px] font-black uppercase text-secondary">Margem</span>
                                <select value={extraCosts.sellMultiplier} onChange={(e) => setExtraCosts({...extraCosts, sellMultiplier: e.target.value})} className="bg-secondary text-white font-black px-3 py-1 rounded-lg outline-none ml-2 block">
                                    <option value="2">2x</option>
                                    <option value="3">3x</option>
                                    <option value="4">4x</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-xl font-black text-white flex items-center gap-2">🎯 Meta Lucro Real</h4>
                            <div className="flex items-center gap-4 bg-white/5 p-6 rounded-[2.5rem] border border-white/10">
                                <div className="flex-1 text-center border-r border-white/10">
                                    <span className="text-[10px] font-black uppercase text-white/50 block mb-2">Meta (R$)</span>
                                    <input type="text" value={monthlyGoal} onChange={(e) => setMonthlyGoal(e.target.value)} className="bg-transparent border-b-2 border-secondary/50 text-2xl font-black outline-none w-24 text-center text-white" />
                                </div>
                                <div className="flex-1 text-center">
                                    <span className="text-[10px] font-black uppercase text-white/50 block mb-2">Meta de Vendas</span>
                                    <p className="text-3xl font-black text-secondary">{unitsToGoal} un</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
              </motion.div>
            )}

            {detailTab === 'dicas' && (
              <motion.div key="dicas" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                <div className="bg-secondary p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2 tracking-tighter"><Sparkles size={24} /> O Toque de Mestre</h3>
                        <p className="text-[10px] font-bold text-white/50 uppercase tracking-[0.2em]">Diferenciais que encantam</p>
                    </div>
                </div>

                <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-primary/10 space-y-10 relative overflow-hidden text-primary">
                    <div className="space-y-4">
                        <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-secondary"><Zap size={18}/> O "Pulo do Gato"</h4>
                        <p className="text-[15px] leading-relaxed font-bold italic border-l-4 border-secondary pl-6 py-2 bg-secondary/5 rounded-r-2xl">
                          "{recipe.segredo || 'O segredo desta receita está na qualidade dos insumos e no tempo de descanso.'}"
                        </p>
                    </div>
                    <div className="space-y-6 pt-10 border-t border-primary/5">
                        <h4 className="flex items-center gap-2 font-black text-sm uppercase tracking-widest text-secondary"><Activity size={18}/> Harmonização Gourmet</h4>
                        <p className="text-[14px] leading-relaxed text-primary/80 font-medium">
                            {recipe.harmonizacao || "Sirva com um acompanhamento premium para elevar a experiência."}
                        </p>
                    </div>
                    <div className="p-8 bg-primary text-white rounded-[3rem] shadow-xl space-y-4">
                        <h4 className="flex items-center gap-3 text-secondary font-black text-sm uppercase tracking-widest leading-none"><Star size={18} /> Engenharia de Doce</h4>
                        <p className="text-[13px] text-white/80 leading-relaxed font-medium">
                            {recipe.diferencial || "Receita otimizada para manter a textura e brilho por mais tempo."}
                        </p>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
}

function BonusesView({ onBack, onSelect }: any) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 max-w-lg mx-auto pb-32 pt-12">
      <header className="mb-10 flex items-center gap-4"><button onClick={onBack} className="p-2 bg-primary/10 rounded-xl"><ChevronLeft /></button><h1 className="text-4xl font-black text-primary tracking-tight">Mentoria Expert</h1></header>
      
      <div onClick={() => onSelect('embalagens')} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-2xl mb-6 cursor-pointer active:scale-95 transition-all relative overflow-hidden group">
        <Package size={32} className="text-secondary mb-6" />
        <h3 className="text-xl font-black mb-2 flex items-center justify-between">Guia de Joias <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform"/></h3>
        <p className="text-sm text-primary/60 font-medium">Como transformar doces em presentes inesquecíveis.</p>
      </div>

      <div onClick={() => onSelect('scripts')} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-2xl mb-6 cursor-pointer active:scale-95 transition-all relative overflow-hidden group">
        <MessageCircle size={32} className="text-accent mb-6" />
        <h3 className="text-xl font-black mb-2 flex items-center justify-between">Venda por Textura <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform"/></h3>
        <p className="text-sm text-primary/60 font-medium">Scripts prontos para WhatsApp baseados em gatilhos mentais gourmet.</p>
      </div>

      <div onClick={() => onSelect('estoque')} className="bg-white p-8 rounded-[3rem] border border-primary/5 shadow-2xl cursor-pointer active:scale-95 transition-all relative overflow-hidden group">
        <Target size={32} className="text-secondary mb-6" />
        <h3 className="text-xl font-black mb-2 flex items-center justify-between">Gestão Diamante <ArrowRight size={20} className="text-primary group-hover:translate-x-2 transition-transform"/></h3>
        <p className="text-sm text-primary/60 font-medium">Controle de estoque e redução de perdas de insumos caros.</p>
      </div>
    </motion.div>
  );
}

function ShoppingView({ onBack }: any) {
    const [prices, setPrices] = useState<Record<string, { price: string; totalQty: string }>>({});
    const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [productionPlan, setProductionPlan] = useState<Record<number, number>>({});
    const [mode, setMode] = useState<'plan' | 'shop'>('plan');

    const allIngredients = useMemo(() => {
        const unique = new Set<string>();
        (recipesData as any[]).forEach(r => {
            r.ingredientes.forEach((i: string) => {
                const name = i.split('(')[0].trim().toLowerCase();
                if (name) unique.add(name);
            });
        });
        return Array.from(unique).sort();
    }, []);

    const calculatedShoppingList = useMemo(() => {
        const totals: Record<string, { qty: number; unit: string }> = {};
        Object.entries(productionPlan).forEach(([id, multiplier]) => {
            if (multiplier <= 0) return;
            const recipe = (recipesData as any[]).find(r => r.id === parseInt(id));
            if (!recipe) return;
            recipe.ingredientes.forEach((ing: string) => {
                const name = ing.split('(')[0].trim().toLowerCase();
                const match = ing.match(/(\d+)(g|ml)/i);
                if (match) {
                    const val = parseInt(match[1]) * multiplier;
                    const unit = match[2];
                    if (!totals[name]) totals[name] = { qty: 0, unit };
                    totals[name].qty += val;
                }
            });
        });
        return totals;
    }, [productionPlan]);

    useEffect(() => {
        const saved = localStorage.getItem('doces-global-prices');
        if (saved) setPrices(JSON.parse(saved));
        const savedList = localStorage.getItem('doces-shopping-list');
        if (savedList) setSelectedIngredients(JSON.parse(savedList));
        const savedPlan = localStorage.getItem('doces-production-plan');
        if (savedPlan) setProductionPlan(JSON.parse(savedPlan));
    }, []);

    const updatePrice = (name: string, field: 'price' | 'totalQty', value: string) => {
        const newPrices = { ...prices, [name]: { ...prices[name], [field]: value } };
        setPrices(newPrices);
        localStorage.setItem('doces-global-prices', JSON.stringify(newPrices));
    };

    const toggleIngredient = (name: string) => {
        const newList = selectedIngredients.includes(name) ? selectedIngredients.filter(i => i !== name) : [...selectedIngredients, name];
        setSelectedIngredients(newList);
        localStorage.setItem('doces-shopping-list', JSON.stringify(newList));
    };

    const updatePlan = (id: number, qty: number) => {
        const newPlan = { ...productionPlan, [id]: Math.max(0, qty) };
        setProductionPlan(newPlan);
        localStorage.setItem('doces-production-plan', JSON.stringify(newPlan));
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-6 max-w-lg mx-auto pb-48 pt-12">
            <header className="mb-8">
                <div className="flex items-center gap-4 mb-6">
                    <button onClick={onBack} className="p-2 bg-primary/10 rounded-xl text-primary"><ChevronLeft /></button>
                    <h1 className="text-3xl font-black text-primary tracking-tight">Produção Expert</h1>
                </div>
                <div className="flex bg-white p-1.5 rounded-[2rem] border border-primary/5 shadow-xl">
                    <button onClick={() => setMode('plan')} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'plan' ? "bg-primary text-white" : "text-primary/40"}`}>1. Planejar</button>
                    <button onClick={() => setMode('shop')} className={`flex-1 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest transition-all ${mode === 'shop' ? "bg-secondary text-white" : "text-primary/40"}`}>2. Insumos</button>
                </div>
            </header>
            <AnimatePresence mode="wait">
                {mode === 'plan' ? (
                    <motion.div key="plan" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-3">
                        {(recipesData as any[]).map(recipe => (
                            <div key={recipe.id} className="bg-white p-5 rounded-[2.5rem] border border-primary/5 shadow-xl flex items-center justify-between gap-4">
                                <span className="font-black text-xs text-primary uppercase tracking-tight truncate max-w-[150px]">{recipe.titulo}</span>
                                <div className="flex items-center gap-1 bg-primary/5 p-1 rounded-2xl">
                                    <button onClick={() => updatePlan(recipe.id, (productionPlan[recipe.id] || 0) - 1)} className="h-8 w-8 bg-white rounded-xl flex items-center justify-center"><Minus size={14}/></button>
                                    <span className="w-8 text-center font-black text-xs">{productionPlan[recipe.id] || 0}</span>
                                    <button onClick={() => updatePlan(recipe.id, (productionPlan[recipe.id] || 0) + 1)} className="h-8 w-8 bg-secondary text-white rounded-xl flex items-center justify-center"><Plus size={14}/></button>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div key="shop" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="relative"><Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary/20" size={18} /><input type="text" placeholder="Adicionar ingrediente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full h-16 bg-white rounded-full pl-16 pr-6 outline-none border border-primary/10 shadow-xl text-xs font-black uppercase" /></div>
                        {selectedIngredients.map((ing) => (
                            <div key={ing} className="bg-white p-6 rounded-[2.5rem] border border-primary/5 shadow-xl">
                                <div className="flex items-start justify-between mb-4"><span className="font-black text-sm text-primary uppercase tracking-tight">{ing}</span><button onClick={() => toggleIngredient(ing)} className="text-secondary"><Trash2 size={16}/></button></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-primary/5 p-4 rounded-2xl"><span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Paguei (R$)</span><input type="text" value={prices[ing]?.price || ''} onChange={(e) => updatePrice(ing, 'price', e.target.value)} className="w-full bg-transparent outline-none font-black text-xs text-secondary"/></div>
                                    <div className="bg-primary/5 p-4 rounded-2xl"><span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Peso (g/ml)</span><input type="text" value={prices[ing]?.totalQty || ''} onChange={(e) => updatePrice(ing, 'totalQty', e.target.value)} className="w-full bg-transparent outline-none font-black text-xs text-primary"/></div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

const Star = (props: any) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-star"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
