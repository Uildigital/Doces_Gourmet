"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { 
  ChevronLeft, 
  Star, 
  Palette, 
  Box, 
  Truck,
  CheckCircle2,
  ChevronRight,
  Sparkles
} from "lucide-react";

export default function GuiaEmbalagens({ onBack }: { onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<'conceito' | 'kits' | 'entrega'>('conceito');

  const categories = [
    { id: 'conceito', label: 'Conceito Expert', icon: Palette },
    { id: 'kits', label: 'Kits & Joias', icon: Box },
    { id: 'entrega', label: 'Unboxing Elite', icon: Truck },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pb-44 bg-[#FDF9F6] min-h-screen antialiased">
      {/* Header Premium */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#FDF9F6]/95 backdrop-blur-md border-b border-primary/10 p-4 flex items-center justify-between shadow-sm">
        <button onClick={onBack} className="p-2.5 bg-white border border-primary/20 shadow-md rounded-2xl text-primary active:scale-95 transition-transform"><ChevronLeft size={20} /></button>
        <div className="bg-secondary px-3 py-1.5 rounded-xl shadow-lg border border-white/20"><span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1"><Star size={10}/> Mentoria Elite</span></div>
      </header>
      
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden pb-12">
        <div className="absolute top-0 left-0 w-full h-[450px] bg-secondary rounded-b-[5rem] shadow-2xl -translate-y-16">
            <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent opacity-40" />
            <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-[80%] opacity-10"><Box size={300} strokeWidth={0.5}/></div>
        </div>
        
        <div className="relative z-10 pt-32 px-6">
            <div className="flex flex-col items-center text-center">
                <div className="bg-white/20 p-4 rounded-3xl mb-6 backdrop-blur-xl border border-white/20"><Palette size={32} className="text-white" /></div>
                <h1 className="text-4xl font-black text-white mb-2 leading-none uppercase tracking-tighter italic">Design de <br/><span className="text-primary not-italic">Vitrine</span></h1>
                <p className="text-white/60 text-sm max-w-xs font-medium italic">O sabor atrai, mas a embalagem vende pelo valor que você quiser cobrar.</p>
            </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="px-6 -mt-4 mb-10 overflow-x-auto relative z-20">
        <div className="flex p-2 bg-white rounded-3xl shadow-2xl border border-primary/5 min-w-max">
            {categories.map((cat: any) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id as any)} className={`flex items-center gap-3 px-6 py-4 rounded-2xl transition-all ${activeCategory === cat.id ? "bg-primary text-white shadow-xl" : "text-primary/40 hover:text-primary"}`}>
                    <cat.icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">{cat.label}</span>
                </button>
            ))}
        </div>
      </div>

      <div className="px-6 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {activeCategory === 'conceito' && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
               <div className="bg-white p-10 rounded-[4rem] shadow-2xl border border-primary/5">
                  <h3 className="text-3xl font-black text-primary mb-8 leading-tight tracking-tighter">O "Fator Wow"</h3>
                  <div className="space-y-10">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-secondary font-black text-xs uppercase tracking-[0.2em] mb-2"><Sparkles size={16}/> Psicologia das Cores</div>
                        <p className="text-[15px] font-bold text-primary/80 leading-relaxed italic border-l-4 border-secondary pl-6 py-2 bg-secondary/5 rounded-r-2xl">"Use tons pastel com detalhes em ouro. O rosa denota doçura, o marrom denota profundidade de sabor e o ouro denota elite."</p>
                     </div>
                     <div className="space-y-4">
                        <div className="flex items-center gap-3 text-secondary font-black text-xs uppercase tracking-[0.2em] mb-2"><Box size={16}/> Textura Tátil</div>
                        <p className="text-[14px] font-medium text-primary/60 leading-relaxed">Papéis de alta gramatura (mínimo 240g) e verniz localizado transformam uma caixa comum em um baú de luxo.</p>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {activeCategory === 'kits' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
               {[
                 { title: "Box Degustação Elite", desc: "4 unidades em berço de seda, papel manteiga personalizado e laço de gorgurão.", tag: "Campeão de Vendas" },
                 { title: "Torre Gourmet (3 andares)", desc: "Empilhamento vertical para presente de alto ticket. Brigadeiros, Brownies e Fatias.", tag: "Exclusivo" },
                 { title: "Case de Luxo Unitária", desc: "Para brindes corporativos e ventos de gala. Minimalismo absoluto.", tag: "Elite" }
               ].map((kit, i) => (
                 <div key={i} className="bg-white p-8 rounded-[3rem] shadow-xl border border-primary/5 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 py-2 px-5 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-bl-3xl">{kit.tag}</div>
                    <h4 className="text-xl font-black text-primary mb-3 mt-4">{kit.title}</h4>
                    <p className="text-sm text-primary/60 font-medium mb-6">{kit.desc}</p>
                    <div className="flex items-center gap-2 text-secondary text-[10px] font-black uppercase tracking-widest italic group-hover:gap-4 transition-all">Ver Detalhes Técnicos <ChevronRight size={14}/></div>
                 </div>
               ))}
            </motion.div>
          )}

          {activeCategory === 'entrega' && (
             <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
                <div className="bg-primary text-white p-10 rounded-[4rem] shadow-2xl relative overflow-hidden">
                    <div className="relative z-10">
                        <h3 className="text-3xl font-black mb-6">Unboxing <br/><span className="text-secondary text-5xl">Memorável</span></h3>
                        <ul className="space-y-4 mb-8">
                            <li className="flex items-center gap-3 text-sm font-medium text-white/80"><CheckCircle2 className="text-secondary shrink-0" size={18}/> Borrifar aroma artesanal na caixa.</li>
                            <li className="flex items-center gap-3 text-sm font-medium text-white/80"><CheckCircle2 className="text-secondary shrink-0" size={18}/> Cartão de agradecimento escrito à mão.</li>
                            <li className="flex items-center gap-3 text-sm font-medium text-white/80"><CheckCircle2 className="text-secondary shrink-0" size={18}/> Adesivo de segurança personalizado.</li>
                        </ul>
                        <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] italic">"O cliente compra o doce, mas volta pelo carinho."</p>
                    </div>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
