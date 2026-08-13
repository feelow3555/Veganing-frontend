import { Link, useLocation } from 'react-router-dom';

function ChallengeTabs() {
    const location = useLocation();
    
    // 탭 목록
    const tabs = [
        { name: '오늘의 식단', path: '/challenge/main/meal' },
        { name: '진행 현황', path: '/challenge/main/progress' },
        { name: '레시피', path: '/challenge/main/recipe' },
        { name: '쇼핑', path: '/challenge/main/shopping' },
    ];

    // 기본 경로(/challenge/main)는 meal 탭으로 처리
    const currentPath = location.pathname === '/challenge/main'
        ? '/challenge/main/meal' 
        : location.pathname;

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-2">
            <div className="flex gap-1">
                {tabs.map((tab) => (
                    <Link
                        key={tab.path}
                        to={tab.path}
                        className={`flex-1 px-4 py-1 rounded-2xl text-sm font-medium font-['Nunito'] transition-all text-center ${
                            currentPath === tab.path
                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                                : 'text-teal-600 hover:bg-gray-50'
                        }`}
                    >
                        {tab.name}
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default ChallengeTabs;