import { useState, memo } from 'react';
import useMealUpload from "../../../../hooks/useMealUpload";

import MealUploadCard from "./MealUploadCard";
import LLMAnalysis from "./LLMAnalysis";
import MealIndex from "./MealIndex";
import UploadButton from './UploadButton';

const MealContainer = memo(function MealContainer() {
    const [mealsCount, setMealsCount] = useState(0);
    const [isSaved, setIsSaved] = useState(false); // 전체 저장 완료 여부
    
    const {
        analysisResult,
        isAnalyzing,
        currentImage,
        currentDescription,
        resetTrigger,
        setAnalysisResult,
        setIsAnalyzing,
        setCurrentImage,
        setCurrentDescription,
        resetUpload
    } = useMealUpload();

    // 전체 저장 완료시 호출
    const handleSaveComplete = () => {
        resetUpload();
        setIsSaved(true);
    };

    return (
        <div className='w-full flex flex-col gap-8' style={{ width: '100%', minWidth: 0 }}>
            {/* 상단: 업로드 + 분석 결과 */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-2" style={{ width: '100%' }}>
                {/* 왼쪽: 업로드 카드 */}
                <div className="w-full min-w-0 md:col-span-1" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                    <MealUploadCard
                        onAnalysisComplete={setAnalysisResult}
                        setIsAnalyzing={setIsAnalyzing}
                        setCurrentImage={setCurrentImage}
                        setCurrentDescription={setCurrentDescription}
                        resetTrigger={resetTrigger}
                    />
                </div>
                {/* 오른쪽: 분석 결과 */}
                <div className="w-full min-w-0 md:col-span-2" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                    <LLMAnalysis
                        output={analysisResult}
                        isAnalyzing={isAnalyzing}
                        currentImage={currentImage}
                        currentDescription={currentDescription}
                        onUploadComplete={resetUpload}
                    />
                </div>
            </div>

            {/* 중간: 오늘의 식단 목록 (전체 저장 전까지만 표시) */}
            {!isSaved && <MealIndex onMealsCountChange={setMealsCount} />}
            
            {/* 하단: 전체 저장 버튼 */}
            <UploadButton mealsCount={mealsCount} onSaveComplete={handleSaveComplete} />
        </div>
    );
});

export default MealContainer;