import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommend, getTodayRecipes, getToken } from '../../../../api/backend';

// 굵게(**text**) 인라인 마크다운 파싱
const parseInline = (text, keyPrefix) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((part) => part !== '');
    return parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            return (
                <strong key={`${keyPrefix}-b-${i}`} className="font-semibold text-gray-900">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        return <React.Fragment key={`${keyPrefix}-t-${i}`}>{part}</React.Fragment>;
    });
};

// 최소 마크다운 렌더러: #/## 헤딩, -/* 리스트, **볼드**, 문단
const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const blocks = [];
    let listItems = [];

    const flushList = (key) => {
        if (listItems.length === 0) return;
        blocks.push(
            <ul key={`ul-${key}`} className="list-disc list-inside space-y-1 my-2">
                {listItems.map((item, i) => (
                    <li key={i} className="text-sm text-gray-700 leading-relaxed">
                        {parseInline(item, `li-${key}-${i}`)}
                    </li>
                ))}
            </ul>
        );
        listItems = [];
    };

    lines.forEach((rawLine, idx) => {
        const line = rawLine.trim();

        if (line === '') {
            flushList(idx);
            return;
        }
        if (line.startsWith('## ')) {
            flushList(idx);
            blocks.push(
                <h3 key={idx} className="text-base font-bold text-gray-900 mt-4 mb-2 first:mt-0">
                    {parseInline(line.slice(3), `h3-${idx}`)}
                </h3>
            );
        } else if (line.startsWith('# ')) {
            flushList(idx);
            blocks.push(
                <h2 key={idx} className="text-lg font-bold text-gray-900 mt-4 mb-2 first:mt-0">
                    {parseInline(line.slice(2), `h2-${idx}`)}
                </h2>
            );
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            listItems.push(line.slice(2));
        } else {
            flushList(idx);
            blocks.push(
                <p key={idx} className="text-sm text-gray-700 leading-relaxed mb-2 last:mb-0">
                    {parseInline(line, `p-${idx}`)}
                </p>
            );
        }
    });
    flushList('end');

    return blocks;
};

const RECIPE_ICONS = ['🥗', '🍲', '🥘', '🍱', '🌮', '🍜', '🥙', '🍛'];

// 레시피 제목(정규화) → imageUrl 매핑 생성
const buildRecipeImageMap = (recipes) => {
    const map = {};
    for (const recipe of recipes) {
        const key = (recipe.title || '').trim().toLowerCase();
        if (key && recipe.imageUrl) map[key] = recipe.imageUrl;
    }
    return map;
};

const RecipeTab = () => {
    const navigate = useNavigate();
    const [recommend, setRecommend] = useState(null);
    const [recipeImageMap, setRecipeImageMap] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadRecommend();
    }, []);

    const loadRecommend = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = getToken();
            const [recommendRes, recipesRes] = await Promise.all([
                getRecommend(token),
                getTodayRecipes(token).catch((err) => {
                    console.error('오늘의 레시피 목록 조회 실패:', err);
                    return { data: [] };
                })
            ]);
            setRecommend(recommendRes.data);

            const recipeList = recipesRes.data?.content || recipesRes.data || [];
            setRecipeImageMap(buildRecipeImageMap(recipeList));
        } catch (err) {
            setError(err.message || '추천 레시피를 불러오지 못했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const getRecipeImage = (title) => {
        const t = typeof title === 'object' ? title?.title : title;
        return recipeImageMap[(t || '').trim().toLowerCase()];
    };

    // 레시피 클릭 → 쇼핑 탭으로 이동하며 관련 상품을 검색어로 필터링
    const handleRecipeClick = (recipe) => {
        const ingredients = recipe?.ingredients?.join(',') || recipe?.title || '';
        navigate(`/challenge/main/shopping?keyword=${encodeURIComponent(ingredients)}`);
    };

    if (isLoading) {
        return (
            <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col items-center justify-center min-h-64">
                <div className="w-12 h-12 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-['Nunito']">AI가 레시피를 추천하고 있습니다...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6">
                <div className="bg-red-50 border border-red-200 rounded-3xl p-6 text-center">
                    <p className="text-red-600 mb-2 font-['Nunito']">{error}</p>
                    <p className="text-gray-500 text-sm mb-4 font-['Nunito']">식단을 먼저 업로드해야 추천을 받을 수 있어요.</p>
                    <button
                        onClick={loadRecommend}
                        className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow text-sm font-medium font-['Nunito']"
                    >
                        다시 시도
                    </button>
                </div>
            </div>
        );
    }

    if (!recommend) return null;

    return (
        <div className="w-full flex flex-col gap-6">
            {/* 헤더 */}
            <div className="w-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-[48px] shadow-2xl p-8 text-white flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold font-['Nunito'] mb-1">🌱 오늘의 추천 레시피</h1>
                    <p className="text-white/90 text-sm font-['Nunito']">최근 식단 분석을 바탕으로 AI가 추천했어요</p>
                </div>
                <button
                    onClick={loadRecommend}
                    className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur text-white rounded-2xl transition-colors text-sm font-medium font-['Nunito'] flex-shrink-0"
                >
                    🔄 새로고침
                </button>
            </div>

            {/* 추천 텍스트 카드 (마크다운 렌더링) */}
            <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xl">🤖</span>
                    <h2 className="text-base font-semibold font-['Nunito'] text-gray-800">AI 맞춤 추천</h2>
                    <span className="px-3 py-1 bg-teal-50 rounded-full text-xs font-medium font-['Nunito'] text-teal-600">AI 분석</span>
                </div>
                <div className="bg-gray-50 rounded-3xl p-5">
                    {renderMarkdown(recommend.recommendation)}
                </div>
            </div>

            {/* 참고 레시피 목록 */}
            {recommend.referenceRecipes && recommend.referenceRecipes.length > 0 && (
                <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-xl">🌿</span>
                        <h2 className="text-base font-semibold font-['Nunito'] text-gray-800">참고한 커뮤니티 레시피</h2>
                    </div>
                    <p className="text-xs text-gray-400 font-['Nunito'] mb-3">레시피를 클릭하면 관련 상품을 쇼핑 탭에서 찾아드려요</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommend.referenceRecipes.map((recipe, idx) => {
    const imageUrl = getRecipeImage(recipe.title);
    return (
        <button
            key={idx}
            onClick={() => handleRecipeClick(recipe)}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-teal-50/50 to-emerald-50/50 hover:from-teal-100/60 hover:to-emerald-100/60 rounded-2xl border border-teal-100 transition-colors text-left group"
        >
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt={recipe.title}
                    className="w-11 h-11 rounded-2xl object-cover flex-shrink-0 shadow-sm"
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                />
            ) : null}
            <span
                className="w-11 h-11 flex-shrink-0 items-center justify-center bg-white rounded-2xl text-xl shadow-sm"
                style={{ display: imageUrl ? 'none' : 'flex' }}
            >
                {RECIPE_ICONS[idx % RECIPE_ICONS.length]}
            </span>
            <p className="flex-1 text-sm text-gray-700 font-['Nunito'] group-hover:text-teal-700 transition-colors">
                {recipe.title}
            </p>
            <span className="text-teal-400 group-hover:translate-x-0.5 transition-transform flex-shrink-0">→</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecipeTab;
