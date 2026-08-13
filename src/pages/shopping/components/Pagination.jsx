function Pagination({ currentPage, onPageChange, hasMore }) {
    return (
        <div className="flex justify-center items-center gap-4 py-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-6 py-3 rounded-xl text-sm font-medium font-['Inter'] transition-colors ${
                    currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-emerald-50 shadow-lg'
                }`}
            >
                ← 이전
            </button>
            
            <span className="px-4 py-2 text-sm font-medium font-['Inter'] text-gray-900">
                {currentPage} 페이지
            </span>
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasMore}
                className={`px-6 py-3 rounded-xl text-sm font-medium font-['Inter'] transition-colors ${
                    !hasMore
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-900 hover:bg-emerald-50 shadow-lg'
                }`}
            >
                다음 →
            </button>
        </div>
    );
}

export default Pagination;