import React, { useState, useEffect } from 'react';

const STORAGE_KEY = 'challenge_meal_index_state';
const DAILY_RECIPE_KEY = 'challenge_daily_recommended_recipe';

// 더미 레시피 (기본 제공용)
const DUMMY_RECIPE = {
    id: 'dummy-quinoa-stir-fry',
    title: '퀴노아와 채소 볶음',
    description: '퀴노아는 완전 단백질이 포함되어 있어 영양가가 높습니다. 다양한 채소와 함께 볶음 형태로 조리하여 비타민과 미네랄을 손쉽게 섭취할 수 있는 방법입니다.',
    cookingTime: 20,
    difficulty: '보통',
    servings: 1,
    ingredients: [
        '퀴노아 1컵 (조리된 것)',
        '브로콜리 1컵 (잘라서)',
        '당근 1개 (얇게 썬 것)',
        '파프리카 1개 (채썬 것)',
        '올리브 오일 1큰술',
        '간장 1큰술',
        '생강가루 약간'
    ],
    nutrition: {
        calories: 250,
        carbohydrates: 30,
        protein: 15,
        fat: 10,
        fiber: 3,
        sodium: 400
    },
    recommendReason: '퀴노아는 완전 단백질이 포함되어 있어 영양가가 높습니다.',
    instructions: `1. 프라이팬에 올리브 오일을 두르고, 중불에서 당근, 브로콜리, 파프리카를 볶습니다.
2. 채소가 부드러워질 때까지 볶다가, 조리된 퀴노아를 추가합니다.
3. 간장과 생강가루를 넣고 잘 섞은 후 2~3분 더 볶아줍니다`,
    isDummy: true
};

