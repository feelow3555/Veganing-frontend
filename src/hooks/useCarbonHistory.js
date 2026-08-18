import { useState, useEffect, useCallback } from 'react';
import { getCarbonHistory, getCarbonStats, getToken } from '../api/backend';

function useCarbonHistory() {
    const [carbonHistory, setCarbonHistory] = useState([]);
    const [totalCO2, setTotalCO2] = useState(0);

    const loadData = useCallback(async () => {
        try {
            const token = getToken();
            if (!token) return;

            const [historyRes, statsRes] = await Promise.all([
                getCarbonHistory(30, token),
                getCarbonStats(token)
            ]);

            const history = (historyRes.data || []).map(entry => ({
                date: entry.date,
                co2Saved: parseFloat(entry.totalCarbon || 0),
                mealCount: entry.mealCount || 0
            }));

            setCarbonHistory(history);
            setTotalCO2(parseFloat(statsRes.data?.totalCarbon || 0));
        } catch (error) {
            console.error('탄소 히스토리 로드 실패:', error);
            setCarbonHistory([]);
            setTotalCO2(0);
        }
    }, []);

    useEffect(() => {
        loadData();
        window.addEventListener('focus', loadData);
        window.addEventListener('carbonDataUpdated', loadData);
        return () => {
            window.removeEventListener('focus', loadData);
            window.removeEventListener('carbonDataUpdated', loadData);
        };
    }, [loadData]);

    const getGrowthStage = (co2) => {
        if (co2 === 0) return { emoji: '🌰', label: '씨앗', size: 'text-4xl' };
        if (co2 <= 5) return { emoji: '🌱', label: '새싹', size: 'text-5xl' };
        if (co2 <= 10) return { emoji: '🌿', label: '풀', size: 'text-6xl' };
        if (co2 <= 20) return { emoji: '🌳', label: '나무', size: 'text-7xl' };
        return { emoji: '🍁', label: '단풍나무', size: 'text-8xl' };
    };

    return { carbonHistory, totalCO2, getGrowthStage, loadData };
}

export default useCarbonHistory;
