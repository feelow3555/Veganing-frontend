import { useState, useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'challenge_meal_index_state';

/**
 * 식단 목록(인덱스)을 관리하는 hook (localStorage로 영구 저장)
 */
function useMealIndex() {
    // localStorage에서 초기 상태 복원
    const getInitialMeals = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                // timestamp를 Date 객체로 복원
                return parsed.map(meal => ({
                    ...meal,
                    timestamp: meal.timestamp ? new Date(meal.timestamp) : new Date()
                }));
            }
        } catch (error) {
            console.error('localStorage 복원 실패:', error);
        }
        return [];
    };

    const [meals, setMeals] = useState(getInitialMeals);
    const mealsRef = useRef(meals);

    // meals가 변경될 때마다 ref 업데이트 및 localStorage 저장
    useEffect(() => {
        mealsRef.current = meals;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
        } catch (error) {
            console.error('localStorage 저장 실패:', error);
        }
    }, [meals]);

    // 식단 추가
    const addMeal = useCallback((mealData) => {
        console.log("🔵 useMealIndex.addMeal 호출됨:", mealData);
        const newMeal = {
            id: Date.now() + Math.random(), // 중복 방지
            ...mealData,
            timestamp: new Date()
        };
        setMeals(prev => {
            const updated = [...prev, newMeal];
            console.log("✅ 식단 추가 완료, 총 개수:", updated.length);
            return updated;
        });
        return newMeal;
    }, []);

    // 식단 삭제
    const deleteMeal = useCallback((id) => {
        setMeals(prev => prev.filter(meal => meal.id !== id));
    }, []);

    // 전체 초기화 (localStorage도 함께 초기화)
    const resetMeals = useCallback(() => {
        setMeals([]);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('localStorage 초기화 실패:', error);
        }
    }, []);

    // 모든 식단 가져오기 (localStorage에서 직접 읽어서 최신 상태 반환)
    const getAllMeals = useCallback(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return parsed || [];
            }
        } catch (error) {
            console.error('localStorage에서 식단 가져오기 실패:', error);
        }
        // localStorage가 없으면 현재 상태 반환
        return mealsRef.current;
    }, []);

    // window 객체에 함수 등록 (기존 코드와 호환성)
    useEffect(() => {
        console.log("🔵 window 함수 등록 중...");
        window.addMealToIndex = addMeal;
        window.getAllMeals = getAllMeals;
        window.resetMealIndex = resetMeals;
        
        console.log("✅ window 함수 등록 완료");
        console.log("🔵 window.addMealToIndex:", typeof window.addMealToIndex);

        return () => {
            delete window.addMealToIndex;
            delete window.getAllMeals;
            delete window.resetMealIndex;
        };
    }, [addMeal, getAllMeals, resetMeals]);

    return {
        meals,
        mealsCount: meals.length,
        addMeal,
        deleteMeal,
        resetMeals,
        getAllMeals
    };
}

export default useMealIndex;