import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { GAME_MODES } from '../constants';

const Card = ({ card, flippedIds, matchedIds, turn, gameMode, isProcessing, onCardClick }) => {
    const isCurrentlyFlipped = flippedIds.includes(card.id);
    const isMatched = matchedIds.includes(card.id);
    const isFaceUp = isCurrentlyFlipped || isMatched;
    const canInteract = !isProcessing && !isFaceUp && !(turn === 'P2' && gameMode === GAME_MODES.VS_AI);

    return (
        <motion.div
            className="relative aspect-square cursor-pointer group"
            onClick={() => onCardClick(card.id)}
            style={{ perspective: '1000px' }}
            whileHover={canInteract ? { scale: 1.05, y: -5 } : {}}
            whileTap={canInteract ? { scale: 0.95 } : {}}
        >
            <motion.div
                className="w-full h-full relative"
                initial={false}
                animate={{
                    rotateY: isFaceUp ? 180 : 0,
                    boxShadow: isFaceUp
                        ? (isMatched ? "0 0 25px rgba(34,197,94,0.4)" : "0 10px 20px rgba(0,0,0,0.4)")
                        : "0 4px 6px rgba(0,0,0,0.2)"
                }}
                transition={{ duration: 0.4, ease: "backOut" }}
                style={{ transformStyle: 'preserve-3d' }}
            >
                <div
                    className={`absolute inset-0 w-full h-full bg-slate-900 border-2 rounded-lg flex items-center justify-center transition-all duration-300 overflow-hidden ${canInteract ? 'border-blue-500/40 group-hover:border-blue-400 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-slate-800'}`}
                    style={{ backfaceVisibility: 'hidden' }}
                >
                    <Zap className={`transition-all duration-300 ${canInteract ? 'text-blue-500/30 group-hover:text-blue-400 group-hover:scale-110' : 'text-slate-700'}`} size="50%" />
                    {canInteract && (
                        <motion.div
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/10 to-transparent h-1/3 w-full pointer-events-none"
                            animate={{ top: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                        />
                    )}
                </div>
                <div
                    className={`absolute inset-0 w-full h-full rounded-lg flex items-center justify-center text-2xl sm:text-4xl border-2 ${isMatched ? 'bg-green-500/10 border-green-500' : 'bg-slate-800 border-purple-500 shadow-xl'}`}
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                    {card.content}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Card;
