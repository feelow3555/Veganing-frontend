import { useState, memo } from 'react';
import useMealUpload from "../../../../hooks/useMealUpload";

import MealUploadCard from "./MealUploadCard";
import MealIndex from "./MealIndex";
import UploadButton from './UploadButton';

const MealContainer = memo(function MealContainer() {
    const [mealsCount, setMealsCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false); // 전체 저장 완료 여부

    const {
        cards,
        addCard,
        updateCard,
        resetTrigger,
        resetUpload
    } = useMealUpload();

    // 전체 저장 완료시 호출
    const handleSaveComplete = () => {
        resetUpload();
        setIsSaved(true);
    };

    return (
        <div className='w-full flex flex-col gap-8' style={{ width: '100%', minWidth: 0 }}>
            {/* 업로드 카드 */}
            <MealUploadCard
                onMealCreated={addCard}
                resetTrigger={resetTrigger}
            />

            {/* 오늘의 식단 기록 (전체 저장 전까지만 표시) */}
            {!isSaved && (
                <MealIndex
                    cards={cards}
                    updateCard={updateCard}
                    onMealsCountChange={setMealsCount}
                />
            )}

            {/* 하단: 전체 저장 버튼 */}
            <UploadButton mealsCount={mealsCount} onSaveComplete={handleSaveComplete} />
        </div>
    );
});

export default MealContainer;
