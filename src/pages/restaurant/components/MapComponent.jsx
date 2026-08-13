import useRestaurantData from '../../../hooks/useRestaurantData';
import mapBackground from '../../../assets/resMap/mapImg.png';
import mapMaker from '../../../assets/resMap/map.svg';

export default function MapComponent() {
    const { restaurants, selectedRestaurant, handleSelectRestaurant } = useRestaurantData();

    // 찜하기 아이콘 컴포넌트
    const HeartIcon = ({ filled }) => (
        <svg className="w-5 h-5" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"}>
            <path
                d="M10 17.5l-1.45-1.32C4.4 12.36 2 10.28 2 7.5 2 5.5 3.5 4 5.5 4c1.54 0 3.04.99 3.57 2.36h1.87C11.46 4.99 12.96 4 14.5 4c2 0 3.5 1.5 3.5 3.5 0 2.78-2.4 4.86-6.55 8.68L10 17.5z"
                stroke="currentColor"
                strokeWidth="1.5"
            />
        </svg>
    );

    return (
        <div className="w-full flex gap-6 from-green-150 to-gray-50 min-h-screen">
            <div className="w-[650px] h-[800px] bg-white rounded-2xl p-6 flex-shrink-0 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 flex items-center justify-center">
                        <img
                            src={mapMaker}
                            alt="map marker"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                    <h2 className="text-green-600 text-lg font-bold font-['Nunito']">
                        지도
                    </h2>
                </div>

                <div
                    className="relative w-full h-[690px] rounded-xl overflow-hidden border-2 border-green-100"
                    style={{
                        backgroundImage: `url(${mapBackground})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}
                >
                    <div className="absolute inset-0 bg-white/10" />

                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="absolute z-10 group cursor-pointer"
                            style={{
                                left: `${restaurant.position.x}px`,
                                top: `${restaurant.position.y}px`,
                                transform: 'translate(-50%, -50%)' // 마커 중앙 정렬
                            }}
                            onClick={() => handleSelectRestaurant(restaurant.id)}
                        >
                            <img
                                src={mapMaker}
                                alt="map marker"
                                className={`w-10 h-10 object-contain transition-all duration-200 ${
                                    selectedRestaurant === restaurant.id
                                        ? 'scale-125 drop-shadow-lg'
                                        : 'group-hover:scale-110 group-hover:drop-shadow-md'
                                }`}
                            />

                            {/* 마커 호버 시 식당명 툴팁 */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                <div className="bg-gray-900 text-white text-xs font-['Nunito'] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                                    {restaurant.name}
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col gap-4 flex-1 h-[800px]">
                <div className="h-14 bg-white rounded-2xl shadow-lg flex items-center justify-start px-6 flex-shrink-0">
                    <span className="text-green-600 text-lg font-bold font-['Nunito']">
                        내 주변 비건 식당
                    </span>
                </div>

                <div className="bg-white rounded-2xl border border-green-100 p-6 flex-1 shadow-xl overflow-y-auto min-h-0">
                    <div className="space-y-3">
                        {restaurants.map((restaurant) => (
                            <div
                                key={restaurant.id}
                                onClick={() => handleSelectRestaurant(restaurant.id)}
                                className={`flex gap-4 p-4 rounded-xl transition-all cursor-pointer ${
                                    selectedRestaurant === restaurant.id
                                        ? 'bg-green-50 border-2 border-green-400 shadow-md' // 선택된 식당 하이라이트
                                        : 'bg-gray-50 border-2 border-transparent hover:bg-green-50 hover:border-green-200 hover:shadow-md'
                                }`}
                            >
                                <div className="w-24 h-24 rounded-xl flex-shrink-0 overflow-hidden">
                                    <img 
                                        src={restaurant.image} 
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-1.5">
                                        <div>
                                            <h3 className="text-gray-900 font-bold text-lg font-['Nunito'] mb-0.5">
                                                {restaurant.name}
                                            </h3>
                                            <p className="text-gray-500 text-sm font-['Nunito']">
                                                {restaurant.category}
                                            </p>
                                        </div>
                                        <button className="text-gray-300 hover:text-red-500 transition-colors">
                                            <HeartIcon filled={false} />
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="flex items-center gap-1">
                                            <span className="text-yellow-500 text-base">★</span>
                                            <span className="text-gray-900 font-bold text-sm font-['Nunito']">
                                                {restaurant.rating}
                                            </span>
                                            <span className="text-gray-400 text-sm font-['Nunito']">
                                                ({restaurant.reviews})
                                            </span>
                                        </div>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-gray-600 text-sm font-['Nunito']">
                                            {restaurant.price}
                                        </span>
                                        <span className="text-gray-300">•</span>
                                        <span className="text-green-600 text-sm font-['Nunito'] font-bold">
                                            📍 {restaurant.distance}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-1.5 mb-2">
                                        {restaurant.tags.map((tag, idx) => (
                                            <span
                                                key={idx}
                                                className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-['Nunito'] font-medium rounded-full"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <p className="text-gray-600 text-sm font-['Nunito'] leading-relaxed">
                                        {restaurant.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}