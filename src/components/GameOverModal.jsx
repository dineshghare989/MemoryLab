import React from 'react';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { GAME_MODES, GAME_STATUS } from '../constants';

const GameOverModal = ({ scores, gameMode, initGame, setStatus }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-6">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-slate-900 border border-white/10 rounded-[3rem] p-10 text-center max-w-sm w-full shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 pointer-events-none" />
                <Trophy className="mx-auto text-yellow-500 mb-6 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]" size={80} />
                <h2 className="text-3xl font-black italic uppercase text-white mb-2">
                    {scores.P1 === scores.P2 ? 'Epic Draw' : (scores.P1 > scores.P2 ? 'P1 Victory' : 'AI Victory')}
                </h2>
                <p className="text-slate-400 text-sm mb-8">Match Protocol Concluded.</p>
                <div className="flex justify-between items-center bg-white/5 rounded-2xl p-6 mb-8 border border-white/5">
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-blue-400 uppercase">P1</p>
                        <p className="text-4xl font-black">{scores.P1}</p>
                    </div>
                    <div className="h-10 w-px bg-white/10" />
                    <div className="text-center">
                        <p className="text-[10px] font-bold text-purple-400 uppercase">{gameMode === GAME_MODES.VS_AI ? 'AI' : 'P2'}</p>
                        <p className="text-4xl font-black">{scores.P2}</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <button onClick={initGame} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Play Again</button>
                    <button onClick={() => setStatus(GAME_STATUS.MENU)} className="w-full py-4 bg-slate-800 rounded-2xl font-black text-slate-400 uppercase tracking-widest active:scale-95 transition-transform">Hub Menu</button>
                </div>
            </motion.div>
        </div>
    );
};

export default GameOverModal;
