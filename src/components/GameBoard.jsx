import React from 'react';
import { User, Bot, Users, RotateCcw, Home } from 'lucide-react';
import { GAME_MODES, GAME_STATUS } from '../constants';
import Card from './Card';

const GameBoard = ({
    scores,
    turn,
    gameMode,
    difficulty,
    initGame,
    setStatus,
    cards,
    gridConfig,
    cardCount,
    flippedIds,
    matchedIds,
    isProcessing,
    onCardClick
}) => {
    return (
        <div className="flex flex-col items-center pt-8 pb-12 w-full">
            <div className="w-full grid grid-cols-3 items-center bg-slate-900/80 backdrop-blur-md border border-white/10 p-4 rounded-3xl mb-8 shadow-xl">
                {/* Score Left */}
                <div className={`flex items-center gap-4 px-4 py-2 rounded-2xl transition-all justify-start ${turn === 'P1' ? 'bg-blue-500/20 ring-2 ring-blue-500' : 'opacity-40'}`}>
                    <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/40"><User size={20} /></div>
                    <div>
                        <p className="text-[10px] font-bold text-blue-300 uppercase leading-none mb-1">P1 Score</p>
                        <p className="text-2xl font-black leading-none">{scores.P1}</p>
                    </div>
                </div>

                {/* Navigation Center */}
                <div className="flex flex-col items-center gap-2 border-x border-white/5">
                    <div className="flex gap-4">
                        <button onClick={initGame} title="Restart" className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-all active:scale-90">
                            <RotateCcw size={18} />
                        </button>
                        <button onClick={() => setStatus(GAME_STATUS.MENU)} title="Menu" className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/5 rounded-full transition-all active:scale-90">
                            <Home size={18} />
                        </button>
                    </div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                        {gameMode === GAME_MODES.VS_AI ? difficulty : 'LOCAL PVP'}
                    </div>
                </div>

                {/* Score Right */}
                <div className={`flex items-center gap-4 px-4 py-2 rounded-2xl transition-all justify-end ${turn === 'P2' ? 'bg-purple-500/20 ring-2 ring-purple-500' : 'opacity-40'}`}>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-purple-300 uppercase leading-none mb-1">{gameMode === GAME_MODES.VS_AI ? 'AI Score' : 'P2 Score'}</p>
                        <p className="text-2xl font-black leading-none">{scores.P2}</p>
                    </div>
                    <div className="bg-purple-500 p-2 rounded-lg shadow-lg shadow-purple-500/40">
                        {gameMode === GAME_MODES.VS_AI ? <Bot size={20} /> : <Users size={20} />}
                    </div>
                </div>
            </div>

            <div className={`grid gap-2 sm:gap-4 w-full mx-auto ${gridConfig.cols} ${cardCount === 64 ? 'max-w-4xl' : 'max-w-2xl'}`}>
                {cards.map(card => (
                    <Card
                        key={card.id}
                        card={card}
                        flippedIds={flippedIds}
                        matchedIds={matchedIds}
                        turn={turn}
                        gameMode={gameMode}
                        isProcessing={isProcessing}
                        onCardClick={onCardClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default GameBoard;
