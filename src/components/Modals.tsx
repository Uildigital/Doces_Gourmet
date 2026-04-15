"use client";

import React from "react";
import { X, Lock, Trophy, LayoutDashboard, Gift } from "lucide-react";
import { motion } from "framer-motion";

export function SidebarDrawer({ isOpen, onClose, categories, activeCategory, onSelectCategory, globalProgress, activeTab, setActiveTab }: any) {
  return (
    <motion.div initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", damping: 25, stiffness: 200 }} className="fixed inset-0 z-50 flex shadow-2xl">
      <div className="w-full max-w-xs bg-primary text-white p-8 flex flex-col">
        <div className="flex items-center justify-between mb-12">
            <h2 className="text-xl font-black">Menu VIP</h2>
            <button onClick={onClose} className="p-2 bg-white/10 rounded-xl"><X size={20} /></button>
        </div>
        
        <div className="space-y-2 mb-10">
           <button onClick={() => { setActiveTab('dashboard'); onClose(); }} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === 'dashboard' ? "bg-secondary" : "hover:bg-white/5"}`}><LayoutDashboard size={20} /> <span className="text-[10px] uppercase font-black tracking-widest">Início</span></button>
           <button onClick={() => { setActiveTab('bonuses'); onClose(); }} className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${activeTab === 'bonuses' ? "bg-secondary" : "hover:bg-white/5"}`}><Gift size={20} /> <span className="text-[10px] uppercase font-black tracking-widest">Bônus</span></button>
        </div>

        <div className="flex-1 space-y-2 overflow-y-auto">
          <span className="text-[9px] font-black uppercase tracking-widest opacity-20 block mb-4">Categorias</span>
          {categories.map((cat: string) => (
            <button key={cat} onClick={() => onSelectCategory(cat)} className={`w-full text-left p-4 rounded-xl text-[10px] font-black uppercase tracking-widest ${activeCategory === cat ? "bg-white/10" : "opacity-40"}`}>{cat}</button>
          ))}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center justify-between mb-2"><span className="text-[10px] font-black opacity-40">Progresso</span><span className="text-[10px] font-black">{globalProgress}%</span></div>
           <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden"><div className="h-full bg-secondary" style={{ width: `${globalProgress}%` }} /></div>
        </div>
      </div>
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
    </motion.div>
  );
}

export function UpsellModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] overflow-hidden">
        <div className="bg-primary p-12 text-center text-white">
          <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"><Lock size={40} /></div>
          <h2 className="text-3xl font-black mb-4">Acesso Bloqueado</h2>
          <p className="text-white/60 text-sm">Desbloqueie agora por apenas R$ 47 para liberar todo o conteúdo gourmet.</p>
        </div>
        <div className="p-8"><button className="w-full py-5 bg-secondary text-white rounded-2xl font-black shadow-xl" onClick={() => window.location.href="#"}>LIBERAR AGORA</button></div>
      </motion.div>
    </div>
  );
}

export function SuccessModal({ isOpen, onClose }: any) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-10 text-center">
        <div className="w-20 h-20 bg-success rounded-full flex items-center justify-center mx-auto mb-6"><Trophy size={40} className="text-white" /></div>
        <h2 className="text-3xl font-black text-primary mb-4">Fantástico!</h2>
        <p className="text-primary/60 text-sm mb-8">Doce concluído com sucesso. Você está subindo de nível!</p>
        <button onClick={onClose} className="w-full py-5 bg-primary text-white rounded-2xl font-black shadow-xl">CONTINUAR</button>
      </motion.div>
    </div>
  );
}
