"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronLeft, 
  Search, 
  ChevronRight, 
  AlertTriangle, 
  Calendar, 
  Package,
  TrendingUp,
  Droplets,
  Star
} from "lucide-react";

export default function ControleEstoque({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<'fundamentos' | 'validades' | 'perdas'>('fundamentos');
  const [searchQuery, setSearchQuery] = useState("");

  const validades = [
    { item: "Brigadeiro Gourmet", geladeira: "7 dias", congelador: "90 dias", ambiente: "3 dias" },
    { item: "Brownie Fudge", geladeira: "10 dias", congelador: "60 dias", ambiente: "5 dias" },
    { item: "Massa Chiffon", geladeira: "4 dias", congelador: "90 dias", ambiente: "2 dias" },
    { item: "Creme Mascarpone", geladeira: "3 dias", congelador: "Não indicado", ambiente: "Não indicado" },
    { item: "Geleia de Frutas", geladeira: "15 dias", congelador: "120 dias", ambiente: "2 dias" },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-40 bg-[#FDF9F6] min-h-screen antialiased">
      {/* Header Premium */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDF9F6]/95 backdrop-blur-md border-b border-primary/10 p-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-white border border-primary/20 shadow-md rounded-2xl text-primary active:scale-95 transition-transform"><ChevronLeft size={20} /></button>
        <div className="bg-primary px-3 py-1.5 rounded-xl shadow-lg border border-white/20"><span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1"><Star size={10}/> Gestão Master</span></div>
      </header>
      
      {/* Hero Section Masterclass */}
      <div className="relative w-full overflow-hidden pb-12">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary rounded-b-[5rem] shadow-2xl -translate-y-20">
            <div className="absolute inset-0 bg-gradient-to-t from-primary via-transparent to-transparent opacity-60" />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] opacity-10"><Package size={300} strokeWidth={0.5}/></div>
        </div>
        
        <div className="relative z-10 pt-32 px-6">
            <div className="flex flex-col items-center text-center">
                <div className="bg-secondary/20 p-4 rounded-3xl mb-6 backdrop-blur-xl border border-white/10"><TrendingUp size={32} className="text-secondary" /></div>
                <h1 className="text-4xl font-black text-white mb-2 leading-none uppercase tracking-tighter">Gestão <br/><span className="text-secondary">Diamante</span></h1>
                <p className="text-white/60 text-sm max-w-xs font-medium italic">O segredo da escala está no controle absoluto.</p>
            </div>
        </div>
      </div>

      {/* Navigation Tabs Expert */}
      <div className="px-6 mb-10 overflow-x-auto">
        <div className="flex p-2 bg-white rounded-3xl shadow-xl border border-primary/5 min-w-max">
          {[
            { id: 'fundamentos', label: 'Estratégia' },
            { id: 'validades', label: 'Validades' },
            { id: 'perdas', label: 'Markup/Custos' }
          ].map((tab) => (
            <button 
              key={tab.id} 
              onClick={() => setActiveCategory(tab.id as any)} 
              className={`px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === tab.id ? "bg-primary text-white shadow-lg" : "text-primary/40"}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeCategory === 'fundamentos' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <div className="bg-white p-8 rounded-[3rem] shadow-2xl border border-primary/5">
                    <h3 className="text-2xl font-black text-primary mb-6 leading-none">A Regra dos <br/><span className="text-secondary text-4xl">3 Pilares</span></h3>
                    <div className="space-y-6">
                        <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/5">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-md font-black">01</div>
                            <p className="text-[14px] font-bold text-primary/80 leading-snug">Estoque Mínimo de Emergência para Insumos Importados (Belga, Pistache).</p>
                        </div>
                        <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/5">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-md font-black">02</div>
                            <p className="text-[14px] font-bold text-primary/80 leading-snug">FIFO (Primeiro que entra, primeiro que sai) para garantir frescor total.</p>
                        </div>
                        <div className="flex gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/5">
                            <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-md font-black">03</div>
                            <p className="text-[14px] font-bold text-primary/80 leading-snug">Fracionamento e Pré-pesagem para agilizar a produção em escala.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-primary p-8 rounded-[3rem] shadow-2xl">
                    <h4 className="text-white font-black uppercase text-[10px] tracking-widest mb-4 flex items-center gap-2"><AlertTriangle size={14} className="text-secondary"/> Alerta de Desperdício</h4>
                    <p className="text-white/60 text-sm font-medium leading-relaxed italic">"O maior inimigo do lucro gourmet é a falta de padrão no peso dos doces."</p>
                </div>
            </motion.div>
          )}

          {activeCategory === 'validades' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                <header className="mb-6"><div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={16} /><input type="text" placeholder="Buscar item..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full h-12 bg-white rounded-2xl pl-12 pr-4 outline-none border border-primary/5 font-black text-[10px] uppercase tracking-widest" /></div></header>
                {validades.filter(v => v.item.toLowerCase().includes(searchQuery.toLowerCase())).map((item, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-primary/5 group">
                        <div className="flex items-center justify-between mb-4"><span className="font-black text-lg text-primary tracking-tight">{item.item}</span><Calendar size={20} className="text-secondary" /></div>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="p-3 bg-primary/5 rounded-xl text-center"><span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Geladeira</span><span className="text-[11px] font-black text-primary">{item.geladeira}</span></div>
                            <div className="p-3 bg-primary/5 rounded-xl text-center"><span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Freezer</span><span className="text-[11px] font-black text-primary">{item.congelador}</span></div>
                            <div className="p-3 bg-primary/5 rounded-xl text-center"><span className="text-[9px] font-black uppercase text-primary/40 block mb-1">Ambiente</span><span className="text-[11px] font-black text-primary">{item.ambiente}</span></div>
                        </div>
                    </div>
                ))}
            </motion.div>
          )}

          {activeCategory === 'perdas' && (
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
               <div className="bg-primary text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black mb-6 flex items-center gap-2">Planilha <br/><span className="text-secondary text-3xl">Pura Emoção</span></h3>
                    <p className="text-white/60 text-sm mb-10 leading-relaxed font-medium">Baixe o modelo master de precificação e controle de perdas que utilizo em minha consultoria.</p>
                    <button className="w-full py-5 bg-secondary text-white rounded-2xl font-black shadow-xl group-active:scale-95 transition-all text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-3">Baixar Modelo .XLS <ChevronRight size={16}/></button>
                  </div>
               </div>
               <div className="p-8 bg-white rounded-[3rem] border border-primary/5 shadow-2xl">
                    <h4 className="font-black text-primary text-sm uppercase tracking-widest mb-4 flex items-center gap-2">Resumo técnico</h4>
                    <p className="text-xs text-primary/60 leading-relaxed italic">Controle o peso de cada unidade. 1g de erro em 1000 brigadeiros belgas = 1kg de prejuízo.</p>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
