import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Bot, Users, Zap, Play, 
  Trophy, RotateCcw, Home
} from 'lucide-react';



const EMOJIS = [
  '🚀', '🎨', '🧩', '🎮', '🌈', '🍦', '🍕', '🎸', '🎷', '🎹', '🦄', '👻', '💎', '🔥',
  '🦁', '🐯', '🐼', '🦊', '🐨', '🐙', '🦖', '🍄', '🌍', '🪐', '⭐', '🍀', '🍎', '🍔',
  '🚲', '🚁', '🚢', '⌚', '☀', '☁', '❄', '🌕', '🥑', '🌮', '🎈', '🎁', '💡', '🔑'
];

const App = () => {
  const [status, setStatus] = useState('MENU');
  const [gameMode, setGameMode] = useState('VS_AI');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [cardCount, setCardCount] = useState(16);

  const [cards, setCards] = useState([]);
  const [flippedIds, setFlippedIds] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [scores, setScores] = useState({ P1: 0, P2: 0 });
  const [turn, setTurn] = useState('P1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMemory, setAiMemory] = useState({});

  const gridConfig = useMemo(() => {
    if (cardCount === 16) return { cols: 'grid-cols-4' };
    if (cardCount === 36) return { cols: 'grid-cols-6' };
    if (cardCount === 64) return { cols: 'grid-cols-8' };
    return { cols: 'grid-cols-4' };
  }, [cardCount]);

  const initGame = useCallback(() => {
    const pairCount = cardCount / 2;
    const shuffledEmojis = [...EMOJIS].sort(() => Math.random() - 0.5);
    const selectedEmojis = shuffledEmojis.slice(0, pairCount);
    const deck = [...selectedEmojis, ...selectedEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: `card-${index}-${Math.random()}`,
        content: emoji,
      }));

    setCards(deck);
    setFlippedIds([]);
    setMatchedIds([]);
    setScores({ P1: 0, P2: 0 });
    setTurn('P1');
    setIsProcessing(false);
    setAiMemory({});
    setStatus('PLAYING');
  }, [cardCount]);

  const evaluateMove = useCallback((id1, id2) => {
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);

    if (card1 && card2 && card1.content === card2.content) {
      setMatchedIds(prev => [...prev, id1, id2]);
      setScores(prev => ({ ...prev, [turn]: prev[turn] + 1 }));
      setFlippedIds([]);
      setIsProcessing(false);
      
      setMatchedIds(current => {
        if (current.length === cards.length) {
          setTimeout(() => setStatus('GAME_OVER'), 800);
        }
        return current;
      });
    } else {
      setTimeout(() => {
        setFlippedIds([]);
        setTurn(prev => (prev === 'P1' ? 'P2' : 'P1'));
        setIsProcessing(false);
      }, 1000);
    }
  }, [cards, turn]);

  const handleCardClick = (id) => {
    if (isProcessing || flippedIds.includes(id) || matchedIds.includes(id) || (turn === 'P2' && gameMode === 'VS_AI')) return;

    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);
    
    const card = cards.find(c => c.id === id);
    setAiMemory(prev => ({ ...prev, [id]: card.content }));

    if (newFlipped.length === 2) {
      setIsProcessing(true);
      evaluateMove(newFlipped[0], newFlipped[1]);
    }
  };

  useEffect(() => {
    if (gameMode === 'VS_AI' && turn === 'P2' && status === 'PLAYING' && !isProcessing) {
      const runAiTurn = async () => {
        setIsProcessing(true);
        await new Promise(r => setTimeout(r, 800));

        const available = cards.filter(c => !matchedIds.includes(c.id));
        let firstPickId, secondPickId;

        const memoryEntries = Object.entries(aiMemory).filter(([id]) => !matchedIds.includes(id));
        const canUseMemory = difficulty === 'HARD' || (difficulty === 'MEDIUM' && Math.random() > 0.45);
        
        if (canUseMemory) {
          for (let i = 0; i < memoryEntries.length; i++) {
            for (let j = i + 1; j < memoryEntries.length; j++) {
              if (memoryEntries[i][1] === memoryEntries[j][1]) {
                firstPickId = memoryEntries[i][0];
                secondPickId = memoryEntries[j][0];
                break;
              }
            }
            if (firstPickId) break;
          }
        }

        if (!firstPickId) {
          const random1 = available[Math.floor(Math.random() * available.length)];
          firstPickId = random1?.id;
          const matchInMem = memoryEntries.find(([id, content]) => content === random1?.content && id !== firstPickId);
          if (matchInMem && canUseMemory) secondPickId = matchInMem[0];
          else {
            const remaining = available.filter(c => c.id !== firstPickId);
            secondPickId = remaining[Math.floor(Math.random() * remaining.length)]?.id;
          }
        }

        if (!firstPickId || !secondPickId) {
            setIsProcessing(false);
            return;
        }

        setFlippedIds([firstPickId]);
        setAiMemory(prev => ({ ...prev, [firstPickId]: cards.find(c => c.id === firstPickId).content }));
        await new Promise(r => setTimeout(r, 700));
        setFlippedIds([firstPickId, secondPickId]);
        setAiMemory(prev => ({ ...prev, [secondPickId]: cards.find(c => c.id === secondPickId).content }));
        await new Promise(r => setTimeout(r, 700));
        evaluateMove(firstPickId, secondPickId);
      };
      runAiTurn();
    }
  }, [turn, gameMode, status, isProcessing, cards, matchedIds, aiMemory, difficulty, evaluateMove]);

  const Card = ({ card }) => {
    const isCurrentlyFlipped = flippedIds.includes(card.id);
    const isMatched = matchedIds.includes(card.id);
    const isFaceUp = isCurrentlyFlipped || isMatched;
    const canInteract = !isProcessing && !isFaceUp && !(turn === 'P2' && gameMode === 'VS_AI');

    return (
      <motion.div 
        className="relative aspect-square cursor-pointer group"
        onClick={() => handleCardClick(card.id)}
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

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col items-center overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center px-4">
        {status === 'MENU' && (
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
                  <button onClick={() => setGameMode('VS_AI')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${gameMode === 'VS_AI' ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)]' : 'border-slate-800 bg-slate-800/40 opacity-50'}`}>
                    <Bot size={32} className={gameMode === 'VS_AI' ? 'text-blue-400' : 'text-slate-400'} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">VS System</span>
                  </button>
                  <button onClick={() => setGameMode('LOCAL_PVP')} className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${gameMode === 'LOCAL_PVP' ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-slate-800 bg-slate-800/40 opacity-50'}`}>
                    <Users size={32} className={gameMode === 'LOCAL_PVP' ? 'text-purple-400' : 'text-slate-400'} />
                    <span className="font-bold text-[10px] uppercase tracking-wider">PVP Mode</span>
                  </button>
                </div>
                {gameMode === 'VS_AI' && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-500 tracking-widest text-center uppercase">Difficulty Protocol</p>
                    <div className="flex gap-2">
                      {['EASY', 'MEDIUM', 'HARD'].map(level => (
                        <button key={level} onClick={() => setDifficulty(level)} className={`flex-1 py-2 text-[10px] font-black rounded-lg border transition-all ${difficulty === level ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 'border-slate-800 text-slate-500'}`}>{level}</button>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-slate-500 tracking-widest text-center uppercase">Grid Dimension</p>
                  <div className="flex gap-2">
                    {[16, 36, 64].map(size => (
                      <button key={size} onClick={() => setCardCount(size)} className={`flex-1 py-3 font-black rounded-xl border-2 transition-all text-sm ${cardCount === size ? 'border-pink-500 text-pink-400 bg-pink-500/5 shadow-[0_0_10px_rgba(236,72,153,0.2)]' : 'border-slate-800 text-slate-500'}`}>{Math.sqrt(size)}x{Math.sqrt(size)}</button>
                    ))}
                  </div>
                </div>
                <button onClick={initGame} className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg tracking-widest shadow-xl transition-all flex items-center justify-center gap-3 uppercase active:scale-95">
                  <Play fill="white" size={20} /> Initialize
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {status === 'PLAYING' && (
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
                  <button onClick={() => setStatus('MENU')} title="Menu" className="p-2 text-red-500/70 hover:text-red-400 hover:bg-red-500/5 rounded-full transition-all active:scale-90">
                    <Home size={18} />
                  </button>
                </div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                  {gameMode === 'VS_AI' ? difficulty : 'LOCAL PVP'}
                </div>
              </div>

              {/* Score Right */}
              <div className={`flex items-center gap-4 px-4 py-2 rounded-2xl transition-all justify-end ${turn === 'P2' ? 'bg-purple-500/20 ring-2 ring-purple-500' : 'opacity-40'}`}>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-purple-300 uppercase leading-none mb-1">{gameMode === 'VS_AI' ? 'AI Score' : 'P2 Score'}</p>
                  <p className="text-2xl font-black leading-none">{scores.P2}</p>
                </div>
                <div className="bg-purple-500 p-2 rounded-lg shadow-lg shadow-purple-500/40">
                  {gameMode === 'VS_AI' ? <Bot size={20} /> : <Users size={20} />}
                </div>
              </div>
            </div>

            <div className={`grid gap-2 sm:gap-4 w-full mx-auto ${gridConfig.cols} ${cardCount === 64 ? 'max-w-4xl' : 'max-w-2xl'}`}>
               {cards.map(card => <Card key={card.id} card={card} />)}
            </div>
          </div>
        )}

        {status === 'GAME_OVER' && (
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
                  <p className="text-[10px] font-bold text-purple-400 uppercase">{gameMode === 'VS_AI' ? 'AI' : 'P2'}</p>
                  <p className="text-4xl font-black">{scores.P2}</p>
                </div>
              </div>
              <div className="space-y-4">
                <button onClick={initGame} className="w-full py-4 bg-blue-600 rounded-2xl font-black text-white uppercase tracking-widest shadow-lg active:scale-95 transition-transform">Play Again</button>
                <button onClick={() => setStatus('MENU')} className="w-full py-4 bg-slate-800 rounded-2xl font-black text-slate-400 uppercase tracking-widest active:scale-95 transition-transform">Hub Menu</button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;