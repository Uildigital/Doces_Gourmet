"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronLeft, 
  Copy, 
  Check, 
  MessageCircle, 
  Send, 
  Zap,
  Target,
  TrendingUp
} from "lucide-react";
import scriptsData from "@/data/bonuses/scripts.json";

export default function ScriptsWhatsApp({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<'lancamento' | 'fechamento' | 'retencao'>('lancamento');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy!", err);
    }
  };

  const categories = [
    { id: 'lancamento', label: 'Atração VIP', icon: Zap },
    { id: 'fechamento', label: 'Fechamento Ouro', icon: Target },
    { id: 'retencao', label: 'Fidelização Elite', icon: TrendingUp },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-40 bg-[#FDF9F6] min-h-screen antialiased">
      {/* Header Elite */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDF9F6]/95 backdrop-blur-md border-b border-primary/10 p-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-white border border-primary/20 shadow-md rounded-2xl text-primary active:scale-95 transition-transform"><ChevronLeft size={20} /></button>
        <div className="bg-success px-3 py-1.5 rounded-xl shadow-lg border border-white/20"><span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1"><MessageCircle size={10}/> Copywriting</span></div>
      </header>
      
      {/* Hero Section Masterclass */}
      <div className="relative w-full overflow-hidden pb-12">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-success rounded-b-[5rem] shadow-2xl -translate-y-24">
            <div className="absolute inset-0 bg-gradient-to-t from-success via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] opacity-10"><Send size={300} strokeWidth={0.5}/></div>
        </div>
        
        <div className="relative z-10 pt-32 px-6">
            <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-3xl mb-6 backdrop-blur-xl border border-white/20"><MessageCircle size={32} className="text-white" /></div>
                <h1 className="text-4xl font-black text-white mb-2 leading-none uppercase tracking-tighter">Scripts <br/><span className="text-primary-foreground opacity-50">Irresistíveis</span></h1>
                <p className="text-white/60 text-sm max-w-xs font-medium italic">Como vender doces de alto ticket através da palavra certa.</p>
            </div>
        </div>
      </div>

      {/* Navigation Tabs Expert */}
      <div className="px-6 mb-10 overflow-x-auto relative z-20">
        <div className="flex p-2 bg-white rounded-3xl shadow-xl border border-primary/5 min-w-max">
          {categories.map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveCategory(tab.id as any)} 
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeCategory === tab.id ? "bg-primary text-white shadow-lg" : "text-primary/40"}`}
            >
              <tab.icon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            {scriptsData.filter(s => s.categoria === activeCategory).map((script) => (
              <div key={script.id} className="bg-white p-8 rounded-[3rem] shadow-2xl border border-primary/5 relative group overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-black text-primary text-sm uppercase tracking-widest pl-2 border-l-4 border-secondary leading-none">{script.titulo}</h3>
                    <button onClick={() => handleCopy(script.id, script.texto)} className={`p-3 rounded-2xl transition-all ${copiedId === script.id ? "bg-success text-white scale-110 shadow-lg" : "bg-primary/5 text-primary hover:bg-primary hover:text-white"}`}>
                        {copiedId === script.id ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                </div>
                <div className="bg-primary/5 p-6 rounded-[2rem] border border-primary/5 mb-4">
                    <p className="text-sm text-primary/80 leading-relaxed font-medium italic">"{script.texto}"</p>
                </div>
                <div className="flex items-center gap-2 px-2"><div className="h-1.5 w-1.5 rounded-full bg-secondary animate-pulse" /><span className="text-[10px] font-black text-secondary uppercase tracking-widest">Gatilho Premium Ativado</span></div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
