import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';

function SearchBar({ onSearch, sortOrder, onSortChange, resetTrigger, category }) {
    const [query, setQuery] = useState('');

    useEffect(() => {
        setQuery('');
    }, [resetTrigger]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const isBookCategory = category === 'book';
    const isRestaurantCategory = category === 'restaurant'

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-2xl p-6 flex flex-col">
            <form onSubmit={handleSubmit} className="flex gap-3 mb-4">
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="제품명, 브랜드, 키워드로 검색해보세요..."
                        className="w-full h-12 px-4 pr-12 bg-gray-50 rounded-2xl border-2 border-gray-200 text-sm font-normal font-['Inter'] text-gray-900 placeholder:text-gray-500 focus:outline-none focus:border-emerald-400"
                    />
                    <button
                        type="submit"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-emerald-600"
                    >
                        <Search size={20} />
                    </button>
                </div>
            </form>

            {!isBookCategory && !isRestaurantCategory && (
                <div className="flex gap-2">
                    <button
                        onClick={() => onSortChange('price_asc')}
                        className={`px-4 py-2 rounded-xl text-sm font-normal font-['Inter'] leading-tight transition-colors ${
                            sortOrder === 'price_asc'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-neutral-950 hover:bg-gray-200'
                        }`}
                    >
                        낮은 가격순
                    </button>
                    <button
                        onClick={() => onSortChange('price_desc')}
                        className={`px-4 py-2 rounded-xl text-sm font-normal font-['Inter'] leading-tight transition-colors ${
                            sortOrder === 'price_desc'
                                ? 'bg-emerald-500 text-white'
                                : 'bg-gray-100 text-neutral-950 hover:bg-gray-200'
                        }`}
                    >
                        높은 가격순
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchBar;