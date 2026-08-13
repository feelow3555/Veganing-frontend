import { useState } from 'react';
import veganType from '../../../assets/challenge/veganType.png';

function VeganTypeStep({ selected, onSelect }) {
    const [showModal, setShowModal] = useState(false);

    const veganTypes = [
        { name: '플렉시테리언(Flexitarian)', desc: '채식을 위주로 하되 상황에 맞게 육식도 섭취', difficulty: '매우 쉬움' },
        { name: '폴로(Pollo)', desc: '붉은 육고기(소,돼지)를 섭취하지 않음', difficulty: '쉬움' },
        { name: '페스코(Pesco)', desc: '해산물과 동물의 알, 우유만 섭취', difficulty: '쉬움' },
        { name: '락토-오보(Lacto-ovo)', desc: '동물의 알과 유제품 섭취', difficulty: '보통' },
        { name: '오보(Ovo)', desc: '동물의 알 섭취', difficulty: '보통' },
        { name: '락토(Lacto)', desc: '유제품 섭취', difficulty: '어려움' },
        { name: '비건', desc: '모든 종류의 동물성 음식 섭취하지 않음', difficulty: '어려움' },
        { name: '프루테리언', desc: '과일만 섭취', difficulty: '매우 어려움' },
    ];

    return (
        <>
            <div className="bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col relative">
                <button
                    onClick={() => setShowModal(true)}
                    className="absolute top-5 right-7 w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 flex items-center justify-center transition-colors text-teal-600 font-bold"
                    title="비건 타입 설명 보기"
                >
                    ?
                </button>

                <h3 className="text-base font-normal font-['Inter'] text-teal-600 mb-6">
                    1단계: 비건 타입 선택
                </h3>
                
                <div className="space-y-4 overflow-y-auto max-h-[520px] pr-2 scrollbar-thin scrollbar-thumb-teal-300 scrollbar-track-gray-100">
                    {veganTypes.map((type) => (
                        <button
                            key={type.name}
                            onClick={() => onSelect(type.name)}
                            className={`w-full h-24 rounded-2xl p-6 transition-all text-left flex-shrink-0 ${
                                selected === type.name
                                    ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                                    : 'bg-white border-2 border-teal-200 hover:border-teal-400'
                            }`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-sm font-semibold ${
                                    selected === type.name ? 'text-white' : 'text-gray-950'
                                }`}>
                                    {type.name}
                                </span>
                                <span className={`px-2 py-0.5 rounded-lg text-xs font-medium ${
                                    selected === type.name 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-gray-100 text-gray-950'
                                }`}>
                                    {type.difficulty}
                                </span>
                            </div>
                            <p className={`text-sm ${
                                selected === type.name ? 'text-white' : 'text-gray-950 opacity-80'
                            }`}>
                                {type.desc}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {showModal && (
                <div 
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div 
                        className="bg-white rounded-3xl p-6 max-w-4xl max-h-[90vh] overflow-auto relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 text-xl"
                        >
                            ×
                        </button>

                        <div className="w-full bg-gray-100 rounded-xl overflow-hidden">
                            <img 
                                src={veganType}
                                alt="비건 타입 분류표"
                                className="w-full h-auto"
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default VeganTypeStep;