import { useState } from 'react';
import food1 from '../assets/resMap/food1.png';
import food2 from '../assets/resMap/food2.png';
import food3 from '../assets/resMap/food3.png';
import food4 from '../assets/resMap/food4.png';
import food5 from '../assets/resMap/food5.png';

/**
 * 식당 데이터와 선택 상태를 관리하는 hook
 */
function useRestaurantData() {
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);

    const restaurants = [
        {
            id: 1,
            name: "그린테이블",
            category: "비건 레스토랑",
            rating: 4.8,
            reviews: 234,
            price: "₩₩₩₩",
            distance: "0.3km",
            tags: ["완전 비건", "유기농", "파인다이닝"],
            description: "신선한 유기농 재료로 만드는 프리미엄 비건 요리 전문점",
            position: { x: 120, y: 180 },
            image: food1
        },
        {
            id: 2,
            name: "플랜트카페",
            category: "비건 카페",
            rating: 4.6,
            reviews: 167,
            price: "₩₩",
            distance: "0.8km",
            tags: ["완전 비건", "카페", "디저트"],
            description: "식물성 라떼와 홈메이드 비건 디저트를 즐길 수 있는 아늑한 카페",
            position: { x: 280, y: 220 },
            image: food2
        },
        {
            id: 3,
            name: "헬시볼",
            category: "샐러드 전문점",
            rating: 4.4,
            reviews: 89,
            price: "₩₩",
            distance: "1.2km",
            tags: ["비건 친화", "샐러드", "건강식"],
            description: "신선한 샐러드와 비건 옵션이 풍부한 헬시푸드 전문점",
            position: { x: 440, y: 160 },
            image: food3
        },
        {
            id: 4,
            name: "베지가든",
            category: "비건 뷔페",
            rating: 4.7,
            reviews: 312,
            price: "₩₩₩",
            distance: "1.5km",
            tags: ["완전 비건", "뷔페", "다양한 메뉴"],
            description: "50가지 이상의 비건 요리를 무제한으로 즐길 수 있는 뷔페",
            position: { x: 200, y: 340 },
            image: food4
        },
        {
            id: 5,
            name: "오가닉키친",
            category: "비건 베이커리",
            rating: 4.5,
            reviews: 156,
            price: "₩₩",
            distance: "2.0km",
            tags: ["완전 비건", "베이커리", "글루텐프리"],
            description: "매일 아침 구워내는 신선한 비건 빵과 디저트",
            position: { x: 380, y: 300 },
            image: food5
        },
    ];

    const handleSelectRestaurant = (id) => {
        setSelectedRestaurant(id);
    };

    return {
        restaurants,
        selectedRestaurant,
        handleSelectRestaurant
    };
}

export default useRestaurantData;