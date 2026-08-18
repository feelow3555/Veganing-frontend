import { useEffect, useState } from 'react';
import { getMeal, analyzeMeal, getToken } from '../../../../api/backend';
import useMealIndex from '../../../../hooks/useMealIndex';

function MealIndex({ cards, updateCard, onMealsCountChange }) {
    // window.addMealToIndex / window.getAllMeals 등록을 위해 유지 (UploadButton, ShoppingTab에서 사용)
    useMealIndex();

    const [expandedId, setExpandedId] = useState(null);
    const [retryingId, setRetryingId] = useState(null);
    const [brokenImageIds, setBrokenImageIds] = useState(() => new Set());

    const markImageBroken = (id) => {
        setBrokenImageIds((prev) => {
            if (prev.has(id)) return prev;
            const next = new Set(prev);
            next.add(id);
            return next;
        });
    };

    // 식단 개수가 변경되면 부모 컴포넌트에 알림
    useEffect(() => {
        onMealsCountChange?.(cards.length);
    }, [cards.length, onMealsCountChange]);

    // ANALYZING 상태인 카드들 3초 간격 폴링
    useEffect(() => {
        const analyzingCards = cards.filter((c) => c.status === 'ANALYZING');
        if (analyzingCards.length === 0) return;

        const token = getToken();
        if (!token) return;

        const interval = setInterval(async () => {
            for (const card of analyzingCards) {
                try {
                    const res = await getMeal(card.mealId, token);
                    const status = res.data?.status;
                    if (status === 'DONE') {
                        updateCard(card.id, { status: 'DONE', result: res.data, error: null });
                    } else if (status === 'FAILED') {
                        updateCard(card.id, { status: 'FAILED', error: '분석 실패' });
                    }
                } catch (err) {
                    console.error('분석 상태 조회 실패:', err);
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [cards, updateCard]);

    const handleRetry = async (card) => {
        const token = getToken();
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        setRetryingId(card.id);
        try {
            const mealRes = await analyzeMeal({
                imageUrl: card.imageUrl,
                foodName: card.foodName || null
            }, token);
            const newMealId = mealRes.data?.mealId;
            if (!newMealId) throw new Error('meal ID를 받지 못했습니다.');

            updateCard(card.id, { mealId: newMealId, status: 'ANALYZING', result: null, error: null });
        } catch (err) {
            console.error('재분석 실패:', err);
            alert(`재분석 실패: ${err.message}`);
        } finally {
            setRetryingId(null);
        }
    };

    const toggleExpand = (card) => {
        if (card.status !== 'DONE') return;
        setExpandedId((prev) => (prev === card.id ? null : card.id));
    };

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold font-['Nunito'] text-gray-900">
                    오늘의 식단 기록
                </h3>
                <span className="text-sm font-['Nunito'] text-gray-500">
                    {cards.length}개 등록됨
                </span>
            </div>

            {cards.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {cards.map((card) => (
                        <div key={card.id} className="flex-shrink-0 w-40">
                            <button
                                type="button"
                                onClick={() => toggleExpand(card)}
                                className="relative w-40 h-40 bg-gray-100 rounded-xl overflow-hidden block"
                            >
                                {card.imageUrl && !brokenImageIds.has(card.id) ? (
                                    <img
                                        src={card.imageUrl}
                                        alt={card.foodName || '식단'}
                                        className="w-full h-full object-cover"
                                        onError={() => markImageBroken(card.id)}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                                        🍽️
                                    </div>
                                )}

                                {card.status === 'ANALYZING' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85">
                                        <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                                        <p className="text-[11px] text-gray-600 font-['Nunito']">분석 중...</p>
                                    </div>
                                )}

                                {card.status === 'DONE' && (
                                    <div className="absolute top-1 left-1 px-2 py-0.5 bg-green-500/90 text-white text-[10px] font-medium rounded-full shadow-md">
                                        ✓ 분석 완료
                                    </div>
                                )}

                                {card.status === 'FAILED' && (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-red-50/90">
                                        <span className="text-lg">⚠️</span>
                                        <p className="text-[11px] text-red-600 font-['Nunito']">분석 실패</p>
                                    </div>
                                )}
                            </button>

                            <p className="text-xs text-gray-700 font-['Nunito'] mt-1 truncate">
                                {card.foodName || '이름 없음'}
                            </p>

                            {card.status === 'FAILED' && (
                                <button
                                    onClick={() => handleRetry(card)}
                                    disabled={retryingId === card.id}
                                    className="mt-1 w-full text-xs py-1 rounded-lg bg-red-500 hover:bg-red-600 text-white font-['Nunito'] disabled:opacity-50"
                                >
                                    {retryingId === card.id ? '재분석 요청 중...' : '재분석'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full text-center py-8">
                    <p className="text-sm font-['Nunito'] text-gray-500">
                        아직 등록된 식단이 없습니다.
                    </p>
                </div>
            )}

            {/* 선택된 카드 분석 결과 */}
            {expandedId && (() => {
                const card = cards.find((c) => c.id === expandedId);
                if (!card || card.status !== 'DONE') return null;
                return <MealResultDetail card={card} />;
            })()}
        </div>
    );
}

function MealResultDetail({ card }) {
    const [imageBroken, setImageBroken] = useState(false);
    const output = card.result || {};
    const nutrition = output.nutrition || {};
    const ingredients = output.ingredients || [];
    const isVegan = output.isVeganCompliant;
    const totalCarbon = output.totalCarbon ?? 0;

    const nutritionItems = [
        { label: '칼로리', value: nutrition.calories, unit: 'kcal' },
        { label: '탄수화물', value: nutrition.carbs, unit: 'g' },
        { label: '단백질', value: nutrition.protein, unit: 'g' },
        { label: '지방', value: nutrition.fat, unit: 'g' },
        { label: '식이섬유', value: nutrition.fiber, unit: 'g' },
    ];

    return (
        <div className="mt-4 bg-gray-50 rounded-3xl p-4 space-y-3">
            <div className="flex items-center gap-3">
                {card.imageUrl && !imageBroken ? (
                    <img
                        src={card.imageUrl}
                        alt={card.foodName}
                        className="w-14 h-14 object-cover rounded-xl flex-shrink-0"
                        onError={() => setImageBroken(true)}
                    />
                ) : (
                    <div className="w-14 h-14 flex items-center justify-center text-xl text-gray-300 bg-gray-100 rounded-xl flex-shrink-0">
                        🍽️
                    </div>
                )}
                <div>
                    <h4 className="font-semibold text-gray-900 text-sm">{card.foodName || '이름 없음'}</h4>
                    {card.description && <p className="text-xs text-gray-500">{card.description}</p>}
                </div>
                <span className={`ml-auto px-3 py-1 rounded-full text-xs font-bold ${isVegan ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                    {isVegan ? '비건 식단' : '비건 아님'}
                </span>
            </div>

            {output.aiFeedback && (
                <div className="bg-white rounded-2xl p-3 border border-teal-100">
                    <h5 className="font-semibold text-gray-900 text-sm mb-1">✨ AI 피드백</h5>
                    <p className="text-sm text-gray-700 leading-relaxed">{output.aiFeedback}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl p-3 border border-emerald-100">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🌍</span>
                    <h5 className="font-semibold text-gray-900 text-sm">탄소 발자국</h5>
                    <span className="ml-auto text-emerald-600 font-bold text-sm">{totalCarbon.toFixed(2)} kg CO₂</span>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-3 border border-emerald-100">
                <h5 className="font-semibold text-gray-900 text-sm mb-2">📊 영양성분</h5>
                <div className="grid grid-cols-2 gap-2 text-sm">
                    {nutritionItems.map((n) => (
                        <div key={n.label} className="flex justify-between p-2 bg-gray-50 rounded-lg">
                            <span className="text-gray-600">{n.label}</span>
                            <span className="font-semibold text-gray-800">{n.value ?? 0} {n.unit}</span>
                        </div>
                    ))}
                </div>
            </div>

            {ingredients.length > 0 && (
                <div className="bg-white rounded-2xl p-3 border border-blue-100">
                    <h5 className="font-semibold text-gray-900 text-sm mb-2">🥗 식재료 목록</h5>
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

export default MealIndex;
