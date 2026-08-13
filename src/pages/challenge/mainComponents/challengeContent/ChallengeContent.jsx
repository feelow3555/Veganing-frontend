import { useState } from 'react';
import ChallengeTabs from './ChallengeTab';
import MealContainer from '../todaysMealTab/MealContainer';
import ProgressContainer from '../progressTab/ProgressContainer';
import ShoppingTab from './ShoppingTab';
import RecipeTab from "./RecipeTab";

function ChallengeContent() {
    const [activeTab, setActiveTab] = useState('오늘의 식단');

    // 탭별 컴포넌트 매핑
    const tabComponents = {
        '오늘의 식단': MealContainer,
        '진행 현황': ProgressContainer,
        '레시피': RecipeTab,
        '쇼핑': ShoppingTab,
    };

    // 현재 선택된 탭의 컴포넌트
    const ActiveComponent = tabComponents[activeTab] || MealContainer;

    return (
        <div className="w-full flex flex-col gap-8">
            <ChallengeTabs activeTab={activeTab} setActiveTab={setActiveTab} />
            <ActiveComponent key={activeTab === '레시피' ? activeTab : undefined} />
        </div>
    );
}

export default ChallengeContent;