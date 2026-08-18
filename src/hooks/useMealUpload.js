import { useState } from 'react';

/**
 * 업로드된 식단 카드 상태를 관리하는 hook.
 * card: { id(mealId), imageUrl, previewUrl, foodName, description, status, result, error }
 */
function useMealUpload() {
    const [cards, setCards] = useState([]);
    const [resetTrigger, setResetTrigger] = useState(0);

    const addCard = (card) => {
        setCards((prev) => [...prev, card]);
    };

    const updateCard = (id, patch) => {
        setCards((prev) => prev.map((card) => (card.id === id ? { ...card, ...patch } : card)));
    };

    const resetUpload = () => {
        setCards([]);
        setResetTrigger((prev) => prev + 1);
    };

    return {
        cards,
        addCard,
        updateCard,
        resetTrigger,
        resetUpload
    };
}

export default useMealUpload;
