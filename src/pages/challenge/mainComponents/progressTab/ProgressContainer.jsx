import { useEffect, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useCarbonHistory from "../../../../hooks/useCarbonHistory";

function ProgressContainer() {
    const { carbonHistory, totalCO2, loadData } = useCarbonHistory();

    // 그래프용 데이터로 변환
    const chartData = useMemo(() => {
        return carbonHistory.map((entry) => {
            const date = new Date(entry.date);
            const dateStr = `${date.getMonth() + 1}/${date.getDate()}`;
            return {
                name: dateStr,
                co2Saved: parseFloat(entry.co2Saved || 0)
            };
        });
    }, [carbonHistory]);

    // 페이지 포커스시 데이터 새로고침
    useEffect(() => {
        if (loadData) {
            loadData();
        }

        const handleFocus = () => {
            if (loadData) loadData();
        };

        const handleVisibilityChange = () => {
            if (!document.hidden && loadData) loadData();
        };

        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [loadData]);

    return (
        <div className="w-full flex flex-col bg-white/90 rounded-[48px] shadow-2xl p-6 gap-6">
            {/* 헤더 */}
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold font-['Nunito'] text-gray-900">
                    진행 현황
                </h3>
                <div className="text-2xl font-bold text-emerald-600 font-['Inter']">
                    {totalCO2.toFixed(1)}kg
                </div>
            </div>

            {/* 총 절약량 카드 */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 font-['Inter']">총 CO₂ 절약량</span>
                    <span className="text-xs text-gray-500 font-['Inter']">
                        {carbonHistory.length}회 저장됨
                    </span>
                </div>
                <div className="text-4xl font-bold text-emerald-700 font-['Inter'] mb-2">
                    {totalCO2.toFixed(1)} kg
                </div>
                <div className="text-xs text-gray-500 font-['Inter']">
                    나무 {(totalCO2 / 1).toFixed(1)}그루가 1년간 흡수하는 양
                </div>
            </div>

            {/* 그래프 또는 빈 상태 */}
            {carbonHistory.length > 0 ? (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 font-['Nunito'] mb-3">
                        일일 CO₂ 절약량
                    </h4>
                    <div className="bg-white rounded-xl p-4 border border-gray-200">
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tick={{ fill: '#6b7280' }}
                                />
                                <YAxis 
                                    stroke="#6b7280"
                                    fontSize={12}
                                    tick={{ fill: '#6b7280' }}
                                    label={{ value: 'CO₂ (kg)', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                                />
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#f9fafb', 
                                        border: '1px solid #e5e7eb',
                                        borderRadius: '8px',
                                        fontSize: '12px'
                                    }}
                                    formatter={(value) => [`${value} kg`, 'CO₂ 절약']}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="co2Saved" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    dot={{ fill: '#10b981', r: 5 }}
                                    activeDot={{ r: 7 }}
                                    name="CO₂ 절약량"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500 font-['Nunito'] text-sm">
                    아직 저장된 데이터가 없습니다.<br />
                    식단을 저장하고 '좋아요!'를 눌러보세요.
                </div>
            )}
        </div>
    );
}

export default ProgressContainer;