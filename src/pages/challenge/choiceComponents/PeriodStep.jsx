function PeriodStep({ selected, onSelect }) {
    const periods = [
        { name: '1주일 챌린지', desc: '부담 없이 시작해보세요' },
        { name: '1개월 챌린지', desc: '습관을 만들어보세요' },
    ];

    return (
        <div className="bg-white/90 rounded-[48px] shadow-2xl p-6">
            <h3 className="text-base font-normal font-['Inter'] text-teal-600 mb-6">
                2단계: 챌린지 기간 선택
            </h3>
            <div className="space-y-4">
                {periods.map((period) => (
                    <button
                        key={period.name}
                        onClick={() => onSelect(period.name)}
                        className={`w-full h-24 rounded-2xl p-6 transition-all text-left ${
                            selected === period.name
                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                                : 'bg-white border-2 border-emerald-200 hover:border-emerald-400'
                        }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <span className={`text-sm font-semibold ${
                                selected === period.name ? 'text-white' : 'text-gray-950'
                            }`}>
                                {period.name}
                            </span>
                        </div>
                        <p className={`text-sm ${
                            selected === period.name ? 'text-white' : 'text-gray-950 opacity-80'
                        }`}>
                            {period.desc}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default PeriodStep;