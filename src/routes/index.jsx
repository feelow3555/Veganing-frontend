import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layout/root-layout";

// Pages import
import Home from "../pages/home/Home";
import ChallengeChoice from "../pages/challenge/ChallengeChoice";
import ChallengeMain from "../pages/challenge/ChallengeMain";
import Shopping from "../pages/shopping/Shopping";
import ProductDetail from "../pages/shopping/ProductDetail"; 
import Restaurant from "../pages/restaurant/Restaurant";
import Community from "../pages/community/Community";
import NotFound from "../pages/NotFound";
import Login from "../pages/user/Login"; //로그인 페이지 라우트용 임포트
import SignUp from "../pages/user/SignUp.jsx"; //회원가입 페이지
import MyPage from "../pages/user/MyPage.jsx"; // 마이페이지 추가
import ProtectedRoute from "./ProtectedRoute";
import ForgotPassword from "../pages/user/ForgotPassword.jsx"; // [추가] 비밀번호 찾기 페이지
import CreatePost from "../pages/community/CreatePost"; // 게시글 작성 페이지


// Challenge Main Components import (경로 수정!)
import MealContainer from "../pages/challenge/mainComponents/todaysMealTab/MealContainer";
import ProgressContainer from "../pages/challenge/mainComponents/progressTab/ProgressContainer";
import RecipeTab from "../pages/challenge/mainComponents/challengeContent/RecipeTab";
import ShoppingTab from "../pages/challenge/mainComponents/challengeContent/ShoppingTab";
import CartPage from "../pages/user/CartPage.jsx";
import {OrderPage} from "../pages/user/OrderPage.jsx";


const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        //errorElement: <NotFound />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "challenge",
                element: <Navigate to="/challenge/choice" replace />,
            },
            {
                path: "challenge/choice",
                element: <ChallengeChoice />,
            },
            {
                path: "community",
                element: <Community />,
            },
            {
                path: "community/create",
                element: <CreatePost />,
            },
            {
                path: "store",
                element: <Shopping />,
            },
            {
                path: "store/:productId",
                element: <ProductDetail />,
            },
            {
                path: "map",
                element: <Restaurant />,
            },
            {
                path: "login", 
                element: <Login />, //login 라우트 추가
            },
            {
                path: "forgot-password",
                element: <ForgotPassword /> //비번찾기
            },
            {
                path: "signup",
                element: <SignUp />, //signup 라우트
            },
            {
                path: "mypage",
                element: (
                    <ProtectedRoute>
                        <MyPage />
                    </ProtectedRoute>
                ),
            },
            {
                path: "cart",
                element: <CartPage />
            },
            {
                path: "order",
                element: <OrderPage />
            },
            {
                path: "challenge/main",
                element: <ChallengeMain />,
                children: [
                    {
                        index: true,
                        element: <Navigate to="meal" replace />,
                    },
                    {
                        path: "meal",
                        element: <MealContainer />,
                    },
                    {
                        path: "progress",
                        element: <ProgressContainer />,
                    },
                    {
                        path: "recipe",
                        element: <RecipeTab />,
                    },
                    {
                        path: "shopping",
                        element: <ShoppingTab />,
                    },
                ],
            },
            { path: "*", element: <NotFound /> }, // ← 추가: 자식 라우트에서 404 처리
        ],
    },
]);

export default router;