function LLMAnalysis({ output, isAnalyzing, currentImage, currentDescription, onUploadComplete }) {

    const handleUpload = () => {
        if (!output) {
            alert("분석 결과가 없습니다. 먼저 식단을 분석해주세요.");
            return;
        }
        
        if (!currentImage) {
            alert("이미지가 없습니다. 식단 사진을 업로드해주세요.");
            return;
        }

        if (typeof window.addMealToIndex !== 'function') {
            alert("식단 저장 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.");
            return;
        }

        try {
            // 개별 업로드 시에는 추천 레시피 저장하지 않음 (전체 저장 시에만 생성됨)
            const mealData = {
                image: currentImage,
                description: currentDescription || '',
                analysis: output,
                recommendedRecipe: null,
                ingredients: null,
                carbonFootprint: null
            };
            
            window.addMealToIndex(mealData);
            alert("식단이 저장되었습니다!");
            onUploadComplete();
        } catch (error) {
            console.error("식단 저장 중 오류:", error);
            alert("식단 저장 중 오류가 발생했습니다: " + error.message);
        }
    };

    // GPT 응답 파싱
    const parseAnalysis = (text) => {
        if (!text) return null;

        // 음식 정보 추출
        const foodMatch = text.match(/음식명:\s*([^\n]+)/);
        const weightMatch = text.match(/예상 중량:\s*([^\n]+)/);
        const ingredientsMatch = text.match(/주요 재료:\s*([^\n]+)/);

        // 영양성분 추출
        const caloriesMatch = text.match(/칼로리:\s*([^\n]+)/);
        const carbsMatch = text.match(/탄수화물:\s*([^\n]+)/);
        const proteinMatch = text.match(/단백질:\s*([^\n]+)/);
        const fatMatch = text.match(/지방:\s*([^\n]+)/);
        const fiberMatch = text.match(/식이섬유:\s*([^\n]+)/);
        const sodiumMatch = text.match(/나트륨:\s*([^\n]+)/);

        // 비건 분석 추출
        const veganMatch = text.match(/비건 친화도:\s*([^\n]+)/);
        const animalMatch = text.match(/확인된 동물성 재료:\s*([^\n]+)/);
        const hiddenMatch = text.match(/⚠️ 숨어있을 가능성:\s*([^\n]+)/);

        // 기타 정보 추출
        const alternativeMatch = text.match(/💡 \*\*비건 대체 제안\*\*\s*\n([^\n⚠️✨]+)/);
        const cautionMatch = text.match(/⚠️ \*\*주의사항\*\*\s*\n([\s\S]*?)(?=✨|$)/);
        const adviceMatch = text.match(/✨ \*\*건강 조언\*\*\s*\n([^\n]+)/);

        return {
            food: {
                name: foodMatch?.[1]?.trim(),
                weight: weightMatch?.[1]?.trim(),
                ingredients: ingredientsMatch?.[1]?.trim()
            },
            nutrition: {
                calories: caloriesMatch?.[1]?.trim(),
                carbs: carbsMatch?.[1]?.trim(),
                protein: proteinMatch?.[1]?.trim(),
                fat: fatMatch?.[1]?.trim(),
                fiber: fiberMatch?.[1]?.trim(),
                sodium: sodiumMatch?.[1]?.trim()
            },
            vegan: {
                level: veganMatch?.[1]?.trim(),
                animal: animalMatch?.[1]?.trim(),
                hidden: hiddenMatch?.[1]?.trim()
            },
            alternative: alternativeMatch?.[1]?.trim(),
            caution: cautionMatch?.[1]?.trim(),
            advice: adviceMatch?.[1]?.trim()
        };
    };

    const analysis = parseAnalysis(output);

    // 영양성분 항목들 (값이 있는 것만 표시)
    const nutritionItems = analysis?.nutrition ? [
        { label: '칼로리', value: analysis.nutrition.calories, colorClass: 'orange' },
        { label: '탄수화물', value: analysis.nutrition.carbs, colorClass: 'yellow' },
        { label: '단백질', value: analysis.nutrition.protein, colorClass: 'red' },
        { label: '지방', value: analysis.nutrition.fat, colorClass: 'purple' },
        { label: '식이섬유', value: analysis.nutrition.fiber, colorClass: 'green' },
        { label: '나트륨', value: analysis.nutrition.sodium, colorClass: 'gray' },
    ].filter(item => item.value) : [];

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col gap-4 h-[666px]" style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold font-['Nunito'] text-gray-900">
                        영양 분석 결과
                    </h3>
                    <span className="px-3 py-1 bg-teal-50 rounded-full text-xs font-medium font-['Nunito'] text-teal-600">
                        AI 분석
                    </span>
                </div>

                {/* 업로드 버튼 */}
                <button
                    onClick={handleUpload}
                    disabled={!output}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium font-['Nunito'] transition-colors ${
                        output
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    업로드
                </button>
            </div>

            {/* 분석 결과 표시 영역 */}
            <div className="flex-1 bg-gray-50 rounded-3xl p-4 overflow-y-auto">
                {isAnalyzing ? (
                    // 분석 중
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-['Nunito'] text-gray-500">
                            AI가 식단을 분석하고 있습니다...
                        </p>
                    </div>
                ) : analysis ? (
                    // 분석 완료
                    <div className="space-y-3">
                        {/* 음식 정보 */}
                        {analysis.food.name && (
                            <div className="bg-white rounded-2xl p-4 border border-blue-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <h4 className="font-semibold text-gray-900">음식 정보</h4>
                                </div>
                                <div className="space-y-1 text-sm">
                                    <p className="text-gray-700"><span className="font-medium">음식명:</span> {analysis.food.name}</p>
                                    {analysis.food.weight && <p className="text-gray-600">{analysis.food.weight}</p>}
                                    {analysis.food.ingredients && <p className="text-gray-600">주요 재료: {analysis.food.ingredients}</p>}
                                </div>
                            </div>
                        )}

                        {/* 영양성분 */}
                        {nutritionItems.length > 0 && (
                            <div className="bg-white rounded-2xl p-4 border border-emerald-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">📊</span>
                                    <h4 className="font-semibold text-gray-900">영양성분</h4>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    {nutritionItems.map((item) => (
                                        <div key={item.label} className={`flex justify-between p-2 bg-${item.colorClass}-50 rounded-lg`}>
                                            <span className="text-gray-700">{item.label}</span>
                                            <span className={`font-semibold text-${item.colorClass}-700`}>{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 비건 분석 */}
                        {analysis.vegan.level && (
                            <div className="bg-white rounded-2xl p-4 border border-teal-100">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xl">🌱</span>
                                    <h4 className="font-semibold text-gray-900">비건 분석</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="p-2 bg-teal-50 rounded-lg">
                                        <span className="font-medium text-teal-700">{analysis.vegan.level}</span>
                                    </div>
                                    {analysis.vegan.animal && (
                                        <p className="text-gray-700"><span className="font-medium">동물성 재료:</span> {analysis.vegan.animal}</p>
                                    )}
                                    {analysis.vegan.hidden && (
                                        <p className="text-amber-700 text-xs">⚠️ {analysis.vegan.hidden}</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* 비건 대체 제안 */}
                        {analysis.alternative && (
                            <div className="bg-white rounded-2xl p-4 border border-indigo-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">💡</span>
                                    <h4 className="font-semibold text-gray-900">비건 대체 제안</h4>
                                </div>
                                <p className="text-sm text-gray-700">{analysis.alternative}</p>
                            </div>
                        )}

                        {/* 주의사항 */}
                        {analysis.caution && (
                            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-xl">⚠️</span>
                                    <h4 className="font-semibold text-amber-900">주의사항</h4>
                                </div>
                                <div className="text-sm text-amber-800 whitespace-pre-line">
                                    {analysis.caution}
                                </div>
                            </div>
                        )}

                        {/* 건강 조언 */}
                        {analysis.advice && (
                            <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-2xl p-4 border border-cyan-100">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">✨</span>
                                    <p className="text-sm text-gray-700 font-medium">{analysis.advice}</p>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    // 분석 전
                    <p className="text-sm font-['Nunito'] text-gray-500 text-center">
                        식단 사진을 업로드하고 영양 분석하기 버튼을 눌러주세요.
                    </p>
                )}
            </div>
        </div>
    );
}

export default LLMAnalysis;