import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { motion } from "motion/react";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../../components/ui/card";

import { Leaf, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { login, saveToken, saveUser } from "../../api/backend";
import { setAuth } from "../../hooks/auth";

function Login({ onSignupClick, onLoginSuccess }) {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) return;
        
        setError("");
        setIsLoading(true);

        try {
            const response = await login({
                email: email.trim(),
                password: password,
            });

            if (response.token) {
                saveToken(response.token);
            }
            if (response.user) {
                saveUser(response.user);
                localStorage.setItem("auth", JSON.stringify({ 
                    email: response.user.email, 
                    name: response.user.nickname || response.user.name 
                }));
                
                setAuth({
                    email: response.user.email,
                    name: response.user.nickname || response.user.name,
                    id: response.user.id,
                });
            }

            if (typeof onLoginSuccess === "function") onLoginSuccess();

            alert("로그인에 성공하셨습니다!");
            navigate("/"); 
        } catch (err) {
            console.error("로그인 실패:", err);
            const errorMessage = err.message || "로그인 중 오류가 발생했습니다.";
            setError(errorMessage);
            alert(`로그인 실패: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-teal-50/50 via-emerald-50/50 to-cyan-50/50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md"
            >
                <Card className="border-0 shadow-2xl shadow-teal-100/50 rounded-3xl overflow-hidden">
                    <CardHeader className="space-y-4 bg-gradient-to-br from-teal-400 to-emerald-400 text-white pb-8 pt-10">
                        <div className="flex justify-center mb-2">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                                <Leaf className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <CardTitle className="text-3xl text-center">veganing</CardTitle>
                        <CardDescription className="text-center text-white/90 text-base">
                            비건 라이프스타일과 함께하세요
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-8 pb-8 px-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700">이메일</Label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="vegan@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-12 h-12 rounded-2xl border-2 border-teal-100 focus:border-teal-400 bg-teal-50/30"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700">비밀번호</Label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-12 pr-12 h-12 rounded-2xl border-2 border-teal-100 focus:border-teal-400 bg-teal-50/30"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors"
                                        aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 rounded border-2 border-teal-300 text-teal-500 focus:ring-teal-400"
                                    />
                                    <span className="text-gray-600">로그인 상태 유지</span>
                                </label>
                                <button
                                    type="button"                         
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-teal-600 hover:text-teal-700 transition-colors underline-offset-2 hover:underline"
                                >
                                비밀번호 찾기
                                </button>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                                    <p className="text-sm text-red-600 text-center">{error}</p>
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                {isLoading ? "로그인 중..." : "로그인"}
                            </Button>
                        </form>

                        <div className="mt-8 pt-6 border-t-2 border-gray-100">
                            <p className="text-center text-gray-600">
                                아직 회원이 아니신가요?{" "}
                                <button
                                    type="button"
                                    onClick={() => navigate("/signup")}
                                    className="bg-transparent p-0 m-0 border-0 text-teal-600 hover:text-teal-700 font-semibold transition-colors underline-offset-2 hover:underline cursor-pointer"
                                    aria-label="회원가입 페이지로 이동"
                                >
                                    회원가입
                                </button>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}


Login.propTypes = {
    onSignupClick: PropTypes.func,
    onLoginSuccess: PropTypes.func,
};

Login.defaultProps = {
    onSignupClick: () => {},
    onLoginSuccess: () => {},
};

export default Login;
