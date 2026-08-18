function LLMAnalysis({ items, onUploadComplete }) {
    const doneItems = items.filter((item) => item.analysisStatus === 'done');
    const hasAnyAnalysis = items.some((item) => item.analysisStatus !== 'idle');

    const handleUpload = () => {
        if (doneItems.length === 0) {
            alert('분석 완료된 식단이 없습니다.');
            return;
        }
        if (typeof window.addMealToIndex !== 'function') {
            alert('식단 저장 기능을 사용할 수 없습니다. 페이지를 새로고침해주세요.');
            return;
        }
        try {
            doneItems.forEach((item) => {
                window.addMealToIndex({
                    image: item.previewUrl,
                    analysis: item.result?.aiFeedback || '',
                    recommendedRecipe: null,
                    ingredients: null,
                    carbonFootprint: null
                });
            });
            alert(`${doneItems.length}개의 식단이 저장되었습니다!`);
            onUploadComplete();
        } catch (error) {
            console.error('식단 저장 중 오류:', error);
            alert('식단 저장 중 오류가 발생했습니다: ' + error.message);
        }
    };

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col gap-4 h-[666px]" style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <div className="flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold font-['Nunito'] text-gray-900">영양 분석 결과</h3>
                    <span className="px-3 py-1 bg-teal-50 rounded-full text-xs font-medium font-['Nunito'] text-teal-600">AI 분석</span>
                </div>
                <button
                    onClick={handleUpload}
                    disabled={doneItems.length === 0}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium font-['Nunito'] transition-colors ${
                        doneItems.length > 0
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    전체 저장 ({doneItems.length})
                </button>
            </div>

            <div className="flex-1 bg-gray-50 rounded-3xl p-4 overflow-y-auto">
                {!hasAnyAnalysis ? (
                    <p className="text-sm font-['Nunito'] text-gray-500 text-center">
                        식단 사진을 업로드하고 전체 분석 시작 버튼을 눌러주세요.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {items
                            .filter((item) => item.analysisStatus !== 'idle')
                            .map((item) => (
                                <MealAnalysisCard key={item.id} item={item} />
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function MealAnalysisCard({ item }) {
    if (item.analysisStatus === 'analyzing') {
        return (
            <div className="bg-white rounded-2xl p-4 border border-teal-100 flex items-center gap-4">
                <img src={item.previewUrl} alt="분석 중인 식단" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className="flex items-center gap-3">
                    <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-['Nunito'] text-gray-500">AI가 식단을 분석하고 있습니다...</p>
                </div>
            </div>
        );
    }

    if (item.analysisStatus === 'failed') {
        return (
            <div className="bg-red-50 rounded-2xl p-4 border border-red-200 flex items-center gap-4">
                <img src={item.previewUrl} alt="분석 실패한 식단" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <p className="text-sm font-['Nunito'] text-red-600">분석 실패: {item.error}</p>
            </div>
        );
    }

    const output = item.result || {};
    const nutrition = output.nutrition || {};
    const ingredients = output.ingredients || [];
    const confirmedViolations = output.confirmedViolations || [];
    const suspectedViolations = output.suspectedViolations || [];
    const isVegan = output.isVeganCompliant;
    const totalCarbon = output.totalCarbon ?? 0;

    const nutritionItems = [
        { label: '칼로리', value: nutrition.calories, unit: 'kcal' },
        { label: '탄수화물', value: nutrition.carbs, unit: 'g' },
        { label: '단백질', value: nutrition.protein, unit: 'g' },
        { label: '지방', value: nutrition.fat, unit: 'g' },
        { label: '식이섬유', value: nutrition.fiber, unit: 'g' },
        { label: '비타민B12', value: nutrition.vitamin_b12, unit: 'μg' },
        { label: '비타민D', value: nutrition.vitamin_d, unit: 'μg' },
        { label: '오메가3', value: nutrition.omega3, unit: 'g' },
        { label: '칼슘', value: nutrition.calcium, unit: 'mg' },
        { label: '철분', value: nutrition.iron, unit: 'mg' },
    ];

    return (
        <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm space-y-3">
            <div className="flex items-center gap-3">
                <img src={item.previewUrl} alt="분석된 식단" className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                <div className={`flex-1 rounded-2xl p-3 border ${isVegan ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                    <div className="flex items-center gap-2">
                        <span className="text-xl">{isVegan ? '🌱' : '⚠️'}</span>
                        <h4 className="font-semibold text-gray-900 text-sm">비건 여부</h4>
                        <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${isVegan ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                            {isVegan ? '비건 식단' : '비건 아님'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 확실한 위반 항목 */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-red-100">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">✅</span>
                    <h4 className="font-semibold text-gray-900 text-sm">확실한 위반 항목</h4>
                </div>
                {confirmedViolations.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                        {confirmedViolations.map((v, i) => (
                            <span key={i} className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">{v}</span>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-green-700">✅ 비건 기준 충족</p>
                )}
            </div>

            {/* 의심 재료 */}
            {suspectedViolations.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-3 border border-yellow-200">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">⚠️</span>
                        <h4 className="font-semibold text-gray-900 text-sm">의심 재료</h4>
                    </div>
                    <div className="space-y-2">
                        {suspectedViolations.map((v, i) => (
                            <div key={i} className="flex items-center justify-between bg-yellow-50 rounded-lg p-2 text-sm">
                                <div>
                                    <span className="font-medium text-gray-800">{v.ingredient}</span>
                                    <p className="text-xs text-gray-500 mt-0.5">{v.reason}</p>
                                </div>
                                <span className="text-xs font-bold text-yellow-700 bg-yellow-100 rounded-full px-2 py-1 flex-shrink-0 ml-2">
                                    {Math.round((v.confidence ?? 0) * 100)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI 피드백 */}
            {output.aiFeedback && (
                <div className="bg-gray-50 rounded-2xl p-3 border border-teal-100">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl">✨</span>
                        <h4 className="font-semibold text-gray-900 text-sm">AI 피드백</h4>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{output.aiFeedback}</p>
                </div>
            )}

            {/* 탄소 절감량 */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌍</span>
                    <h4 className="font-semibold text-gray-900 text-sm">탄소 발자국</h4>
                    <span className="ml-auto text-emerald-600 font-bold">{totalCarbon.toFixed(2)} kg CO₂</span>
                </div>
            </div>

            {/* 영양성분 */}
            <div className="bg-gray-50 rounded-2xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">📊</span>
                    <h4 className="font-semibold text-gray-900 text-sm">영양성분 (전체 합계)</h4>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {nutritionItems.map((n) => (
                        <div key={n.label} className="flex justify-between p-2 bg-white rounded-lg">
                            <span className="text-gray-600">{n.label}</span>
                            <span className="font-semibold text-gray-800">{n.value ?? 0} {n.unit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* 식재료 목록 */}
            {ingredients.length > 0 && (
                <div className="bg-gray-50 rounded-2xl p-3 border border-blue-100">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xl">🥗</span>
                        <h4 className="font-semibold text-gray-900 text-sm">식재료 목록</h4>
                    </div>
                    <div className="space-y-1">
                        {ingredients.map((ing, i) => (
                            <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                                <span className="text-gray-700">{ing.name}</span>
                                <span className="text-gray-500">{ing.amount_g}g</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LLMAnalysis;
