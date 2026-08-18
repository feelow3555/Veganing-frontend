import { useState } from 'react';
import EnvImpactPopup from './EnvimpactPopup';
import { addPoints, getCarbonToday, getToken } from '../../../../api/backend';

function UploadButton({ mealsCount, onSaveComplete }) {
    const [showPopup, setShowPopup] = useState(false);
    const [impactData, setImpactData] = useState(null);
    const [isCalculating, setIsCalculating] = useState(false);

    const handleClick = async () => {
        const confirmed = confirm('정말 저장하시겠습니까?\n\n저장 후에는 되돌릴 수 없습니다.');
        if (!confirmed) return;

        const meals = window.getAllMeals?.() || [];
        if (meals.length === 0) {
            alert('저장할 식단이 없습니다.');
            return;
        }

        setIsCalculating(true);

        try {
            const token = getToken();

            // 1. 포인트 추가
            if (token) {
                try {
                    const pointsResult = await addPoints(200, token);
                    const user = pointsResult.data;

                    if (user?.leveledUp) {
                        alert(`🎉 레벨업! Level ${user.level} 달성!\n\n+200 포인트 추가!\n현재 포인트: ${user.totalPoints}`);
                        setTimeout(() => window.location.reload(), 1000);
                    } else {
                        alert(`+200 포인트 추가!\n현재 포인트: ${user?.totalPoints}`);
                        window.dispatchEvent(new CustomEvent('pointsUpdated'));
                    }
                } catch (pointsError) {
                    console.error('포인트 추가 실패:', pointsError);
                }
            }

            // 2. 오늘 탄소 절감량 조회
            let carbonData = { co2Saved: 0, veganRate: 0, mealCount: meals.length };
            if (token) {
                try {
                    const carbonRes = await getCarbonToday(token);
                    carbonData = {
                        co2Saved: carbonRes.data?.totalCarbon ?? 0,
                        veganRate: 100,
                        mealCount: meals.length,
                    };
                } catch (e) {
                    console.error('탄소 조회 실패:', e);
                }
            }

            setImpactData(carbonData);
            setShowPopup(true);
            onSaveComplete();
        } catch (error) {
            console.error('저장 중 오류:', error);
            alert('저장 중 오류가 발생했습니다.');
        } finally {
            setIsCalculating(false);
        }
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
                    {isCalculating ? '저장 중...' : '오늘의 식단 전체 저장하기'}
                </button>
            </div>

            <EnvImpactPopup
                isOpen={showPopup}
                onClose={() => setShowPopup(false)}
                data={impactData}
            />
        </>
    );
}

export default UploadButton;
