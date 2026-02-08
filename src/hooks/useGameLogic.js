import { useState, useEffect, useCallback, useMemo } from 'react';
import { EMOJIS, GAME_MODES, DIFFICULTIES, GAME_STATUS } from '../constants';

export const useGameLogic = () => {
    const [status, setStatus] = useState(GAME_STATUS.MENU);
    const [gameMode, setGameMode] = useState(GAME_MODES.VS_AI);
    const [difficulty, setDifficulty] = useState(DIFFICULTIES.MEDIUM);
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
        setStatus(GAME_STATUS.PLAYING);
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
                    setTimeout(() => setStatus(GAME_STATUS.GAME_OVER), 800);
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
        if (isProcessing || flippedIds.includes(id) || matchedIds.includes(id) || (turn === 'P2' && gameMode === GAME_MODES.VS_AI)) return;

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
        if (gameMode === GAME_MODES.VS_AI && turn === 'P2' && status === GAME_STATUS.PLAYING && !isProcessing) {
            const runAiTurn = async () => {
                setIsProcessing(true);
                await new Promise(r => setTimeout(r, 800));

                const available = cards.filter(c => !matchedIds.includes(c.id));
                let firstPickId, secondPickId;

                const memoryEntries = Object.entries(aiMemory).filter(([id]) => !matchedIds.includes(id));
                const canUseMemory = difficulty === DIFFICULTIES.HARD || (difficulty === DIFFICULTIES.MEDIUM && Math.random() > 0.45);

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

    return {
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
    };
};
