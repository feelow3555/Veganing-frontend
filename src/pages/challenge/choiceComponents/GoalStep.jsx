function GoalStep({ selected, onSelect }) {
    const goals = [
        { emoji: '💪', name: '건강 증진', desc: '더 건강한 몸을 위해' },
        { emoji: '🌍', name: '환경 보호', desc: '지구를 위한 선택' },
        { emoji: '🐾', name: '동물 보호', desc: '생명 존중의 실천' },
        { emoji: '⚖️', name: '체중 관리', desc: '건강한 다이어트' },
    ];

    return (
        <div className="bg-white/90 rounded-[48px] shadow-2xl p-6">
            <h3 className="text-base font-normal font-['Inter'] text-teal-600 mb-6">
                3단계: 목표 선택
            </h3>
            <div className="space-y-4">
                {goals.map((goal) => (
                    <button
                        key={goal.name}
                        onClick={() => onSelect(goal.name)}
                        className={`w-full h-28 rounded-2xl p-6 transition-all text-left ${
                            selected === goal.name
                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                                : 'bg-white border-2 border-cyan-200 hover:border-cyan-400'
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{goal.emoji}</span>
                            <span className={`text-sm font-semibold ${
                                selected === goal.name ? 'text-white' : 'text-gray-950'
                            }`}>
                                {goal.name}
                            </span>
                        </div>
                        <p className={`text-sm ${
                            selected === goal.name ? 'text-white' : 'text-gray-950 opacity-80'
                        }`}>
                            {goal.desc}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default GoalStep;