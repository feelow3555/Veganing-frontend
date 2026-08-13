import React, { useState, useMemo } from "react";
import SearchBar from './components/SearchBar';
import CategoryTabs from './components/CategoryTabs';
import ProductCard from './components/ProductCard';
import Pagination from './components/Pagination';

import freeDel from "../../assets/shopping/freeDel.svg";
import shield from "../../assets/shopping/shield.svg";
import point from "../../assets/shopping/point.svg";
import gift from "../../assets/shopping/gift.svg";
import { PRODUCTS } from "../../data/products";

function Shopping() {
    const [sortOrder, setSortOrder] = useState("default");
    const [category, setCategory] = useState("ALL");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 8;

            const { pageProducts, hasMore, totalCount } = useMemo(() => {
        const keyword = searchKeyword.trim().toLowerCase();
        let baseList = PRODUCTS;

        if (keyword === "") {   
            baseList = PRODUCTS.filter((p) => {
                if (category === "ALL") return true;
                return p.mainCategory === category;   
            });
        }

        const filteredByKeyword = baseList.filter((p) => {
            if (keyword === "") return true;  

            const name = (p.name || "").toLowerCase();
            const desc = (p.description || "").toLowerCase();
            const cat = (p.category || "").toLowerCase();  

            return (
                name.includes(keyword) ||
                desc.includes(keyword) ||
                cat.includes(keyword)
            );
        });

        const sorted = [...filteredByKeyword].sort((a, b) => {
            if (sortOrder === "price_asc") {
                return a.price - b.price;
            }
            if (sortOrder === "price_desc") {
                return b.price - a.price;
            }
            return a.id - b.id; 
        });

        const total = sorted.length;
        const startIdx = (currentPage - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const slice = sorted.slice(startIdx, endIdx);

        const hasMoreLocal = endIdx < total;

        return {
            pageProducts: slice,
            hasMore: hasMoreLocal,
            totalCount: total
        };
    }, [category, searchKeyword, sortOrder, currentPage]);


    const handleSearch = (keyword) => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
    };

    const handleSortChange = (order) => {
        setSortOrder(order);
        setCurrentPage(1);
    };

    const handleCategoryChange = (nextCategory) => {
        setCategory(nextCategory);
        setCurrentPage(1);
    };

    const handlePageChange = (nextPage) => {
        setCurrentPage(nextPage);
    };

    const loading = false; 

    const benefits = [
        { icon: freeDel, title: '무료 배송', desc: '5만원 이상 주문시' },
        { icon: shield, title: '품질 보장', desc: '엄선된 비건 제품만' },
        { icon: point, title: '포인트 적립', desc: '구매금액의 5% 적립' },
        { icon: gift, title: '선물 포장', desc: '무료 선물 포장 서비스' }
    ];

    return (
        <div className="bg-white w-full flex flex-col animate-fadeIn">
            <div className="w-full text-center space-y-6 mb-16 mt-40">
                <h1 className="text-6xl font-normal font-['Inter'] leading-[60px] tracking-tight text-primary-dark">
                    🌿 비건 스토어
                </h1>
                <p className="text-xl font-normal font-['Inter'] leading-7 text-gray-700">
                    자연과 함께하는 건강한 라이프스타일을 위한 엄선된 비건 제품들을 만나보세요
                </p>
            </div>

            <div className="flex justify-center items-center px-10 gap-6 mb-16">
                {benefits.map((benefit, idx) => (
                    <div
                        key={idx}
                        className="w-[230px] h-[180px] bg-white/90 rounded-[35px] shadow-2xl p-6 flex flex-col items-center justify-center gap-1 hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                    >
                        <img src={benefit.icon} alt={benefit.title} className="w-[90px] h-[90px]" />
                        <div className="text-center font-semibold font-['Nunito'] text-gray-900">
                            {benefit.title}
                        </div>
                        <div className="text-sm font-normal font-['Nunito'] text-gray-600">
                            {benefit.desc}
                        </div>
                    </div>
                ))}
            </div>

            <div className="min-h-screen bg-white pt-4 pb-[80px]">
                <div className="max-w-7xl mx-auto px-4 flex flex-col gap-8">
                    <SearchBar
                        onSearch={handleSearch}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        resetTrigger={category}
                        category={category}
                    />

                    <div className="w-full">
                        <CategoryTabs
                            selectedCategory={category}
                            onCategoryChange={handleCategoryChange}
                        />
                    </div>

                    <div className="w-full">
                        {loading ? (
                            <div className="text-center py-20">
                                <div className="text-lg text-gray-500">상품을 불러오는 중...</div>
                            </div>
                        ) : pageProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="text-lg text-gray-500">검색 결과가 없습니다.</div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-4 gap-6">
                                    {pageProducts.map((product, index) => (
                                        <ProductCard key={index} product={product} />
                                    ))}
                                </div>
                                <Pagination
                                    currentPage={currentPage}
                                    onPageChange={handlePageChange}
                                    hasMore={hasMore}
                                />
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Shopping;