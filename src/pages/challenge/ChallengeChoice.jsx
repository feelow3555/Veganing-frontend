import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VeganTypeStep from './choiceComponents/VeganTypeStep';
import PeriodStep from './choiceComponents/PeriodStep';
import GoalStep from './choiceComponents/GoalStep';
import { startChallenge, getCurrentChallenge, getToken, quitChallenge } from '../../api/backend';

function ChallengeChoice() {
    const navigate = useNavigate();
    const [veganType, setVeganType] = useState('');
    const [period, setPeriod] = useState('');
    const [goal, setGoal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingChallenge, setIsCheckingChallenge] = useState(true);

    const isActive = veganType && period && goal;

    // 페이지 로드 시 이미 진행 중인 챌린지가 있는지 확인
    useEffect(() => {
        const checkExistingChallenge = async () => {
            try {
                const token = getToken();
                if (!token) {
                    setIsCheckingChallenge(false);
                    return;
                }

                // 진행 중인 챌린지 확인
                const response = await getCurrentChallenge(token);

                if (response && response.userChallenge) {
                    console.log('이미 진행 중인 챌린지가 있습니다. 메인 페이지로 이동합니다.');
                    navigate('/challenge/main/meal');
                }
            } catch (error) {
                // 404 에러는 정상 (진행 중인 챌린지 없음)
                console.log('진행 중인 챌린지 없음 - 새로 시작할 수 있습니다.');
            } finally {
                setIsCheckingChallenge(false);
            }
        };

        checkExistingChallenge();
    }, [navigate]);

    const handleStartChallenge = async (quitExisting = false) => {
        if (!isActive || isLoading) return;

        try {
            setIsLoading(true);
            const token = getToken();

            if (!token) {
                alert('로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            // 기존 챌린지가 있고, 포기하지 않기로 한 경우
            if (!quitExisting) {
                try {
                    const existingResponse = await getCurrentChallenge(token);
                    if (existingResponse && existingResponse.userChallenge) {
                        // 사용자에게 선택지 제공
                        const shouldQuit = window.confirm(
                            `이미 진행 중인 챌린지가 있습니다.\n\n` +
                            `현재 챌린지: ${existingResponse.userChallenge.title}\n` +
                            `진행률: ${existingResponse.userChallenge.progress}%\n\n` +
                            `기존 챌린지를 포기하고 새 챌린지를 시작하시겠습니까?\n\n` +
                            `[확인] = 기존 챌린지 포기 후 새 챌린지 시작\n` +
                            `[취소] = 기존 챌린지 계속하기`
                        );

                        if (shouldQuit) {
                            // 기존 챌린지 포기
                            try {
                                await quitChallenge(existingResponse.userChallenge.id, token);
                                console.log('기존 챌린지 포기 완료');
                            } catch (quitError) {
                                console.error('기존 챌린지 포기 실패:', quitError);
                                alert('기존 챌린지를 포기하는 중 오류가 발생했습니다.\n챌린지 메인 페이지로 이동합니다.');
                                navigate('/challenge/main/meal');
                                return;
                            }
                        } else {
                            // 기존 챌린지 계속하기
                            alert('기존 챌린지를 계속 진행합니다.');
                            navigate('/challenge/main/meal');
                            return;
                        }
                    }
                } catch (checkError) {
                    // 404 에러는 정상 (진행 중인 챌린지 없음)
                    if (!checkError.message.includes('No active challenge')) {
                        console.log('기존 챌린지 확인 중 에러 (무시):', checkError.message);
                    }
                }
            }

            // period 변환: "1주일 챌린지" → 7, "1개월 챌린지" → 30
            let periodDays = 7; // 기본값
            if (period && period.includes('1주일')) {
                periodDays = 7;
            } else if (period && period.includes('1개월')) {
                periodDays = 30;
            }

            // veganType 변환 (백엔드 ENUM 형식으로 변환)
            // 백엔드 허용 값: 'vegan', 'lacto', 'ovo', 'lacto-ovo', 'pescatarian', 'flexitarian'
            const veganTypeMap = {
                '플렉시테리언(Flexitarian)': 'flexitarian',
                '페스코(Pesco)': 'pescatarian',
                '락토-오보(Lacto-ovo)': 'lacto-ovo',
                '오보(Ovo)': 'ovo',
                '락토(Lacto)': 'lacto',
                '비건': 'vegan',
                // 백엔드 ENUM에 없는 타입들은 가장 가까운 값으로 매핑
                '폴로(Pollo)': 'flexitarian', // pollo는 ENUM에 없으므로 flexitarian으로
                '프루테리언': 'vegan' // fruitarian은 ENUM에 없으므로 vegan으로
            };
            
            const backendVeganType = veganTypeMap[veganType];
            if (!backendVeganType) {
                console.warn(`⚠️ 알 수 없는 veganType: ${veganType}, 기본값 'flexitarian' 사용`);
            }
            
            const finalVeganType = backendVeganType || 'flexitarian';
            
            console.log('📋 veganType 변환:', {
                원본: veganType,
                변환: finalVeganType
            });

            // 전송할 데이터 확인
            const challengeData = {
                veganType: finalVeganType,
                period: periodDays,
                goal: goal
            };
            
            console.log('📤 챌린지 시작 요청 데이터:', {
                원본: { veganType, period, goal },
                변환: challengeData,
                token: token ? '있음' : '없음'
            });

            // 백엔드 API 호출
            const response = await startChallenge(challengeData, token);

            console.log('✅ 챌린지 시작 성공:', response);
            alert('챌린지가 시작되었습니다! 🎉');

            // 챌린지 메인 페이지로 이동
            navigate('/challenge/main/meal');
        } catch (error) {
            console.error('❌ 챌린지 시작 실패:', error);
            console.error('에러 상세 정보:', {
                message: error?.message,
                error: error?.error,
                status: error?.status,
                details: error?.details,
                rawData: error?.rawData,
                stack: error?.stack
            });

            // 에러 메시지 확인 (여러 소스에서 확인)
            let errorMessage = '알 수 없는 오류가 발생했습니다.';
            
            if (error?.details) {
                errorMessage = error.details;
            } else if (error?.error) {
                errorMessage = error.error;
            } else if (error?.message) {
                errorMessage = error.message;
            } else if (error?.rawData?.error) {
                errorMessage = error.rawData.error;
            } else if (error?.rawData?.details) {
                errorMessage = error.rawData.details;
            }

            console.log('📋 파싱된 에러 메시지:', errorMessage);

            if (errorMessage.includes('already have an active challenge') || errorMessage.includes('active challenge')) {
                // 재시도 (기존 챌린지 포기 후)
                const shouldRetry = window.confirm(
                    '이미 진행 중인 챌린지가 있습니다.\n\n' +
                    '기존 챌린지를 포기하고 새 챌린지를 시작하시겠습니까?'
                );

                if (shouldRetry) {
                    // 기존 챌린지 찾아서 포기
                    try {
                        const existingResponse = await getCurrentChallenge(token);
                        if (existingResponse && existingResponse.userChallenge) {
                            await quitChallenge(existingResponse.userChallenge.id, token);
                            // 재시도
                            handleStartChallenge(true);
                            return;
                        }
                    } catch (retryError) {
                        console.error('재시도 실패:', retryError);
                        alert(`재시도 중 오류가 발생했습니다: ${retryError.message || '알 수 없는 오류'}`);
                    }
                } else {
                    navigate('/challenge/main/meal');
                    return;
                }
            } else if (errorMessage.includes('required')) {
                alert('모든 항목을 선택해주세요.');
            } else {
                // Validation error인 경우 상세 정보 표시
                let fullErrorMessage = `챌린지 시작에 실패했습니다.\n\n오류: ${errorMessage}`;
                
                if (error?.rawData?.validationErrors && error.rawData.validationErrors.length > 0) {
                    const validationDetails = error.rawData.validationErrors
                        .map(err => `- ${err.field}: ${err.message} (값: ${err.value})`)
                        .join('\n');
                    fullErrorMessage += `\n\n검증 오류:\n${validationDetails}`;
                }
                
                if (error?.status) {
                    fullErrorMessage += `\n\n상태 코드: ${error.status}`;
                }
                
                console.error('전체 에러 메시지:', fullErrorMessage);
                console.error('에러 원본 데이터:', error?.rawData);
                alert(fullErrorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    // 챌린지 확인 중일 때 로딩 화면
    if (isCheckingChallenge) {
        return (
            <div className="min-h-screen bg-white pt-[157px] pb-[80px] flex items-center justify-center">
                <div className="text-center">
                    <div className="text-4xl mb-4">⏳</div>
                    <p className="text-gray-600">챌린지 확인 중...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-[157px] pb-[80px]">
            <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">
                
                {/* Challenge Hero */}
                <div className="w-full text-center space-y-6 mb-12">
                    <h1 className="text-6xl font-normal font-['Inter'] leading-[60px] tracking-tight text-primary-dark">
                        비건 챌린지 시작하기
                    </h1>
                    <p className="text-xl font-normal font-['Inter'] leading-7 text-gray-700">
                        당신에게 맞는 비건 단계와 챌린지 기간, 목표를 선택해보세요
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <VeganTypeStep selected={veganType} onSelect={setVeganType} />
                    <PeriodStep selected={period} onSelect={setPeriod} />
                    <GoalStep selected={goal} onSelect={setGoal} />
                </div>

                {/* Challenge Button */}
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={handleStartChallenge}
                        disabled={!isActive || isLoading}
                        className={`px-20 py-4 rounded-2xl shadow-lg text-lg font-semibold transition-all ${
                            isActive && !isLoading
                                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 cursor-pointer'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {isLoading ? '챌린지 시작 중...' : '챌린지 시작하기'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ChallengeChoice;