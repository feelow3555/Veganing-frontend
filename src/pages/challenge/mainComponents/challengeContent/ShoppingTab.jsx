import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMealHistory, getProducts, getToken } from '../../../../api/backend';
import ProductCard from '../../../shopping/components/ProductCard';

const ShoppingTab = () => {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const keyword = (searchParams.get('keyword') || '').trim();

    const [requiredIngredients, setRequiredIngredients] = useState([]);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedIngredient, setSelectedIngredient] = useState(null);

    // 분석 완료된 식단들에서 필요한 식재료 집계
    const loadIngredients = async () => {
        const token = getToken();
        if (!token) return [];

        try {
            const res = await getMealHistory(token);
            const history = res.data || [];
            const doneMeals = history.filter((meal) => meal.status === 'DONE');

            const ingredientMap = new Map();
            for (const meal of doneMeals) {
                const ingredients = meal.ingredients || [];
                for (const ing of ingredients) {
                    const key = (ing.name || '').trim();
                    if (!key) continue;

                    const existing = ingredientMap.get(key);
                    if (existing) {
                        existing.amount += ing.amount_g || 0;
                        if (meal.foodName && !existing.sources.includes(meal.foodName)) {
                            existing.sources.push(meal.foodName);
                        }
                    } else {
                        ingredientMap.set(key, {
                            id: ingredientMap.size + 1,
                            name: key,
                            amount: ing.amount_g || 0,
                            sources: meal.foodName ? [meal.foodName] : [],
                            priority: '보통'
                        });
                    }
                }
            }

            return Array.from(ingredientMap.values())
                .map((ing) => ({
                    ...ing,
                    amount: `${ing.amount}g`,
                    reason: ing.sources.length > 0 ? ing.sources.join(', ') : '분석된 식단'
                }))
                .sort((a, b) => a.id - b.id);
        } catch (error) {
            console.error('식단 히스토리 조회 실패:', error);
            return [];
        }
    };

    // 상품 카탈로그 조회
    const loadProducts = async () => {
        try {
            const res = await getProducts(0, 200);
            const items = res.data?.content || res.data || [];
            return items.map((p) => ({
                ...p,
                image: p.imageUrl || p.image,
                mainCategory: p.category,
            }));
        } catch (error) {
            console.error('상품 목록 조회 실패:', error);
            return [];
        }
    };

    const loadAll = async () => {
        setIsLoading(true);
        try {
            const [ingredients, catalogProducts] = await Promise.all([loadIngredients(), loadProducts()]);
            setRequiredIngredients(ingredients);
            setProducts(catalogProducts);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadAll();

        const handleVisibilityChange = () => {
            if (!document.hidden) loadAll();
        };
        const handleFocus = () => loadAll();

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    // 특정 재료명과 매칭되는 실제 카탈로그 상품 찾기
    const matchProducts = (name) => {
        const q = (name || '').toLowerCase();
        if (!q) return [];
        return products.filter((p) => {
            const pname = (p.name || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            return pname.includes(q) || desc.includes(q) || q.includes(pname);
        }).slice(0, 4);
    };

    // 레시피 탭에서 넘어온 keyword로 관련 상품 직접 필터링
    const keywordProducts = useMemo(() => {
        if (!keyword) return [];
        const keywords = keyword.toLowerCase().split(',').map(k => k.trim()).filter(Boolean);
        return products.filter((p) => {
            const pname = (p.name || '').toLowerCase();
            const desc = (p.description || '').toLowerCase();
            return keywords.some(k => pname.includes(k) || desc.includes(k));
        }).slice(0, 8);
    }, [keyword, products]);

    // keyword와 관련된 식재료만 필터링 (있으면)
    const filteredIngredients = useMemo(() => {
        if (!keyword) return requiredIngredients;
        const q = keyword.toLowerCase();
        const matched = requiredIngredients.filter((ing) => {
            const name = ing.name.toLowerCase();
            return q.includes(name) || name.includes(q);
        });
        return matched.length > 0 ? matched : requiredIngredients;
    }, [keyword, requiredIngredients]);

    // keyword가 바뀌면 매칭되는 재료 자동 선택
    useEffect(() => {
        if (!keyword) return;
        const q = keyword.toLowerCase();
        const matched = requiredIngredients.find((ing) => {
            const name = ing.name.toLowerCase();
            return q.includes(name) || name.includes(q);
        });
        if (matched) setSelectedIngredient(matched);
    }, [keyword, requiredIngredients]);

    const handleClearKeyword = () => {
        setSearchParams({});
    };

    const handleIngredientClick = (ingredient) => {
        setSelectedIngredient(ingredient);
    };

    const handleGoToShopping = (ingredientName) => {
        navigate(`/store?search=${encodeURIComponent(ingredientName)}`);
    };

    const priorityColors = {
        '높음': 'bg-red-100 text-red-700',
        '보통': 'bg-yellow-100 text-yellow-700',
        '낮음': 'bg-green-100 text-green-700'
    };

    const shoppingTips = [
        '유기농이나 친환경 제품을 우선 선택하세요',
        '신선도와 유통기한을 꼭 확인하세요',
        '필요량에 맞는 적정 포장 크기를 선택하세요',
        '비건 인증이 있는 제품을 확인하세요'
    ];

    const selectedProducts = selectedIngredient ? matchProducts(selectedIngredient.name) : [];

    return (
        <div className="w-full flex flex-col gap-6">
            {/* 헤더 */}
            <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6">
                <h1 className="text-lg font-semibold font-['Nunito'] text-gray-900 mb-1">추천 식단 쇼핑 목록</h1>
                <p className="text-sm text-gray-500 font-['Nunito']">분석된 식단을 바탕으로 필요한 식재료와 관련 상품을 찾아보세요</p>
                <button
                    onClick={loadAll}
                    disabled={isLoading}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium font-['Nunito'] disabled:opacity-50"
                >
                    {isLoading ? '로딩 중...' : '새로고침'}
                </button>
            </div>

            {/* 레시피에서 넘어온 keyword 필터 배너 */}
            {keyword && (
                <div className="w-full bg-teal-50 border border-teal-200 rounded-3xl p-4 flex items-center justify-between">
                    <p className="text-sm font-['Nunito'] text-teal-700">
                        🔍 <strong>{keyword}</strong> 관련 재료·상품을 보여드리고 있어요
                    </p>
                    <button
                        onClick={handleClearKeyword}
                        className="text-xs px-3 py-1.5 bg-white rounded-full text-teal-600 font-['Nunito'] shadow-sm hover:shadow transition-shadow"
                    >
                        필터 해제 ✕
                    </button>
                </div>
            )}

            {/* keyword 직접 매칭 상품 */}
            {keyword && keywordProducts.length > 0 && (
                <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6">
                    <h2 className="text-base font-semibold font-['Nunito'] text-gray-800 mb-4">🛒 "{keyword}" 관련 상품</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {keywordProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            )}

            <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* 왼쪽: 필요 식재료 목록 */}
                    <div className="lg:col-span-1">
                        <h2 className="text-base font-semibold font-['Nunito'] text-gray-800 mb-4">필요한 식재료</h2>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-teal-500 border-t-transparent"></div>
                                <p className="mt-4 text-sm text-gray-600 font-['Nunito']">식재료를 불러오는 중...</p>
                            </div>
                        ) : filteredIngredients.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p className="text-sm mb-2 font-['Nunito']">저장된 식단이 없습니다.</p>
                                <p className="text-xs font-['Nunito']">식단을 분석하면 추천 식재료가 표시됩니다.</p>
                            </div>
                        ) : (
                            <div className="space-y-2 max-h-[560px] overflow-y-auto">
                                {filteredIngredients.map((ingredient) => (
                                    <button
                                        key={ingredient.id}
                                        onClick={() => handleIngredientClick(ingredient)}
                                        className={`w-full text-left p-3 rounded-2xl border-2 transition ${
                                            selectedIngredient?.id === ingredient.id
                                                ? 'border-teal-400 bg-teal-50'
                                                : 'border-gray-200 hover:border-teal-200'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-medium text-gray-800 font-['Nunito']">{ingredient.name}</span>
                                            <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[ingredient.priority]}`}>
                                                {ingredient.priority}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 font-['Nunito']">{ingredient.amount}</div>
                                        <div className="text-xs text-gray-500 mt-1 font-['Nunito']">{ingredient.reason}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 오른쪽: 식재료 상세 + 관련 상품 */}
                    <div className="lg:col-span-2">
                        {!selectedIngredient ? (
                            <div className="p-12 text-center text-gray-500 bg-gray-50 rounded-3xl h-full flex flex-col items-center justify-center">
                                <div className="text-4xl mb-4">🥬</div>
                                <p className="text-base font-medium text-gray-700 mb-2 font-['Nunito']">식재료를 선택해주세요</p>
                                <p className="text-sm text-gray-500 font-['Nunito']">왼쪽에서 식재료를 선택하면<br />관련 상품을 확인할 수 있습니다</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="pb-4 border-b border-gray-100">
                                    <h2 className="text-xl font-bold text-gray-900 mb-2 font-['Nunito']">
                                        {selectedIngredient.name}
                                    </h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 font-['Nunito']">
                                        <span>필요량: <strong className="text-gray-800">{selectedIngredient.amount}</strong></span>
                                        <span>·</span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                                            {selectedIngredient.reason}
                                        </span>
                                    </div>
                                </div>

                                {/* 실제 매칭 상품 */}
                                <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-5 border border-teal-100">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-4 font-['Nunito']">🛒 관련 상품</h3>
                                    {selectedProducts.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {selectedProducts.map((product) => (
                                                <ProductCard key={product.id} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4">
                                            <p className="text-sm text-gray-500 font-['Nunito'] mb-3">등록된 상품 중 일치하는 항목이 없어요.</p>
                                            <button
                                                onClick={() => handleGoToShopping(selectedIngredient.name)}
                                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-2xl hover:shadow-lg transition-shadow font-medium text-sm font-['Nunito']"
                                            >
                                                🔍 스토어에서 검색하기
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* 쇼핑 팁 */}
                                <div className="bg-yellow-50 rounded-2xl p-5 border border-yellow-200">
                                    <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2 font-['Nunito']">
                                        <span>💡</span>
                                        쇼핑 팁
                                    </h3>
                                    <ul className="space-y-2 text-sm text-gray-700 font-['Nunito']">
                                        {shoppingTips.map((tip, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-yellow-600 mt-1">•</span>
                                                <span>{tip}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShoppingTab;
