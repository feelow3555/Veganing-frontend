import { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ChallengeTabs from "./mainComponents/challengeContent/ChallengeTab";
import MealContainer from "./mainComponents/todaysMealTab/MealContainer";
import ProgressContainer from "./mainComponents/progressTab/ProgressContainer";
import RecipeTab from "./mainComponents/challengeContent/RecipeTab";
import ShoppingTab from "./mainComponents/challengeContent/ShoppingTab";
import { getCurrentChallenge, getChallengeStats, getToken, quitChallenge } from '../../api/backend';

function ChallengeMain() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [challengeData, setChallengeData] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [isQuitting, setIsQuitting] = useState(false);
    const challengeDataRef = useRef(challengeData);

    // 현재 활성 탭 결정
    const getActiveTab = () => {
        const path = location.pathname;
        if (path.includes('/meal')) return 'meal';
        if (path.includes('/progress')) return 'progress';
        if (path.includes('/recipe')) return 'recipe';
        if (path.includes('/shopping')) return 'shopping';
        return 'meal'; // 기본값
    };

    const activeTab = getActiveTab();

    // challengeData가 변경될 때마다 ref 업데이트
    useEffect(() => {
        challengeDataRef.current = challengeData;
    }, [challengeData]);

    useEffect(() => {
        const fetchChallengeData = async (showLoading = true) => {
            try {
                if (showLoading) {
                    setIsLoading(true);
                }
                const token = getToken();

                if (!token) {
                    console.error('로그인이 필요합니다.');
                    navigate('/challenge/choice');
                    return;
                }

                // 현재 챌린지와 통계 데이터를 동시에 가져오기
                const [challengeResponse, statsResponse] = await Promise.all([
                    getCurrentChallenge(token).catch(err => {
                        console.error('챌린지 조회 실패:', err);
                        return null;
                    }),
                    getChallengeStats(token).catch(err => {
                        console.error('통계 조회 실패:', err);
                        return null;
                    })
                ]);

                if (!challengeResponse || !challengeResponse.userChallenge) {
                    console.log('진행 중인 챌린지가 없습니다.');
                    navigate('/challenge/choice');
                    return;
                }

                setChallengeData(challengeResponse.userChallenge);
                setStatsData(statsResponse?.stats);
            } catch (error) {
                console.error('데이터 조회 실패:', error);
                navigate('/challenge/choice');
            } finally {
                if (showLoading) {
                    setIsLoading(false);
                }
            }
        };

        // 초기 마운트 시에만 로딩 표시하며 데이터 불러오기
        fetchChallengeData(true);

        // 페이지 포커스 시 데이터 새로고침 (이미 데이터가 있으면 로딩 표시 없이)
        const handleFocus = () => {
            // ref를 사용하여 최신 challengeData 참조
            if (challengeDataRef.current) {
                fetchChallengeData(false);
            }
            // 데이터가 없을 때는 초기 로딩이 이미 처리되므로 여기서는 아무것도 하지 않음
        };

        window.addEventListener('focus', handleFocus);
        
        // visibilitychange 이벤트: 파일 선택 다이얼로그가 열릴 때는 무시
        const handleVisibilityChange = () => {
            // 파일 선택 중일 가능성이 있으므로 약간의 지연 후 확인
            setTimeout(() => {
                if (!document.hidden) {
                    // ref를 사용하여 최신 challengeData 참조
                    if (challengeDataRef.current) {
                        fetchChallengeData(false);
                    }
                    // 데이터가 없을 때는 초기 로딩이 이미 처리되므로 여기서는 아무것도 하지 않음
                }
            }, 500); // 500ms 지연
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // 포인트 업데이트 이벤트 리스너 추가
        const handlePointsUpdated = () => {
            console.log('🔄 포인트 업데이트 이벤트 수신, 데이터 새로고침');
            if (challengeDataRef.current) {
                fetchChallengeData(false);
            }
        };
        
        window.addEventListener('pointsUpdated', handlePointsUpdated);

        return () => {
            window.removeEventListener('focus', handleFocus);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('pointsUpdated', handlePointsUpdated);
        };
    }, [navigate]); // challengeData를 dependency에서 제거하고 ref 사용

    // 로딩 중일 때
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white pt-[157px] pb-[80px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">챌린지 데이터 불러오는 중...</p>
                </div>
            </div>
        );
    }

    // 챌린지 데이터가 없을 때 (실패 시)
    if (!challengeData) {
        return null;
    }

    // 카드 데이터 (백엔드에서 받은 실제 데이터 사용)
    const cards = [
        { emoji: '📅', value: challengeData.currentDay || 0, label: '일째 진행' },
        { emoji: '🔥', value: statsData?.currentStreak || 0, label: '연속 달성' },
        { emoji: '⭐', value: statsData?.currentPoints || 0, label: '포인트' },
        { emoji: '🏆', value: `Lv.${statsData?.level || 1}`, label: '레벨' }
    ];

    // 진행률 데이터 (백엔드에서 받은 실제 데이터 사용)
    const currentDay = challengeData.currentDay || 0;
    const totalDays = challengeData.totalDays || 30;
    const progress = challengeData.progress || 0;

    return (
        <div className="bg-white w-full flex flex-col animate-fadeIn min-h-screen pt-[157px] pb-[80px]" style={{ width: '100%', minWidth: 0 }}>
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8" style={{ width: '100%', maxWidth: '1280px', minWidth: 0 }}>
                
                {/* Challenge Hero */}
                <div className="w-full text-center space-y-6 mb-12">
                    <h1 className="text-6xl font-normal font-['Inter'] leading-[60px] tracking-tight text-primary-dark">
                        {challengeData.title || '비건 챌린지'}
                    </h1>
                    <div className="flex justify-center">
                        <div className="p-[2px] bg-gradient-to-r from-cyan-400 to-emerald-400 rounded-full">
                            <div className="px-6 py-2 bg-white rounded-full">
                                <span className="text-teal-600 text-bold font-medium font-['Nunito']">
                                    {challengeData.veganType || '비건'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Challenge State Cards */}
                <div className="w-full flex justify-center mb-12" style={{ width: '100%', minWidth: 0, maxWidth: '100%' }}>
                    <div className="flex gap-4 flex-wrap justify-center" style={{ width: '100%', maxWidth: '100%', minWidth: 0 }}>
                        {cards.map((card, idx) => (
                            <div 
                                key={idx} 
                                className="w-[236px] h-[160px] bg-white/90 rounded-[35px] shadow-2xl p-6 flex flex-col items-center justify-center gap-3 flex-shrink-0"
                                style={{ width: '236px', minWidth: '236px', maxWidth: '236px', flexShrink: 0 }}
                            >
                                
                                <div className="text-3xl font-bold font-['Nunito'] text-gray-900">
                                    {card.value}
                                </div>
                                <div className="text-sm font-normal font-['Nunito'] text-gray-600">
                                    {card.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Challenge Progress */}
                <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col gap-4" style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-normal font-['Nunito'] text-gray-900">
                            챌린지 진행률
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="px-4 py-1 bg-teal-50 rounded-full">
                                <span className="text-sm font-medium font-['Nunito'] text-gray-600">
                                    {currentDay}/{totalDays}일
                                </span>
                            </div>
                            <button
                                onClick={async () => {
                                    const confirmed = window.confirm(
                                        '정말로 챌린지를 종료하시겠습니까?\n\n' +
                                        '챌린지를 종료하면 진행률이 저장되지만,\n' +
                                        '새로운 챌린지를 시작할 수 있습니다.'
                                    );
                                    
                                    if (!confirmed) return;
                                    
                                    try {
                                        setIsQuitting(true);
                                        const token = getToken();
                                        if (!token) {
                                            alert('로그인이 필요합니다.');
                                            navigate('/login');
                                            return;
                                        }
                                        
                                        await quitChallenge(challengeData.id, token);
                                        alert('챌린지가 종료되었습니다.');
                                        navigate('/challenge/choice');
                                    } catch (error) {
                                        console.error('챌린지 종료 실패:', error);
                                        alert(`챌린지 종료에 실패했습니다.\n${error.message || '다시 시도해주세요.'}`);
                                    } finally {
                                        setIsQuitting(false);
                                    }
                                }}
                                disabled={isQuitting}
                                className={`px-4 py-2 rounded-full text-sm font-medium font-['Nunito'] transition-all ${
                                    isQuitting
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-red-500 hover:bg-red-600 text-white cursor-pointer'
                                }`}
                            >
                                {isQuitting ? '종료 중...' : '챌린지 종료'}
                            </button>
                        </div>
                    </div>
                    <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Challenge Tabs */}
                <ChallengeTabs />

                {/* Tab Content - 모든 탭을 렌더링하되, CSS로 보이기/숨기기 제어 */}
                <div className="relative w-full" style={{ width: '100%', minWidth: 0 }}>
                    {/* 오늘의 식단 */}
                    <div className={activeTab === 'meal' ? 'block' : 'hidden'} style={{ width: '100%' }}>
                        <MealContainer />
                    </div>
                    
                    {/* 진행 현황 */}
                    <div className={activeTab === 'progress' ? 'block' : 'hidden'}>
                        <ProgressContainer />
                    </div>
                    
                    {/* 레시피 */}
                    <div className={activeTab === 'recipe' ? 'block' : 'hidden'}>
                        <RecipeTab />
                    </div>
                    
                    {/* 쇼핑 */}
                    <div className={activeTab === 'shopping' ? 'block' : 'hidden'}>
                        <ShoppingTab />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ChallengeMain;