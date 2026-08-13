import { useState, useEffect } from 'react';

/**
 * localStorage를 React state처럼 사용하는 hook
 * window 객체를 사용하여 브라우저 저장소 역할 대체
 */
function useLocalStorage(key, initialValue) {
    // window 객체에서 초기값 가져오기
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window[key];
            return item !== undefined ? item : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    // 값 업데이트 함수
    const setValue = (value) => {
        try {
            // 함수형 업데이트 지원
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            
            setStoredValue(valueToStore);
            window[key] = valueToStore;
            
            // 커스텀 이벤트 발생 (다른 컴포넌트에서 감지 가능)
            window.dispatchEvent(new CustomEvent(`${key}Updated`, { 
                detail: valueToStore 
            }));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;