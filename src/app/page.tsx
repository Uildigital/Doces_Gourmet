"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { 
  ChevronLeft, 
  Clock, 
  ChefHat, 
  Coins, 
  CheckCircle2, 
  ArrowRight,
  PartyPopper,
  X,
  Users,
  Plus,
  Minus,
  Search,
  Filter,
  Sparkles,
  Menu,
  Trophy,
  MessageCircle,
  Settings,
  Lock
} from "lucide-react";
import { motion, AnimatePresence, useScroll, useSpring } from "framer-motion";
import confetti from "canvas-confetti";
import recipesData from "@/data/receitas.json";

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
  descricao?: string;
  diferencial?: string;
  segredo?: string;
  harmonizacao?: string;
  rendimento?: string;
}

export default function RecipeApp() {
  const categories = useMemo(() => ["Todas", ...new Set((recipesData as Recipe[]).map(r => r.categoria))], []);
  const categoryInfo: Record<string, { title: string, subtitle: string }> = {
    "Todas": { 
      title: "Doces Gourmet de Elite", 
      subtitle: "Aprenda a criar as sobremesas mais desejadas e lucrativas do mercado." 
    },
    "🍫 Brigadeiros de Elite": { 
      title: "🍫 1. Brigadeiros Belgas (Ponto de Seda)", 
      subtitle: "Técnicas avançadas para o brigadeiro perfeito que não cristaliza." 
    },
    "🍪 Brownies Recheados": { 
      title: "🍪 2. Brownies & Cookies (Crocância & Fudge)", 
      subtitle: "Receitas focadas na casquinha perfeita e centro úmido." 
    },
    "🍰 Fatias Supremas": { 
      title: "🍰 3. Fatias de Vitrine (Arquitetura de Sabor)", 
      subtitle: "Aprenda a montar fatias que vendem só pelo olhar." 
    },
    "⚡ 15 Minutos": { 
      title: "⚡ 4. Socorro Doce (Praticidade Máxima)", 
      subtitle: "Receitas relâmpago para salvar qualquer encomenda de última hora." 
    }
  };

  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todas");

  // Yield multiplier state
  const [yieldMultiplier, setYieldMultiplier] = useState(1);

  // VIP / Freemium Logic
  const [isVip, setIsVip] = useState(false);
  const freeIds = [1]; // Showcase item
  const checkoutUrl = "https://pay.kiwify.com.br/VGZzMTK"; // Trocar pelo link do produto de doces

  // Server-side Event Helper (CAPI)
  const trackServerEvent = async (eventName: string, customData: any = {}) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          event_name: eventName, 
          url: window.location.href,
          custom_data: customData 
        })
      });
    } catch (e) { console.error("Error tracking server event", e); }
  };

  // Load from localStorage
  useEffect(() => {
    // Check for VIP access in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("vip") === "true") {
      setIsVip(true);
      if (!localStorage.getItem("webbook-purchase-tracked")) {
        // Track Purchase event ONLY once
        if (typeof window !== 'undefined' && (window as any).fbq) {
          (window as any).fbq('track', 'Purchase', { currency: 'BRL', value: 67.00 });
        }
        trackServerEvent('Purchase', { currency: 'BRL', value: 67.00 });
        localStorage.setItem("webbook-purchase-tracked", "true");
      }
      localStorage.setItem("webbook-isvip", "true");
    } else {
      const storedVip = localStorage.getItem("webbook-isvip");
      if (storedVip === "true") setIsVip(true);
    }

    // Load from localStorage
    const saved = localStorage.getItem("receitas-progress");
    if (saved) {
      try {
        setCompletedItems(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading progress", e);
      }
    }

    setIsMounted(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("receitas-progress", JSON.stringify(completedItems));
    }
  }, [completedItems, isMounted]);

  const toggleItem = (recipeId: number, type: "ing" | "step", index: number) => {
    const key = `${recipeId}-${type}-${index}`;
    const isNowChecked = !completedItems[key];
    const newCompleted = { ...completedItems, [key]: isNowChecked };
    setCompletedItems(newCompleted);

    if (typeof window !== "undefined" && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }

    const recipe = (recipesData as Recipe[]).find(r => r.id === recipeId);
    if (recipe) {
      const totalItems = recipe.ingredientes.length + recipe.preparo.length;
      const doneItems = Object.keys(newCompleted).filter(k => 
        k.startsWith(`${recipeId}-`) && newCompleted[k]
      ).length;

      if (doneItems === totalItems && isNowChecked) {
        triggerSuccess();
      }
    }
  };

  const triggerSuccess = () => {
    const scalar = 2;
    const triangle = confetti.shapeFromPath({ path: 'M0 10 L5 0 L10 10z' });
    confetti({
      shapes: [triangle],
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#E83E8C", "#C4912D", "#5D3A1A", "#FDF9F6"],
      scalar
    });
    setTimeout(() => setShowSuccessModal(true), 800);
  };

  const getRecipeProgress = (recipeId: number) => {
    const recipe = (recipesData as Recipe[]).find(r => r.id === recipeId);
    if (!recipe) return 0;
    const totalItems = recipe.ingredientes.length + recipe.preparo.length;
    const doneItems = Object.keys(completedItems).filter(k => 
      k.startsWith(`${recipeId}-`) && completedItems[k]
    ).length;
    return Math.round((doneItems / totalItems) * 100);
  };

  const isRecipeDone = (recipeId: number) => getRecipeProgress(recipeId) === 100;

  // Filter Logic
  const filteredRecipes = useMemo(() => {
    return (recipesData as Recipe[]).filter(recipe => {
      const matchesSearch = recipe.titulo.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === "Todas" || recipe.categoria === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUpsellModal, setShowUpsellModal] = useState(false);


  const totalCompleted = Object.values(completedItems).filter(v => v).length;
  // Total possible items: 40 recipes * (Average 5 ingredients + 5 steps) = 400 approx.
  // Or just total recipes completed? Let's use recipes completed.
  const completedRecipesCount = Array.from(new Set(Object.keys(completedItems).map(k => k.split('-')[0]))).length;
  const globalProgress = Math.round((completedRecipesCount / recipesData.length) * 100);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-cream selection:bg-secondary/30 antialiased overflow-x-hidden">
      <AnimatePresence>
        {isMenuOpen && (
          <SidebarDrawer 
            isOpen={isMenuOpen} 
            onClose={() => setIsMenuOpen(false)}
            categories={categories}
            activeCategory={activeCategory}
            onSelectCategory={(cat: string) => {
              setActiveCategory(cat);
              setIsMenuOpen(false);
            }}
            globalProgress={globalProgress}
            completedCount={completedRecipesCount}
            totalCount={recipesData.length}
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!selectedRecipe ? (
          <HomeView 
            recipes={filteredRecipes} 
            categories={categories}
            activeCategoryInfo={categoryInfo[activeCategory] || { title: activeCategory, subtitle: "" }}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onOpenMenu={() => setIsMenuOpen(true)}
            onSelect={(r: Recipe) => {
              setYieldMultiplier(1);
              setSelectedRecipe(r);
            }} 
            getProgress={getRecipeProgress}
            isDone={isRecipeDone}
            isVip={isVip}
            freeIds={freeIds}
            setShowUpsellModal={setShowUpsellModal}
            trackServerEvent={trackServerEvent}
          />
        ) : (
          <RecipeDetailView 
            recipe={selectedRecipe} 
            onBack={() => setSelectedRecipe(null)} 
            completedItems={completedItems}
            toggleItem={toggleItem}
            progress={getRecipeProgress(selectedRecipe.id)}
            yieldMultiplier={yieldMultiplier}
            setYieldMultiplier={setYieldMultiplier}
            isVip={isVip}
            isFree={freeIds.includes(selectedRecipe.id)}
            onUnlock={() => setShowUpsellModal(true)}
          />
        )}
      </AnimatePresence>

      <UpsellModal 
        isOpen={showUpsellModal} 
        onClose={() => setShowUpsellModal(false)}
        checkoutUrl={checkoutUrl}
      />

      <SuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => {
          setShowSuccessModal(false);
          setSelectedRecipe(null);
        }} 
      />
    </div>
  );
}

function HomeView({ 
  recipes, 
  categories, 
  activeCategoryInfo,
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery, 
  onOpenMenu,
  onSelect, 
  getProgress, 
  isDone,
  isVip,
  freeIds,
  setShowUpsellModal,
  trackServerEvent
}: any) {
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-6 max-w-lg mx-auto pb-24 font-sans"
    >
      {/* Sticky Header Bar */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-cream/80 backdrop-blur-lg border-b border-primary/5 px-6 py-4 flex items-center justify-between">
         <motion.button 
           whileTap={{ scale: 0.9 }}
           onClick={onOpenMenu}
           className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-lg shadow-primary/5 border border-primary/5 active:bg-primary active:text-white transition-all"
         >
           <Menu size={20} />
         </motion.button>
         
         <div className="flex flex-col items-center">
            <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Doces Gourmet</h2>
            <div className="h-0.5 w-8 bg-secondary rounded-full mt-0.5" />
         </div>

         <div className="h-10 w-10 flex items-center justify-center">
            {/* Placeholder for Profile or Progress Mini Icon */}
            <div className="h-8 w-8 bg-primary/5 rounded-full border border-primary/5 flex items-center justify-center text-[10px] font-black text-primary/30">
               {recipes.length}
            </div>
         </div>
      </div>

      <header className="mb-10 mt-16 min-h-[160px]">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <span className="text-secondary font-bold text-[10px] uppercase tracking-[0.4em] mb-4 block leading-tight">
            Webbook Confeitaria v1
          </span>
          
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-4xl font-black text-primary mb-2 tracking-tight">
                {activeCategoryInfo.title}
              </h1>
              <p className="text-sm text-primary/30 font-bold leading-relaxed max-w-[280px] mb-8">
                {activeCategoryInfo.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* The New "Escorrega" Menu */}
        <div className="relative mb-10">
          <motion.button 
            onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
            className="w-full h-16 bg-primary text-white rounded-[1.5rem] px-8 flex items-center justify-between shadow-2xl shadow-primary/20 z-10 relative"
          >
            <div className="flex items-center gap-3">
               <Menu size={20} className="text-secondary" />
               <span className="text-xs font-black uppercase tracking-[0.3em]">Menu de Receitas</span>
            </div>
            <motion.div animate={{ rotate: isCategoryMenuOpen ? 180 : 0 }}>
               <ChevronLeft className="-rotate-90" size={20} />
            </motion.div>
          </motion.button>

          <AnimatePresence>
            {isCategoryMenuOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0, y: -20 }}
                animate={{ height: "auto", opacity: 1, y: 0 }}
                exit={{ height: 0, opacity: 0, y: -20 }}
                className="overflow-hidden bg-white rounded-b-[2rem] -mt-8 pt-10 shadow-2xl shadow-primary/10 border border-primary/5 px-4 pb-6"
              >
                <div className="space-y-1">
                   {categories.map((cat: string) => {
                     const isActive = activeCategory === cat;
                     const count = (recipesData as Recipe[]).filter(r => r.categoria === cat).length;
                     return (
                       <button
                         key={cat}
                         onClick={() => {
                           setActiveCategory(cat);
                           setIsCategoryMenuOpen(false);
                         }}
                         className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all ${
                           isActive ? "bg-primary/5 text-primary" : "text-primary/40 hover:bg-primary/[0.02]"
                         }`}
                       >
                         <div className="flex items-center gap-4">
                            <span className="text-xl">{cat.split(' ')[0]}</span>
                            <span className="text-[11px] font-black uppercase tracking-widest leading-none">
                                {cat === "Todas" ? "Ver Tudo" : cat.split(' ').slice(1).join(' ')}
                            </span>
                         </div>
                         {cat !== "Todas" && (
                           <span className="text-[9px] font-bold opacity-30">{count} ITENS</span>
                         )}
                       </button>
                     );
                   })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Search Bar - Refined Style */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-primary/10">
            <Search size={14} />
          </div>
          <input 
            type="text"
            placeholder="Encontre uma receita específica..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 bg-white rounded-2xl pl-12 pr-4 border border-primary/5 focus:ring-2 focus:ring-secondary/20 outline-none text-primary font-bold placeholder:text-primary/10 transition-all text-[10px] uppercase tracking-widest"
          />
        </div>
      </header>

      {/* Grid of Recipes */}
      <AnimatePresence mode="popLayout">
        <motion.div 
          layout
          className="grid gap-6"
        >
          {recipes.length > 0 ? (
            recipes.map((recipe: Recipe, idx: number) => (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const isLocked = !isVip && !freeIds.includes(recipe.id);
                  if (isLocked) {
                    // Track InitiateCheckout when trying to access locked content
                    if (typeof window !== 'undefined' && (window as any).fbq) {
                      (window as any).fbq('track', 'InitiateCheckout', { content_name: recipe.titulo });
                    }
                    trackServerEvent('InitiateCheckout', { content_name: recipe.titulo });
                    setShowUpsellModal(true);
                  } else {
                    onSelect(recipe);
                  }
                }}
                className={`group relative bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 cursor-pointer border border-primary/5 transition-all
                  ${!isVip && !freeIds.includes(recipe.id) ? "opacity-60 saturate-0 grayscale" : "opacity-100"}`}
              >
                <div className="relative h-64 w-full">
                  <Image 
                    src={recipe.imagem} 
                    alt={recipe.titulo}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  {!isVip && !freeIds.includes(recipe.id) && (
                    <div className="absolute inset-0 bg-primary/40 backdrop-blur-[4px] flex flex-col items-center justify-center p-6 text-center transition-all group-hover:backdrop-blur-[6px]">
                       <div className="p-4 bg-white/20 backdrop-blur-md rounded-full mb-4 border border-white/30 shadow-2xl">
                         <Lock size={32} className="text-secondary drop-shadow-lg" />
                       </div>
                       <span className="bg-white px-4 py-2 rounded-full text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-2xl">Conteúdo Premium</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/30 to-transparent" />
                  
                  <div className="absolute top-6 left-6">
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/20">
                      {recipe.categoria}
                    </span>
                  </div>

                  {isDone(recipe.id) && (
                    <div className="absolute top-6 right-6 bg-success text-white px-4 py-2 rounded-full text-xs font-black flex items-center gap-2 shadow-xl backdrop-blur-md animate-pulse">
                      <CheckCircle2 size={16} /> CONCLUÍDO
                    </div>
                  )}
                  
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <h2 className="text-2xl font-black mb-3 leading-[1.1] tracking-tight">{recipe.titulo}</h2>
                    <div className="flex gap-4 text-xs font-bold uppercase tracking-widest opacity-80">
                      <span className="flex items-center gap-1.5"><Clock size={14} className="text-milho" /> {recipe.tempo}</span>
                      <span className="flex items-center gap-1.5"><ChefHat size={14} className="text-milho" /> {recipe.dificuldade}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <div className="inline-block p-6 bg-primary/5 rounded-full mb-4">
                <Sparkles size={40} className="text-primary/20" />
              </div>
              <h3 className="text-xl font-black text-primary/40">Nenhuma receita encontrada...</h3>
              <button 
                onClick={() => { setSearchQuery(""); setActiveCategory("Todas"); }}
                className="mt-4 text-secondary font-black text-sm uppercase tracking-widest underline decoration-2 underline-offset-4"
              >
                Limpar Filtros
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="mt-16 text-center">
        <p className="text-primary/30 text-[10px] font-black uppercase tracking-[0.4em]">
          Handcrafted with Love • 2024
        </p>
      </footer>
    </motion.div>
  );
}

function RecipeDetailView({ recipe, onBack, completedItems, toggleItem, progress, yieldMultiplier, setYieldMultiplier }: any) {
  const [showProfitCalc, setShowProfitCalc] = useState(false);
  const [ingredientCosts, setIngredientCosts] = useState<Record<number, number>>({});
  const [markup, setMarkup] = useState(3); // Default 3x (300%)

  const scaleIngredient = (text: string) => {
    // Fraction conversion helper
    const toFraction = (decimal: number) => {
      if (decimal % 1 === 0) return decimal.toString();
      const whole = Math.floor(decimal);
      const rem = decimal - whole;
      if (Math.abs(rem - 0.5) < 0.01) return (whole > 0 ? whole + " " : "") + "1/2";
      if (Math.abs(rem - 0.25) < 0.01) return (whole > 0 ? whole + " " : "") + "1/4";
      if (Math.abs(rem - 0.75) < 0.01) return (whole > 0 ? whole + " " : "") + "3/4";
      if (Math.abs(rem - 0.33) < 0.1) return (whole > 0 ? whole + " " : "") + "1/3";
      if (Math.abs(rem - 0.66) < 0.1) return (whole > 0 ? whole + " " : "") + "2/3";
      return decimal.toFixed(1);
    };

    return text.replace(/(\d+[\/\.]?\d*)/g, (match) => {
      try {
        let val: number;
        if (match.includes("/")) {
          const parts = match.split("/");
          val = parseInt(parts[0]) / parseInt(parts[1]);
        } else {
          val = parseFloat(match);
        }
        
        if (isNaN(val)) return match;
        const scaled = val * yieldMultiplier;
        return toFraction(scaled);
      } catch (e) { return match; }
    });
  };

  const totalCost = Object.values(ingredientCosts).reduce((acc, curr) => acc + curr, 0);
  const suggestedPrice = totalCost * markup;
  const profit = suggestedPrice - totalCost;

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100, transition: { duration: 0.2 } }}
      className="pb-32"
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-xl border-b border-primary/5">
        <div className="max-w-lg mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <motion.button whileTap={{ scale: 0.8 }} onClick={onBack} className="p-3 bg-primary/5 rounded-2xl text-primary"><ChevronLeft size={24} /></motion.button>
          <div className="flex-1 flex flex-col items-center">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40 mb-1">Seu Progresso</span>
             <div className="h-1.5 w-full max-w-[120px] bg-primary/10 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-secondary to-accent" />
             </div>
          </div>
          <div className="w-10 text-right"><span className="text-sm font-black text-primary">{progress}%</span></div>
        </div>
      </header>

      <div className="relative h-[45vh] w-full overflow-hidden">
        <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 10, ease: "linear" }} className="absolute inset-0">
          <Image src={recipe.imagem} alt={recipe.titulo} fill className="object-cover" priority />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-black/20" />
        <div className="absolute bottom-10 left-8 right-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-4xl font-black text-primary leading-tight drop-shadow-sm">{recipe.titulo}</h1>
            </motion.div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-6 -mt-4 relative z-10">
        <div className="grid grid-cols-2 gap-3 mb-10">
          {[
            { icon: Clock, label: "Preparo", val: recipe.tempo },
            { icon: ChefHat, label: "Nível", val: recipe.dificuldade },
            { icon: Coins, label: "Custo", val: recipe.custo },
            { icon: Users, label: "Rendimento", val: recipe.rendimento || "Padrão" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.1 }} className="bg-white/80 backdrop-blur-md p-4 rounded-3xl text-center shadow-lg shadow-primary/5 border border-primary/5">
              <item.icon size={18} className="text-secondary mx-auto mb-2" />
              <span className="text-[9px] uppercase tracking-wider text-primary/40 block font-black">{item.label}</span>
              <span className="text-xs font-black text-primary">{item.val}</span>
            </motion.div>
          ))}
        </div>

        {recipe.diferencial && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 p-6 bg-secondary/10 rounded-[2rem] border border-secondary/10">
             <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-secondary mb-2">
               <Sparkles size={14} /> Diferencial de Elite
             </span>
             <p className="text-sm font-bold text-primary/70 italic leading-relaxed">
               "{recipe.diferencial}"
             </p>
          </motion.div>
        )}

        {/* Interior Mood Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-10 relative h-64 w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/20 border-4 border-white"
        >
          <Image 
            src={recipe.imagem} 
            alt={recipe.titulo}
            fill
            className="object-cover hover:scale-110 transition-transform duration-[2s]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
             <span className="bg-secondary/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-[0.3em] px-4 py-2 rounded-full shadow-lg">
               Sugestão de Apresentação
             </span>
          </div>
        </motion.div>

        {/* Tab Selector */}
        <div className="flex bg-primary/5 p-1 rounded-2xl mb-8">
           <button 
             onClick={() => setShowProfitCalc(false)}
             className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${!showProfitCalc ? "bg-white text-primary shadow-sm" : "text-primary/40"}`}
           >
             Receita
           </button>
           <button 
             onClick={() => setShowProfitCalc(true)}
             className={`flex-1 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${showProfitCalc ? "bg-white text-secondary shadow-sm" : "text-primary/40"}`}
           >
             Ficha Técnica 💰
           </button>
        </div>

        {!showProfitCalc ? (
          <>
            <section className="mb-10">
              <div className="bg-primary/5 rounded-[2rem] p-6 flex items-center justify-between border border-primary/5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm"><Users size={20} className="text-secondary" /></div>
                  <div><h4 className="font-black text-primary text-sm uppercase tracking-wider">Rendimento</h4><p className="text-xs text-primary/50 font-medium">Calcular ingredientes</p></div>
                </div>
                <div className="flex items-center gap-4 bg-white/50 p-2 rounded-2xl">
                  <button onClick={() => setYieldMultiplier(Math.max(0.5, yieldMultiplier - 0.5))} className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary disabled:opacity-30" disabled={yieldMultiplier <= 0.5}><Minus size={18} /></button>
                  <span className="font-black text-xl text-primary min-w-[3rem] text-center">{yieldMultiplier}x</span>
                  <button onClick={() => setYieldMultiplier(yieldMultiplier + 0.5)} className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary"><Plus size={18} /></button>
                </div>
              </div>
            </section>

            <section className="mb-12">
              <h3 className="text-2xl font-black text-primary flex items-center gap-3 mb-6">Ingredientes <span className="text-xs font-bold px-3 py-1 bg-secondary/10 text-secondary rounded-full">{recipe.ingredientes.length} ITENS</span></h3>
              <div className="space-y-3">
                {recipe.ingredientes.map((ing: string, i: number) => {
                  const isChecked = completedItems[`${recipe.id}-ing-${i}`];
                  return (
                    <motion.div key={i} onClick={() => toggleItem(recipe.id, "ing", i)} className={`group flex items-center gap-5 p-5 rounded-[2rem] transition-all border active:scale-[0.98] cursor-pointer ${isChecked ? "bg-secondary/5 border-secondary/20" : "bg-white border-primary/5 shadow-xl shadow-primary/5"}`}>
                      <div className={`h-9 w-9 rounded-2xl border-2 flex items-center justify-center transition-all ${isChecked ? "bg-secondary border-secondary text-white" : "border-primary/10"}`}>{isChecked ? <CheckCircle2 size={24} /> : <div className="h-2 w-2 rounded-full bg-primary/10" />}</div>
                      <span className={`text-lg font-bold transition-all ${isChecked ? "text-primary/30 line-through" : "text-primary/80"}`}>{scaleIngredient(ing)}</span>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            <section className="mb-20">
              <h3 className="text-2xl font-black text-primary mb-8">Modo de Preparo</h3>
              <div className="space-y-10">
                {recipe.preparo.map((step: string, i: number) => {
                  const isChecked = completedItems[`${recipe.id}-step-${i}`];
                  return (
                    <motion.div key={i} onClick={() => toggleItem(recipe.id, "step", i)} className="relative group cursor-pointer">
                      <div className="flex gap-6">
                        <div className="flex flex-col items-center">
                          <div className={`h-12 w-12 rounded-2xl flex items-center justify-center font-black text-xl transition-all ${isChecked ? "bg-success text-white scale-90" : "bg-white text-primary border border-primary/5 shadow-lg"}`}>{isChecked ? <CheckCircle2 size={28} /> : i + 1}</div>
                          {i < recipe.preparo.length - 1 && <div className={`w-0.5 h-full my-2 rounded-full transition-colors ${isChecked ? "bg-success/30" : "bg-primary/5"}`} />}
                        </div>
                        <div className={`flex-1 transition-all ${isChecked ? "opacity-30" : "opacity-100"}`}><p className="text-[1.1rem] leading-relaxed font-bold tracking-tight">{step}</p></div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          </>
        ) : (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pb-20"
          >
            <div className="bg-secondary/5 rounded-3xl p-6 border border-secondary/10 mb-8">
               <h3 className="text-xl font-black text-primary mb-2 flex items-center gap-2">
                 <Coins size={20} className="text-secondary" />
                 Calculadora de Precificação
               </h3>
               <p className="text-xs text-primary/50 font-medium mb-6">Insira os custos para calcular seu preço de venda sugerido.</p>
               
               <div className="space-y-4">
                 {recipe.ingredientes.map((ing: string, i: number) => (
                   <div key={i} className="flex items-center justify-between gap-4">
                      <span className="text-xs font-bold text-primary/60 flex-1 truncate">{ing}</span>
                      <div className="relative w-28">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-primary/30">R$</span>
                        <input 
                          type="number" 
                          step="0.01"
                          placeholder="0,00"
                          value={ingredientCosts[i] || ""}
                          onChange={(e) => setIngredientCosts({...ingredientCosts, [i]: parseFloat(e.target.value) || 0})}
                          className="w-full bg-white border border-primary/10 rounded-xl py-2 pl-8 pr-3 text-xs font-black text-primary focus:ring-2 focus:ring-secondary/20 outline-none"
                        />
                      </div>
                   </div>
                 ))}
               </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-primary/10 border border-primary/5 space-y-6">
               <div className="flex justify-between items-center pb-4 border-b border-primary/5">
                  <span className="text-sm font-bold text-primary/40 uppercase tracking-widest">Custo de Produção</span>
                  <span className="text-xl font-black text-primary">R$ {totalCost.toFixed(2)}</span>
               </div>

               <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold text-primary/40 uppercase tracking-widest">
                    <span>Multiplicador (Markup)</span>
                    <span className="text-secondary">{markup}x</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="0.5" 
                    value={markup}
                    onChange={(e) => setMarkup(parseFloat(e.target.value))}
                    className="w-full h-2 bg-primary/5 rounded-lg appearance-none cursor-pointer accent-secondary"
                  />
                  <div className="flex justify-between text-[10px] font-black text-primary/20 px-1">
                    <span>CONSERVADOR (1x)</span>
                    <span>PADRÃO (3x)</span>
                    <span>PRÊMIO (5x)</span>
                  </div>
               </div>

               <div className="bg-primary p-6 rounded-3xl text-center space-y-1">
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Preço de Venda Sugerido</span>
                  <div className="text-4xl font-black text-white">R$ {suggestedPrice.toFixed(2)}</div>
                  <div className="pt-2">
                    <span className="text-xs font-bold text-success bg-white/10 px-3 py-1 rounded-full">
                      LUCRO ESTIMADO: R$ {profit.toFixed(2)}
                    </span>
                  </div>
               </div>

               <p className="text-[10px] text-center text-primary/20 leading-relaxed font-medium">
                 * Os valores acima são estimativas baseadas nos custos informados por você. Não esqueça de considerar gastos fixos (gás, luz, embalagem).
               </p>
            </div>
          </motion.section>
        )}

        {/* Global Premium Sections: Visible in both tabs */}
        <div className="pb-32">
          {recipe.segredo && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-12 p-8 bg-primary rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-primary/20">
               <div className="absolute -top-10 -right-10 h-32 w-32 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
               <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-secondary mb-4">
                 <Trophy size={16} /> O Segredo do Chef
               </span>
               <p className="text-sm font-bold leading-relaxed text-white/90 relative z-10">{recipe.segredo}</p>
            </motion.div>
          )}

          {recipe.harmonizacao && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mt-6 p-8 bg-white border border-primary/5 rounded-[3rem] shadow-xl shadow-primary/5">
               <span className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary/30 mb-4">
                 <Plus size={16} className="text-secondary" /> Sugestão de Harmonização
               </span>
               <p className="text-sm font-bold text-primary/60 leading-relaxed italic">"{recipe.harmonizacao}"</p>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="fixed bottom-8 left-0 right-0 px-8 z-50">
        <motion.div initial={{ y: 100 }} animate={{ y: 0 }} className="max-w-lg mx-auto">
          <button onClick={onBack} className="w-full h-18 bg-primary text-white rounded-[2rem] font-bold text-lg shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"><ChevronLeft size={24} className="opacity-50" /> Voltar ao Menu</button>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SidebarDrawer({ isOpen, onClose, categories, activeCategory, onSelectCategory, globalProgress, completedCount, totalCount }: any) {
  return (
    <div className="fixed inset-0 z-[110] flex overflow-hidden">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-primary/60 backdrop-blur-sm" 
      />
      
      <motion.div 
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="relative w-[85%] max-w-xs bg-white h-full shadow-2xl flex flex-col"
      >
        <div className="p-8 pb-4">
          <div className="flex items-center justify-between mb-10">
             <div className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary/20">R</div>
             <button onClick={onClose} className="p-3 bg-primary/5 rounded-2xl text-primary/20 hover:text-primary transition-colors"><X size={24} /></button>
          </div>

          <div className="bg-primary/[0.03] rounded-[2.5rem] p-7 mb-8 border border-primary/5">
             <div className="flex items-center gap-3 mb-5">
                <div className="p-2.5 bg-secondary/10 rounded-xl"><Trophy size={20} className="text-secondary" /></div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">Sua Jornada</span>
             </div>
             <div className="flex items-end justify-between mb-3">
                <span className="text-3xl font-black text-primary">{globalProgress}%</span>
                <span className="text-[10px] font-bold text-primary/30 uppercase tracking-widest">{completedCount}/{totalCount} Feitas</span>
             </div>
             <div className="h-2.5 w-full bg-primary/5 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${globalProgress}%` }} transition={{ duration: 1, ease: "easeOut" }} className="h-full bg-gradient-to-r from-secondary to-accent" />
             </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 space-y-1 custom-scrollbar">
           <span className="px-5 text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 py-4 block">Livro de Receitas</span>
           {categories.map((cat: string) => (
             <button
               key={cat}
               onClick={() => onSelectCategory(cat)}
               className={`w-full flex items-center gap-5 px-5 py-5 rounded-[1.5rem] transition-all group ${
                 activeCategory === cat ? "bg-primary text-white shadow-xl shadow-primary/20" : "text-primary/60 hover:bg-primary/5"
               }`}
             >
               <span className="text-2xl transition-transform group-hover:scale-110 duration-300">{cat.split(' ')[0]}</span>
               <span className="text-xs font-black uppercase tracking-widest leading-none">
                 {cat === "Todas" ? "Início" : cat.split(' ').slice(1).join(' ')}
               </span>
             </button>
           ))}
        </nav>

        <div className="p-8 border-t border-primary/5">
           <div className="bg-gradient-to-br from-secondary to-accent p-7 rounded-[2.5rem] text-center space-y-4 mb-8 shadow-xl shadow-secondary/20 relative overflow-hidden group">
              <motion.div initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute -top-10 -right-10 h-32 w-32 bg-white/10 rounded-full" />
              <Sparkles size={28} className="text-white mx-auto opacity-70 group-hover:scale-125 transition-transform" />
              <div>
                <h4 className="text-white font-black text-sm uppercase tracking-wider leading-tight">Torne-se um Mestre</h4>
                <p className="text-white/60 text-[10px] mt-1 font-bold">Acesso a conteúdos exclusivos</p>
              </div>
              <button className="w-full h-12 bg-white text-secondary rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">
                CONHECER GUIA VIP
              </button>
           </div>
           
           <div className="flex items-center justify-around">
              <button className="p-3 text-primary/20 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"><MessageCircle size={22} /></button>
              <button className="p-3 text-primary/20 hover:text-primary hover:bg-primary/5 rounded-2xl transition-all"><Settings size={22} /></button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}

function SuccessModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 w-full max-w-sm text-center relative overflow-hidden shadow-2xl">
        <motion.button onClick={onClose} className="absolute top-6 right-6 p-2 text-primary/20"><X size={32} /></motion.button>
        <div className="mb-8 p-6 bg-secondary/10 rounded-[2.5rem] inline-block"><PartyPopper size={64} className="text-secondary" /></div>
        <h2 className="text-4xl font-black text-primary mb-4 leading-tight">UAI, QUE <br />ORGULHO!</h2>
        <p className="text-lg text-primary/60 mb-10 font-bold px-2">Você finalizou com perfeição. Que tal descobrir o próximo prato de elite do nosso Arraiá?</p>
        <button 
          className="group w-full h-20 bg-gradient-to-br from-secondary to-accent text-white rounded-[2rem] font-black text-xl shadow-2xl flex items-center justify-center gap-4 relative overflow-hidden" 
          onClick={onClose}
        >
          <span className="relative z-10">VER MAIS RECEITAS</span>
          <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform relative z-10" />
        </button>
      </motion.div>
    </div>
  );
}

function UpsellModal({ isOpen, onClose, checkoutUrl }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-primary/90 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 w-full max-w-md text-center shadow-2xl border border-primary/5">
        <div className="mb-8 p-6 bg-secondary/10 rounded-[2.5rem] inline-block">
          <Trophy size={64} className="text-secondary" />
        </div>
        <h2 className="text-4xl font-black text-primary mb-4 leading-tight uppercase tracking-tight">Desbloqueie <br />o Arraiá de Elite!</h2>
        <p className="text-sm text-primary/60 mb-10 font-bold px-4 leading-relaxed">
           Você descobriu o segredo das receitas de elite. Mas ainda temos 35 técnicas guardadas a sete chaves que vão te transformar em um mestre das festas juninas.
        </p>
        
        <div className="space-y-4 mb-10">
           {[
             "Acesso Completo às 40 Receitas",
             "Todas as Calculadoras de Lucro",
             "Segredos Técnicos do Chef",
             "Suporte Prioritário VIP"
           ].map((item, i) => (
             <div key={i} className="flex items-center gap-3 bg-primary/5 p-4 rounded-2xl">
                <CheckCircle2 size={18} className="text-success" />
                <span className="text-xs font-black text-primary/80 uppercase tracking-widest">{item}</span>
             </div>
           ))}
        </div>

        <a 
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group w-full h-16 bg-gradient-to-br from-secondary to-accent text-white rounded-[2rem] font-black text-xs shadow-2xl flex items-center justify-center gap-4 active:scale-95 transition-all no-underline"
        >
          <span>QUERO MEU ACESSO VIP</span>
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </a>
        
        <button onClick={onClose} className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-primary/20 hover:text-primary transition-colors">Voltar e ver receitas grátis</button>
      </motion.div>
    </div>
  );
}
