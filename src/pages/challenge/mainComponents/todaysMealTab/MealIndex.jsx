import { useEffect } from 'react';
import useMealIndex from '../../../../hooks/useMealIndex';

function MealIndex({ onMealsCountChange }) {
    const { meals, deleteMeal } = useMealIndex();

    const handleDelete = (id) => {
        if (confirm("이 식단을 삭제하시겠습니까?")) {
            deleteMeal(id);
        }
    };

    // 식단 개수가 변경되면 부모 컴포넌트에 알림
    useEffect(() => {
        onMealsCountChange?.(meals.length);
    }, [meals.length, onMealsCountChange]);

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 h-[250px] flex flex-col">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
                <h3 className="text-lg font-semibold font-['Nunito'] text-gray-900">
                    오늘의 식단 기록
                </h3>
                <span className="text-sm font-['Nunito'] text-gray-500">
                    {meals.length}개 등록됨
                </span>
            </div>

            {/* 가로 스크롤 가능한 식단 목록 */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden">
                <div className="flex gap-2 h-full">
                    {meals.length > 0 ? (
                        meals.map((meal) => (
                            <div
                                key={meal.id}
                                className="relative w-32 h-32 bg-gray-100 rounded-xl overflow-hidden group flex-shrink-0"
                            >
                                <img
                                    src={meal.image}
                                    alt="식단"
                                    className="w-full h-full object-cover"
                                />
                                {/* 호버시 나타나는 삭제 버튼 */}
                                <button
                                    onClick={() => handleDelete(meal.id)}
                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-red-600 text-lg"
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="w-full text-center py-8">
                            <p className="text-sm font-['Nunito'] text-gray-500">
                                아직 등록된 식단이 없습니다.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MealIndex;