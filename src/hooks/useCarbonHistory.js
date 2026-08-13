import { useState, useEffect, useCallback } from 'react';

const CARBON_HISTORY_KEY = 'carbonHistory';

/**
 * 탄소 발자국 히스토리를 관리하는 hook
 */
function useCarbonHistory() {
    const [carbonHistory, setCarbonHistory] = useState([]);
    const [totalCO2, setTotalCO2] = useState(0);

    // localStorage에 데이터 저장
    const saveData = (data) => {
        try {
            localStorage.setItem(CARBON_HISTORY_KEY, JSON.stringify(data));
            window.carbonHistory = data; // 기존 코드 호환성
        } catch (error) {
            console.error('탄소 히스토리 저장 실패:', error);
        }
    };

    // localStorage에서 데이터 로드
    const loadData = useCallback(() => {
        try {
            let data = [];
            
            // localStorage에서 먼저 확인
            const saved = localStorage.getItem(CARBON_HISTORY_KEY);
            if (saved) {
                data = JSON.parse(saved);
            } else if (window.carbonHistory && window.carbonHistory.length > 0) {
                // localStorage에 없고 window.carbonHistory에 있으면 마이그레이션
                data = window.carbonHistory;
                saveData(data);
                console.log('기존 데이터를 localStorage로 마이그레이션했습니다.');
            }
            
            // window.carbonHistory도 동기화 (기존 코드 호환성)
            window.carbonHistory = data;
            
            setCarbonHistory(data);
            
            const total = data.reduce((sum, entry) => sum + (parseFloat(entry.co2Saved) || 0), 0);
            setTotalCO2(total);
        } catch (error) {
            console.error('탄소 히스토리 로드 실패:', error);
            const emptyData = [];
            setCarbonHistory(emptyData);
            setTotalCO2(0);
            window.carbonHistory = emptyData;
        }
    }, []);

    // 초기 로드 및 이벤트 리스너 등록
    useEffect(() => {
        loadData();

        const handleUpdate = () => {
            loadData();
        };

        // 페이지 포커스 시에도 데이터 새로고침
        const handleFocus = () => {
            loadData();
        };

        window.addEventListener('carbonDataUpdated', handleUpdate);
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('carbonDataUpdated', handleUpdate);
            window.removeEventListener('focus', handleFocus);
        };
    }, []);

    // 새 데이터 추가
    const addCarbonData = (newEntry) => {
        const savedData = [...carbonHistory];
        
        const entry = {
            date: new Date().toISOString(),
            co2Saved: parseFloat(newEntry.co2Saved || 0),
            veganRate: newEntry.veganRate || 0,
            mealCount: newEntry.mealCount || 0
        };
        
        savedData.push(entry);
        
        // localStorage에 저장
        saveData(savedData);
        
        // 상태 업데이트
        setCarbonHistory(savedData);
        const total = savedData.reduce((sum, entry) => sum + (parseFloat(entry.co2Saved) || 0), 0);
        setTotalCO2(total);
        
        // 이벤트 발생
        window.dispatchEvent(new CustomEvent('carbonDataUpdated'));
        
        return entry;
    };

    // 성장 단계 계산
    const getGrowthStage = (co2) => {
        if (co2 === 0) {
            return { emoji: '🌰', label: '씨앗', size: 'text-4xl' };
        } else if (co2 <= 5) {
            return { emoji: '🌱', label: '새싹', size: 'text-5xl' };
        } else if (co2 <= 10) {
            return { emoji: '🌿', label: '풀', size: 'text-6xl' };
        } else if (co2 <= 20) {
            return { emoji: '🌳', label: '나무', size: 'text-7xl' };
        } else {
            return { emoji: '🍁', label: '단풍나무', size: 'text-8xl' };
        }
    };

    return {
        carbonHistory,
        totalCO2,
        addCarbonData,
        getGrowthStage,
        loadData // 외부에서 데이터 새로고침을 위해 export
    };
}

export default useCarbonHistory;