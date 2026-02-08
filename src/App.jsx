import React from 'react';
import { useGameLogic } from './hooks/useGameLogic';
import { GAME_STATUS } from './constants';
import Menu from './components/Menu';
import GameBoard from './components/GameBoard';
import GameOverModal from './components/GameOverModal';

const App = () => {
  const {
    status,
    setStatus,
    gameMode,
    setGameMode,
    difficulty,
    setDifficulty,
    cardCount,
    setCardCount,
    cards,
    flippedIds,
    matchedIds,
    scores,
    turn,
    isProcessing,
    gridConfig,
    initGame,
    handleCardClick
  } = useGameLogic();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans flex flex-col items-center overflow-x-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#1e293b_0%,_#020617_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <main className="relative z-10 w-full max-w-5xl flex flex-col items-center px-4">
        {status === GAME_STATUS.MENU && (
          <Menu
            gameMode={gameMode}
            setGameMode={setGameMode}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            cardCount={cardCount}
            setCardCount={setCardCount}
            onInitGame={initGame}
          />
        )}

        {status === GAME_STATUS.PLAYING && (
          <GameBoard
            scores={scores}
            turn={turn}
            gameMode={gameMode}
            difficulty={difficulty}
            initGame={initGame}
            setStatus={setStatus}
            cards={cards}
            gridConfig={gridConfig}
            cardCount={cardCount}
            flippedIds={flippedIds}
            matchedIds={matchedIds}
            isProcessing={isProcessing}
            onCardClick={handleCardClick}
          />
        )}

        {status === GAME_STATUS.GAME_OVER && (
          <GameOverModal
            scores={scores}
            gameMode={gameMode}
            initGame={initGame}
            setStatus={setStatus}
          />
        )}
      </main>
    </div>
  );
};

export default App;