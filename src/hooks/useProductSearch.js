import { useState, useEffect } from 'react';
import { getProducts } from '../api/backend';

function useProductSearch(initialCategory = 'food') {
    const [sortOrder, setSortOrder] = useState('sim');
    const [category, setCategory] = useState(initialCategory);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentQuery, setCurrentQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const categoryMap = {
        food: 'FOOD',
        book: 'BOOK',
        cosmetic: 'COSMETIC',
        supplement: 'SUPPLEMENT'
    };

    const fetchProducts = async (searchQuery = null, page = 1) => {
        setLoading(true);
        try {
            setCurrentQuery(searchQuery);
            const res = await getProducts(page - 1, 20);
            let items = res.data?.content || res.data || [];

            // 카테고리 필터
            const backendCategory = categoryMap[category];
            if (backendCategory) {
                items = items.filter(p => p.category === backendCategory);
            }

            // 검색어 필터
            if (searchQuery) {
                items = items.filter(p =>
                    p.name?.includes(searchQuery) || p.description?.includes(searchQuery)
                );
            }

            // 정렬
            const sorted = [...items].sort((a, b) => {
                if (sortOrder === 'asc') return a.price - b.price;
                if (sortOrder === 'dsc') return b.price - a.price;
                return 0;
            });

            setProducts(sorted);
            setHasMore(items.length === 20);
        } catch (error) {
            console.error('상품 불러오기 실패:', error);
            setProducts([]);
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setCurrentQuery('');
        setCurrentPage(1);
        fetchProducts(null, 1);
    }, [category]);

    useEffect(() => {
        setCurrentPage(1);
        fetchProducts(currentQuery || null, 1);
    }, [sortOrder]);

    const handleSearch = (query) => {
        setCurrentPage(1);
        fetchProducts(query, 1);
    };

    const handleSortChange = (sort) => setSortOrder(sort);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchProducts(currentQuery || null, newPage);
        window.scrollTo({ top: 800, behavior: 'smooth' });
    };

    const handleCategoryChange = (newCategory) => setCategory(newCategory);

    return {
        sortOrder, category, products, loading, currentPage, hasMore,
        handleSearch, handleSortChange, handlePageChange, handleCategoryChange
    };
}

export default useProductSearch;
