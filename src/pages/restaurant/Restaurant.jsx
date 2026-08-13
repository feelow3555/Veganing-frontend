import SearchBar from "../shopping/components/SearchBar";
import MapComponent from "./components/MapComponent";

function Restaurant() {
    return (
        <div className="bg-white w-full flex flex-col animate-fadeIn">
            <div className="w-full text-center space-y-6 mt-40 mb-12">
                <h1 className="text-6xl font-normal font-['Inter'] leading-[60px] tracking-tight text-primary-dark">
                    비건 식당
                </h1>
                <p className="text-xl font-normal font-['Inter'] leading-7 text-gray-700">
                    내 주변의 비건 친화적인 맛집을 찾아보세요
                </p>
            </div>

            <div className="min-h-screen bg-white pt-4 pb-[80px]">
                <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">
                    {/* 식당 검색바 */}
                    <SearchBar category="restaurant" />

                    {/* 지도 및 식당 목록 */}
                    <div className='w-full flex flex-col gap-8'>
                        <MapComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Restaurant;