const RecipeTab = () => {
    const [recipes, setRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // localStorage에서 식단 가져오기
    const getMealsFromStorage = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed || [];
            }
        } catch (error) {
            console.error('localStorage에서 식단 가져오기 실패:', error);
        }
        return [];
    };

    // 컴포넌트 마운트 & 페이지 포커스시 레시피 로드
    useEffect(() => {
        loadRecommendedRecipes();
        
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                loadRecommendedRecipes();
            }
        };
        
        const handleFocus = () => {
            loadRecommendedRecipes();
        };
        
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // 추천 레시피 로드
    const loadRecommendedRecipes = async () => {
        setIsLoading(true);
        try {
            let dailyRecommendedRecipe = null;
            
            // 전체 식단 기반 추천 레시피 확인
            try {
                const storedDailyRecipe = localStorage.getItem(DAILY_RECIPE_KEY);
                if (storedDailyRecipe) {
                    dailyRecommendedRecipe = storedDailyRecipe;
                }
            } catch (error) {
                console.error('전체 식단 기반 추천 레시피 로드 실패:', error);
            }
            
            let meals = getMealsFromStorage();
            
            // fallback: window.getAllMeals 시도
            if (meals.length === 0) {
                const windowMeals = window.getAllMeals?.() || [];
                if (windowMeals.length > 0) {
                    meals = windowMeals;
                }
            }
            
            // 더미 레시피를 항상 첫 번째에 추가
            const recommendedRecipes = [DUMMY_RECIPE];
            
            // 전체 식단 기반 추천 레시피가 있으면 추가
            if (dailyRecommendedRecipe) {
                try {
                    const combinedAnalysis = meals
                        .filter(meal => meal.analysis)
                        .map(meal => meal.analysis)
                        .join('\n\n---\n\n');
                    
                    const parsedRecipes = parseMultipleRecipes(dailyRecommendedRecipe, combinedAnalysis);
                    recommendedRecipes.push(...parsedRecipes.slice(0, 2)); // 최대 2개만 추가
                } catch (error) {
                    console.error('전체 식단 기반 추천 레시피 파싱 실패:', error);
                }
            }
            
            setRecipes(recommendedRecipes);
        } catch (error) {
            console.error('레시피 로드 실패:', error);
            setRecipes([]);
        } finally {
            setIsLoading(false);
        }
    };

    // 여러 레시피 파싱 (최대 2개)
    const parseMultipleRecipes = (recipeText, analysisResult) => {
        if (!recipeText) return [];
        
        const recipes = [];
        const recipeSections = recipeText.split(/---레시피 \d+---/).filter(section => section.trim());
        
        for (const section of recipeSections.slice(0, 2)) {
            const parsed = parseRecommendedRecipe(section.trim(), analysisResult);
            if (parsed) {
                recipes.push(parsed);
            }
        }
        
        // 구분자가 없으면 하나의 레시피로 간주
        if (recipes.length === 0) {
            const singleRecipe = parseRecommendedRecipe(recipeText, analysisResult);
            if (singleRecipe) {
                recipes.push(singleRecipe);
            }
        }
        
        return recipes;
    };

    // 레시피 텍스트 파싱
    const parseRecommendedRecipe = (recipeText, analysisResult) => {
        if (!recipeText) return null;

        // 분석 결과에서 영양 정보 추출
        const parseAnalysis = (text) => {
            const caloriesMatch = text.match(/칼로리:\s*([^\n]+)/);
            const proteinMatch = text.match(/단백질:\s*([^\n]+)/);
            const carbsMatch = text.match(/탄수화물:\s*([^\n]+)/);
            const fatMatch = text.match(/지방:\s*([^\n]+)/);
            
            return {
                calories: caloriesMatch?.[1]?.trim()?.replace(/[^\d.]/g, '') || null,
                protein: proteinMatch?.[1]?.trim()?.replace(/[^\d.]/g, '') || null,
                carbs: carbsMatch?.[1]?.trim()?.replace(/[^\d.]/g, '') || null,
                fat: fatMatch?.[1]?.trim()?.replace(/[^\d.]/g, '') || null
            };
        };

        const analysis = parseAnalysis(analysisResult || '');
        
        // 추천 이유 생성
        const getRecommendReason = (text) => {
            if (!text) return '영양 보완';
            
            const proteinMatch = text.match(/단백질:\s*([^\n]+)/);
            const caloriesMatch = text.match(/칼로리:\s*([^\n]+)/);
            
            if (proteinMatch && parseFloat(proteinMatch[1]) < 20) {
                return '단백질 부족';
            }
            if (caloriesMatch && parseFloat(caloriesMatch[1]) < 300) {
                return '칼로리 부족';
            }
            return '영양 균형';
        };

        const recipeNameMatch = recipeText.match(/🍽️\s*\*\*추천 식단명\*\*\s*\n([^\n]+)/) ||
                                recipeText.match(/추천 식단명:\s*([^\n]+)/) ||
                                recipeText.match(/^([^\n]+)/);
        
        const ingredientsMatch = recipeText.match(/📋\s*\*\*필요한 식재료\*\*\s*\n([\s\S]*?)(?=👨‍🍳|💡|$)/);
        const recipeMatch = recipeText.match(/👨‍🍳\s*\*\*간단한 조리법\*\*\s*\n([\s\S]*?)(?=💡|$)/);
        const reasonMatch = recipeText.match(/💡\s*\*\*추천 이유\*\*\s*\n([\s\S]*?)$/);

        const title = recipeNameMatch?.[1]?.trim() || '추천 레시피';
        const ingredients = ingredientsMatch?.[1]?.trim()?.split('\n').filter(Boolean) || [];
        const instructions = recipeMatch?.[1]?.trim() || '';
        const recommendReason = reasonMatch?.[1]?.trim() || getRecommendReason(analysisResult);

        return {
            id: Date.now() + Math.random(),
            title: title.replace(/^\*\*|\*\*$/g, ''),
            description: recommendReason,
            cookingTime: 20,
            difficulty: "보통",
            servings: 1,
            ingredients: ingredients.length > 0 
                ? ingredients.map(ing => ing.replace(/^[-•]\s*/, '').trim()).filter(Boolean)
                : ['식재료 정보 없음'],
            nutrition: {
                calories: parseInt(analysis.calories) || 300,
                carbohydrates: parseInt(analysis.carbs) || 0,
                protein: parseInt(analysis.protein) || 15,
                fat: parseInt(analysis.fat) || 5,
                fiber: 3,
                sodium: 400
            },
            recommendReason: recommendReason,
            instructions: instructions,
            rawRecipe: recipeText
        };
    };

    // 난이도별 색상
    const difficultyColors = {
        '쉬움': 'text-green-600',
        '보통': 'text-yellow-600',
        '어려움': 'text-red-600'
    };

    // 영양 정보 그리드 아이템
    const nutritionGridItems = (recipe) => [
        { icon: '⏱️', label: '조리시간', value: `${recipe.cookingTime}분` },
        { icon: '🔥', label: '난이도', value: recipe.difficulty, colorClass: difficultyColors[recipe.difficulty] },
        { icon: '📊', label: '칼로리', value: `${recipe.nutrition.calories}kcal` },
        { icon: '💪', label: '단백질', value: `${recipe.nutrition.protein}g` },
    ];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* 헤더 */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">오늘의 추천 레시피</h1>
                    <p className="text-gray-600">오늘의 전체 식단을 종합하여 추천하는 레시피입니다</p>
                    <button
                        onClick={loadRecommendedRecipes}
                        disabled={isLoading}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:bg-gray-400"
                    >
                        {isLoading ? '로딩 중...' : '레시피 새로고침'}
                    </button>
                </div>

                {/* 레시피 목록 */}
                {isLoading ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">AI가 레시피를 추천하고 있습니다...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {recipes.map((recipe) => (
                            <div 
                                key={recipe.id} 
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col"
                                style={{ minHeight: '300px' }}
                            >
                                <div className="p-6 flex flex-col h-full">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                                        {recipe.title}
                                    </h3>
                                    
                                    {recipe.description && (
                                        <p className="text-sm text-gray-600 mb-3 leading-relaxed line-clamp-10 flex-1">
                                            {recipe.description}
                                        </p>
                                    )}
                                    
                                    {/* 정보 그리드 */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {nutritionGridItems(recipe).map((item, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <span className="text-gray-500 text-sm">{item.icon}</span>
                                                <span className={`text-sm ${item.colorClass || 'text-gray-700'}`}>
                                                    {item.value}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <button
                                        className="w-full py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-lg hover:from-cyan-600 hover:to-emerald-600 transition-all text-sm font-medium shadow-md hover:shadow-lg mt-auto"
                                        onClick={() => setSelectedRecipe(recipe)}
                                    >
                                        상세보기
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 상세 정보 모달 */}
                {selectedRecipe && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">{selectedRecipe.title}</h2>
                                    <button
                                        onClick={() => setSelectedRecipe(null)}
                                        className="text-gray-400 hover:text-gray-600 text-2xl"
                                    >
                                        ×
                                    </button>
                                </div>

                                <p className="text-gray-600 mb-6">{selectedRecipe.description}</p>

                                {/* 기본 정보 */}
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { label: '조리시간', value: `${selectedRecipe.cookingTime}분` },
                                        { label: '난이도', value: selectedRecipe.difficulty },
                                        { label: '인분', value: `${selectedRecipe.servings}인분` }
                                    ].map((item, index) => (
                                        <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                                            <div className="text-sm text-gray-500">{item.label}</div>
                                            <div className="text-lg font-semibold text-gray-800">{item.value}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* 영양 정보 */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">영양 정보 (1인분 기준)</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {[
                                            { label: '칼로리', value: `${selectedRecipe.nutrition.calories}kcal`, color: 'blue' },
                                            { label: '탄수화물', value: `${selectedRecipe.nutrition.carbohydrates}g`, color: 'green' },
                                            { label: '단백질', value: `${selectedRecipe.nutrition.protein}g`, color: 'purple' },
                                            { label: '지방', value: `${selectedRecipe.nutrition.fat}g`, color: 'yellow' },
                                            { label: '식이섬유', value: `${selectedRecipe.nutrition.fiber}g`, color: 'orange' },
                                            { label: '나트륨', value: `${selectedRecipe.nutrition.sodium}mg`, color: 'red' },
                                        ].map((item, index) => (
                                            <div key={index} className={`p-3 bg-${item.color}-50 rounded-lg`}>
                                                <div className="text-sm text-gray-600">{item.label}</div>
                                                <div className="text-lg font-semibold text-gray-800">{item.value}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* 재료 */}
                                <div className="mb-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">재료</h3>
                                    <ul className="space-y-2">
                                        {selectedRecipe.ingredients.map((ingredient, index) => (
                                            <li key={index} className="flex items-center text-gray-700">
                                                <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                                                {ingredient}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* 조리법 */}
                                {selectedRecipe.instructions && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3">조리법</h3>
                                        <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-line text-gray-700">
                                            {selectedRecipe.instructions}
                                        </div>
                                    </div>
                                )}

                                <button
                                    onClick={() => setSelectedRecipe(null)}
                                    className="w-full py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeTab;