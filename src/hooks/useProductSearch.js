import { useState, useEffect } from 'react';
import { searchNaverShopping, searchNaverBook } from '../api/naver';

/**
 * 상품 검색, 정렬, 페이지네이션을 관리하는 hook
 */
function useProductSearch(initialCategory = 'food') {
    const [sortOrder, setSortOrder] = useState('sim');
    const [category, setCategory] = useState(initialCategory);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentQuery, setCurrentQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categoryKeywords = {
        food: '비건 식품',
        book: '비건 도서',
        cosmetic: '비건 화장품',
        supplement: '비건 영양제'
    };

    // 상품 가져오기
    const fetchProducts = async (searchQuery = null, page = 1) => {
        setLoading(true);
        try {
            let query;
            
            if (searchQuery) {
                const categoryWord = categoryKeywords[category].replace('비건 ', '');
                query = `비건 ${categoryWord} ${searchQuery}`;
            } else {
                query = categoryKeywords[category];
            }
            
            setCurrentQuery(searchQuery);
            
            const start = (page - 1) * 20 + 1;
            
            const data = category === 'book'
                ? await searchNaverBook(query, 20, start, 'sim')
                : await searchNaverShopping(query, 20, start, sortOrder);

            const formattedProducts = data.items.map(item => ({
                title: item.title.replace(/<\/?[^>]+(>|$)/g, ""),
                price: category === 'book' ? parseInt(item.discount || item.price) : parseInt(item.lprice),
                image: item.image,
                brand: category === 'book' ? item.publisher : (item.brand || item.mallName),
                link: item.link
            }));

            const sortedProducts = [...formattedProducts].sort((a, b) => {
                if (sortOrder === 'asc') return a.price - b.price;
                if (sortOrder === 'dsc') return b.price - a.price;
                return 0;
            });

            setProducts(sortedProducts);
            setHasMore(data.items.length === 20);
        } catch (error) {
            console.error('상품 불러오기 실패:', error);
            setProducts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    // 카테고리 변경 시
    useEffect(() => {
        setCurrentQuery('');
        setCurrentPage(1);
        fetchProducts(null, 1);
    }, [category]);

    // 정렬 변경 시
    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(currentQuery || null, 1);
    }, [sortOrder]);

    // 검색 핸들러
    const handleSearch = (query) => {
        setCurrentPage(1);
        fetchProducts(query, 1);
    };

    // 정렬 변경 핸들러
    const handleSortChange = (sort) => {
        setSortOrder(sort);
    };

    // 페이지 변경 핸들러
    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchProducts(currentQuery || null, newPage);
        
        // 상단에서 800px 아래로 스크롤
        window.scrollTo({ top: 800, behavior: 'smooth' });
    };

    // 카테고리 변경 핸들러
    const handleCategoryChange = (newCategory) => {
        setCategory(newCategory);
    };

    return {
        // 상태
        sortOrder,
        category,
        products,
        loading,
        currentPage,
        hasMore,
        
        // 액션
        handleSearch,
        handleSortChange,
        handlePageChange,
        handleCategoryChange
    };
}

export default useProductSearch;