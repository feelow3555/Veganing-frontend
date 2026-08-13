import { useState } from 'react';
import EnvImpactPopup from './EnvimpactPopup';
import { calculateCarbonFootprint, recommendMealRecipe, extractIngredients, calculateSingleMealCarbonFootprint } from '../../../../api/openai';
import { addPoints, getToken } from '../../../../api/backend';

function UploadButton({ mealsCount, onSaveComplete }) {
    const [showPopup, setShowPopup] = useState(false);
    const [impactData, setImpactData] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleClick = async () => {
        const confirmed = confirm("정말 저장하시겠습니까?\n\n저장 후에는 되돌릴 수 없습니다.");
        
        if (!confirmed) return;

        const meals = window.getAllMeals?.() || [];
        
        if (meals.length === 0) {
            alert("저장할 식단이 없습니다.");
            return;
        }

        setIsCalculating(true);
        
        try {
            // 1단계: 전체 식단 분석 결과 합치기
            const combinedAnalysis = meals
                .filter(meal => meal.analysis)
                .map(meal => meal.analysis)
                .join('\n\n---\n\n');
            
            let dailyRecommendedRecipe = null;
            
            // 2단계: 전체 식단 기반 추천 레시피 생성
            if (combinedAnalysis) {
                try {
                    dailyRecommendedRecipe = await recommendMealRecipe(combinedAnalysis);
                } catch (error) {
                    console.error('추천 레시피 생성 실패:', error);
                }
            }
            
            // 3단계: localStorage에 저장
            try {
                const STORAGE_KEY = 'challenge_meal_index_state';
                localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
                
                if (dailyRecommendedRecipe) {
                    const DAILY_RECIPE_KEY = 'challenge_daily_recommended_recipe';
                    localStorage.setItem(DAILY_RECIPE_KEY, dailyRecommendedRecipe);
                }
            } catch (error) {
                console.error('localStorage 저장 실패:', error);
            }
            
            // 4단계: 탄소발자국 계산
            let calculatedData;
            
            try {
                let allIngredients = [];
                
                // 추천 레시피에서 식재료 추출
                if (dailyRecommendedRecipe) {
                    try {
                        const extractedIngredients = await extractIngredients(dailyRecommendedRecipe);
                        if (extractedIngredients && extractedIngredients.length > 0) {
                            allIngredients = extractedIngredients;
                        }
                    } catch (error) {
                        console.error('식재료 추출 실패:', error);
                    }
                }
                
                // 식재료 정보가 있으면 더 정확한 계산
                if (combinedAnalysis && allIngredients.length > 0) {
                    const detailedCarbon = await calculateSingleMealCarbonFootprint(combinedAnalysis, allIngredients);
                    
                    // 비건 비율 계산
                    const veganMeals = meals.filter(meal => {
                        const analysis = meal.analysis || '';
                        return analysis.includes('완전 비건') || analysis.includes('비건 ⭐⭐⭐');
                    }).length;
                    const veganRate = meals.length > 0 ? Math.round((veganMeals / meals.length) * 100) : 0;
                    
                    calculatedData = {
                        co2Saved: parseFloat(detailedCarbon.co2Saved || 0).toFixed(1),
                        veganRate: veganRate,
                        mealCount: meals.length,
                        totalCO2Emission: parseFloat(detailedCarbon.totalCO2Emission || 0).toFixed(2),
                        ingredientBreakdown: detailedCarbon.ingredientBreakdown || []
                    };
                } else {
                    // 기본 계산 방식
                    calculatedData = await calculateCarbonFootprint(meals);
                }
            } catch (error) {
                console.error('탄소발자국 계산 실패:', error);
                calculatedData = await calculateCarbonFootprint(meals);
            }
            
            // 5단계: 포인트 추가
            try {
                const token = getToken();
                if (token) {
                    const pointsResult = await addPoints(200, token);
                    
                    if (pointsResult.user.leveledUp && pointsResult.user.levelUps > 0) {
                        // 레벨업!
                        const levelUpMessage = pointsResult.user.levelUps > 1 
                            ? `🎉 레벨업 ${pointsResult.user.levelUps}회!\n\nLevel ${pointsResult.user.level - pointsResult.user.levelUps} → Level ${pointsResult.user.level} 달성!`
                            : `🎉 레벨업! Level ${pointsResult.user.level} 달성!`;
                        alert(`${levelUpMessage}\n\n+200 포인트 추가!\n현재 포인트: ${pointsResult.user.points} / 600`);
                        
                        setTimeout(() => {
                            window.location.reload();
                        }, 1000);
                    } else {
                        alert(`+200 포인트 추가!\n\n현재 포인트: ${pointsResult.user.points} / 600\n레벨: ${pointsResult.user.level}`);
                        window.dispatchEvent(new CustomEvent('pointsUpdated'));
                    }
                }
            } catch (pointsError) {
                console.error('포인트 추가 실패:', pointsError);
            }
            
            // 6단계: 결과 팝업 표시
            setImpactData(calculatedData);
            setShowPopup(true);
            onSaveComplete();
        } catch (error) {
            console.error('계산 중 오류:', error);
            alert("계산 중 오류가 발생했습니다.");
        } finally {
            setIsCalculating(false);
        }
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const isDisabled = mealsCount === 0 || isCalculating;

    return (
        <>
            <div className="w-full">
                <button 
                    onClick={handleClick}
                    disabled={isDisabled}
                    className={`w-full h-14 rounded-[48px] shadow-2xl text-lg font-semibold font-['Nunito'] transition-colors flex items-center justify-center gap-2 ${
                        isDisabled
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600'
                    }`}
                >
                    {isCalculating ? '계산 중...' : '오늘의 식단 전체 저장하기'}
                </button>
            </div>

            <EnvImpactPopup 
                isOpen={showPopup}
                onClose={handleClosePopup}
                data={impactData}
            />
        </>
    );
}

export default UploadButton;