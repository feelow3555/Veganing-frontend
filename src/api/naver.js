export async function searchNaverShopping(query, display = 20, start = 1, sort = 'sim') {
    try {
        const response = await fetch(
            `http://localhost:3001/api/naver/shopping?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`
        );
        
        if (!response.ok) {
            throw new Error('검색 실패');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Naver Shopping API Error:', error);
        throw error;
    }
}

export async function searchNaverBook(query, display = 20, start = 1, sort = 'sim') {
    try {
        const response = await fetch(
            `http://localhost:3001/api/naver/book?query=${encodeURIComponent(query)}&display=${display}&start=${start}&sort=${sort}`
        );
        
        if (!response.ok) {
            throw new Error('검색 실패');
        }
        
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Naver Book API Error:', error);
        throw error;
    }
}