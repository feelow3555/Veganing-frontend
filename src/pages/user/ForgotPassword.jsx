import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

import { Leaf, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();        
    if (isLoading) return;    
    setIsLoading(true);        

    setTimeout(() => {
        setIsLoading(false);      
        setIsSent(true);          
    }, 800);
    };

    return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-teal-50/50 via-emerald-50/50 to-cyan-50/50">
        <motion.div
        initial={{ opacity: 0, y: 20 }}   
        animate={{ opacity: 1, y: 0 }}    
        transition={{ duration: 0.4 }}    
        className="w-full max-w-md"     
        >
        <Card className="border-0 shadow-2xl shadow-teal-100/50 rounded-3xl overflow-hidden">
            <CardHeader className="space-y-4 bg-gradient-to-br from-teal-400 to-emerald-400 text-white pb-8 pt-10">
            <div className="flex justify-center mb-2">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                <Leaf className="w-10 h-10 text-white" /> 
                </div>
            </div>

            <CardTitle className="text-3xl text-center">비밀번호 찾기</CardTitle>

            <CardDescription className="text-center text-white/90 text-base">
                {isSent ? "이메일을 확인해주세요" : "가입하신 이메일을 입력해주세요"}
            </CardDescription>
            </CardHeader>

            <CardContent className="pt-8 pb-8 px-8">
            {!isSent ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700">
                    이메일
                    </Label>

                    <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500" />
                    <Input
                        id="email"                       
                        type="email"                     
                        placeholder="your@email.com"    
                        value={email}                   
                        onChange={(e) => setEmail(e.target.value)} 
                        className="pl-12 h-12 rounded-2xl border-2 border-teal-100 focus:border-teal-400 bg-teal-50/30"
                        required                      
                    />
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                    입력하신 이메일로 비밀번호 재설정 링크를 보내드립니다.
                    </p>
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-500 hover:to-emerald-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                    {isLoading ? "전송 중..." : "재설정 링크 보내기"}
                </Button>
                </form>
            ) : (
                <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6 text-center py-4"
                >
                <div className="flex justify-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-xl text-gray-800">이메일을 확인해주세요!</h3>
                    <p className="text-gray-600">
                    <span className="text-teal-600">{email}</span> 으로 재설정 링크를 보냈습니다.
                    </p>
                    <p className="text-sm text-gray-500 pt-2">
                    메일이 보이지 않으면 스팸함도 확인해주세요.
                    </p>
                </div>
                </motion.div>
            )}

            <div className="mt-8 pt-6 border-t-2 border-gray-100">
                <button
                type="button"                      
                onClick={() => navigate("/login")}  
                className="w-full flex items-center justify-center gap-2 text-teal-600 hover:text-teal-700 transition-colors"
                >
                <ArrowLeft className="w-4 h-4" />
                <span>로그인으로 돌아가기</span>
                </button>
            </div>
            </CardContent>
        </Card>
        </motion.div>
    </div>
    );
}
