// src/components/layout/Header.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo/logo.svg";

import home from "../../assets/nav/home.svg";
import homeColored from "../../assets/nav/homeColored.svg";
import challenge from "../../assets/nav/challenge.svg";
import challengeColored from "../../assets/nav/challengeColored.svg";
import community from "../../assets/nav/community.svg";
import communityColored from "../../assets/nav/communityColored.svg";
import shop from "../../assets/nav/shop.svg";
import shopColored from "../../assets/nav/shopColored.svg";
import map from "../../assets/nav/map.svg";
import mapColored from "../../assets/nav/mapColored.svg";


function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    // 로컬스토리지 기반 로그인 표시용 상태
    const [authUser, setAuthUser] = useState(null);

    // 경로가 바뀔 때마다 로컬스토리지에서 로그인 정보 다시 읽기
    useEffect(() => {
        try {
            const raw = localStorage.getItem("auth");
            setAuthUser(raw ? JSON.parse(raw) : null);
        } catch {
            setAuthUser(null);
        }
    }, [location.pathname]);

    const navItems = [
        { path: "/", label: "홈", icon: home, activeIcon: homeColored },
        { path: "/challenge", label: "챌린지", icon: challenge, activeIcon: challengeColored },
        { path: "/community", label: "커뮤니티", icon: community, activeIcon: communityColored },
        { path: "/store", label: "쇼핑몰", icon: shop, activeIcon: shopColored },
        { path: "/map", label: "식당 지도", icon: map, activeIcon: mapColored },
    ];

    // 단순 로그아웃: auth 키 제거 후 메인으로 이동
    const handleLogout = () => {
        /*localStorage.removeItem("auth");
        setAuthUser(null);
        navigate("/");
        */
        const ok = window.confirm("로그아웃하시겠습니까?");
       if (!ok) return; //사용자가 취소하면 아무것도 안함

       //실제 로그아웃 처리
        localStorage.removeItem("auth");

       //알림
        alert("로그아웃되었습니다.");

       //상태 반영 및 홈으로 이동
        setAuthUser(null);
        navigate("/");
    };

    return (
        <header className="bg-white backdrop-blur-sm border-b border-teal-100/50 shadow-[0_4px_12px_rgba(0,0,0,0.08)]">
            <div className="w-full h-20 px-4 pr-8">
                <div className="h-full flex items-center">
                    {/* 로고 */}
                    <Link to="/" className="flex items-center gap-2 flex-shrink-0 ml-4 w-[200px]">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl shadow-sm flex justify-center items-center">
                            <img src={logoImg} alt="veganing" className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-nunito text-primary-dark ml-1">Veganing</span>
                    </Link>

                    {/* 가운데 네비게이션 */}
                    <nav className="flex-1 flex justify-center items-center gap-3">
                        {navItems.map((item) => {
                            //const isActive = location.pathname === item.path;
                            const isActive =
                                item.path === "/"
                                    ? location.pathname === "/"
                                    : location.pathname.startsWith(item.path);
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 h-11 rounded-2xl flex items-center gap-2 font-nunito text-base transition-all duration-200 ${
                                        isActive
                                            ? "bg-gradient-to-r from-cyan-500 to-emerald-500 text-white shadow-lg"
                                            : "text-teal-600 hover:bg-gray-50"
                                    }`}
                                >
                                    {/* 활성일 땐 activeIcon, 아니면 icon */}
                                    <img
                                        src={isActive ? item.icon : item.activeIcon}
                                        alt=""
                                        className={`${["/community"].includes(item.path) ? "w-6 h-6" : "w-4 h-4"}`}
                                    />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* 우측 영역: 로그인/로그아웃 */}
                    <div className="min-w-[360px] pl-4 flex justify-end items-center gap-3 flex-nowrap">
                        {authUser ? (
                            <>
                                <div className="hidden md:flex items-center gap-2 px-3 h-9 bg-teal-50 rounded-2xl border border-teal-100">
                                    <span className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-500 to-emerald-500 text-white text-sm flex items-center justify-center">
                                        {(authUser.name || authUser.email || "유저").toString().charAt(0)}
                                    </span>
                                    <span className="text-sm text-gray-700">
                                        {authUser.name || authUser.email || "사용자"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => navigate("/mypage")}
                                    className="w-28 h-9 flex items-center justify-center
                                            bg-gradient-to-r from-cyan-500 to-emerald-500
                                            text-white rounded-2xl shadow-sm text-sm hover:opacity-90"
                                >
                                    마이페이지
                                </button>

                                {/*장바구니 버튼*/ }
                                <button
                                    type="button"
                                    onClick={() => navigate("/cart")}
                                    className="w-28 h-9 flex items-center justify-center
                                                bg-gradient-to-r from-cyan-500 to-emerald-500
                                                text-white rounded-2xl shadow-sm text-sm hover:opacity-90"
                                >
                                    장바구니
                                </button>


                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="px-3 h-9 bg-white rounded-2xl shadow-sm border-2 border-red-300 text-red-600 text-sm hover:bg-red-50"
                                >
                                    로그아웃
                                </button>
                            </>
                        ) : (
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="px-4 h-9 bg-white rounded-2xl shadow-sm border-2 border-cyan-500 text-teal-600 text-sm font-medium font-nunito hover:bg-gray-50 transition-colors"
                            >
                                로그인
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
