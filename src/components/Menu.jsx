import React from 'react';
import { motion } from 'framer-motion';
import { Play, Bot, Users } from 'lucide-react';
import { GAME_MODES, DIFFICULTIES, CARD_COUNTS } from '../constants';

const Menu = ({ gameMode, setGameMode, difficulty, setDifficulty, cardCount, setCardCount, onInitGame }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-10">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900/90 border border-white/10 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl w-full max-w-md">
                <div className="text-center mb-10">
                    <h1 className="text-5xl font-black italic tracking-tighter text-white uppercase">
                        Memory<span className="text-blue-500">Lab</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-bold tracking-[0.3em] mt-2 uppercase">Neural Match Protocol</p>
                </div>
                <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => setGameMode(GAME_MODES.VS_AI)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${gameMode === GAME_MODES.VS_AI ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-slate-800 bg-slate-800/40 opacity-50'}`}>
                            <Bot size={32} className={gameMode === GAME_MODES.VS_AI ? 'text-blue-400' : 'text-slate-400'} />
                            <span className="font-bold text-[10px] uppercase tracking-wider">VS System</span>
                        </button>
                        <button onClick={() => setGameMode(GAME_MODES.LOCAL_PVP)} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${gameMode === GAME_MODES.LOCAL_PVP ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-slate-800 bg-slate-800/40 opacity-50'}`}>
                            <Users size={32} className={gameMode === GAME_MODES.LOCAL_PVP ? 'text-purple-400' : 'text-slate-400'} />
                            <span className="font-bold text-[10px] uppercase tracking-wider">PVP Mode</span>
                        </button>
                    </div>
                    {gameMode === GAME_MODES.VS_AI && (
                        <div className="space-y-3">
                            <p className="text-[10px] font-black text-slate-500 tracking-widest text-center uppercase">Difficulty Protocol</p>
                            <div className="flex gap-2">
                                {[DIFFICULTIES.EASY, DIFFICULTIES.MEDIUM, DIFFICULTIES.HARD].map(level => (
                                    <button key={level} onClick={() => setDifficulty(level)} className={`flex-1 py-2 text-[10px] font-black rounded-lg border transition-all ${difficulty === level ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-slate-800 text-slate-500'}`}>{level}</button>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-500 tracking-widest text-center uppercase">Grid Dimension</p>
                        <div className="flex gap-2">
                            {CARD_COUNTS.map(size => (
                                <button key={size} onClick={() => setCardCount(size)} className={`flex-1 py-3 font-black rounded-xl border-2 transition-all text-sm ${cardCount === size ? 'border-pink-500 text-pink-400 bg-pink-500/5 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-slate-800 text-slate-500'}`}>{Math.sqrt(size)}x{Math.sqrt(size)}</button>
                            ))}
                        </div>
                    </div>
                    <button onClick={onInitGame} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 uppercase active:scale-95">
                        <Play fill="white" size={20} /> Initialize
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Menu;
