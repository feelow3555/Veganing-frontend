
import { CarbonFootprint } from "./components/CarbonFootprint";
import HeroSection from "./components/HeroSection";
import { VeganBenefits } from "./components/VeganBenefits";
import { VeganRecipes } from "./components/VeganRecipes";
import WhatIsVegan from "./components/WhatIsVegan";
import React, { useEffect, useState } from "react";
import Login from "../user/Login.jsx";
function Home() {

    const [showLogin, setShowLogin] = useState(false);


    useEffect(() => {
        window.openLogin = () => setShowLogin(true);
        return () => { delete window.openLogin; };
    }, []);


    const handleLoginSuccess = () => {
        //TODO : 토큰 저장/유저 상태 갱신 등 실제 로직 추가 가능
        setShowLogin(false);
    };


    const handleSignupClick = () => {
        alert("추후 연결");
    };

    //로그인 화면을 띄워야 할 때 : 홈 대신 Login을 전면 렌더
    if (showLogin) {
        return (
            <Login
                onSignupClick={handleSignupClick}
                onLoginSuccess={handleLoginSuccess}
            />
        );
    }


    return (
        <>

            <HeroSection />
            <WhatIsVegan />
            <VeganBenefits />
            <CarbonFootprint />
            <VeganRecipes />
        </>
    );
}

export default Home;

