// React 컴포넌트를 만들기 위해 React 임포트
import React from 'react';
// 라우팅에서 리다이렉트(Navigate)와 현재 위치(useLocation) 훅을 불러옴
import { Navigate, useLocation } from 'react-router-dom';
// 우리가 만든 전역 인증 컨텍스트에서 user 상태를 읽기 위해 훅을 불러옴
import { useAuth } from '../components/auth/AuthContext';

// 보호 라우트 컴포넌트: 로그인 안 된 사용자를 차단하고 /login 으로 보내는 문지기
export default function ProtectedRoute({ children }) {
    // 전역 인증 상태에서 user(로그인된 사용자 객체)를 가져옴; null이면 비로그인 상태
    const { user } = useAuth();
    // 현재 사용자가 접근하려는 경로 정보를 얻기 위해 useLocation 사용
    const loc = useLocation();

    // user가 없으면(=로그인 안 됨) /login 으로 리다이렉트
    if (!user) {
        // Navigate로 페이지를 교체(replace)하며 이동
        // state에 from을 넣어주면, 로그인 후 원래 오려고 했던 경로로 보낼 때 사용할 수 있음
        return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
    }

    // user가 있으면(=로그인됨) 보호된 실제 화면(children)을 그대로 보여줌
    return children;
}
