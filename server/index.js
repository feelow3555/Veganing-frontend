const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3001;

// CORS 설정 - React 개발 서버에서 접근 허용
app.use(cors({
    origin: 'http://localhost:5173'
}));
app.use(express.json());

// 네이버 쇼핑 검색 API
app.get('/api/naver/shopping', async (req, res) => {
    try {
        const { query, display = 20, start = 1, sort = 'sim' } = req.query;
        
        const response = await axios.get('https://openapi.naver.com/v1/search/shop.json', {
            params: { 
                query, 
                display,
                start,
                sort // sim, date, asc, dsc, count
            },
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Naver API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 네이버 도서 검색 API
app.get('/api/naver/book', async (req, res) => {
    try {
        const { query, display = 20, start = 1, sort = 'sim' } = req.query;
        
        const response = await axios.get('https://openapi.naver.com/v1/search/book.json', {
            params: { 
                query, 
                display,
                start,
                sort
            },
            headers: {
                'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET
            }
        });
        
        res.json(response.data);
    } catch (error) {
        console.error('Naver Book API Error:', error.message);
        res.status(500).json({ error: error.message });
    }
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});