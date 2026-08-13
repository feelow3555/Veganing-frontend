import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // /challenge/main 하위 탭 이동은 스크롤 유지
        if (pathname.startsWith('/challenge/main/')) {
            return;
        }
        
        // 그 외 페이지 이동은 스크롤 맨 위로
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default ScrollToTop;