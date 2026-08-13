import React, { useState } from "react";                 
import { useNavigate } from "react-router-dom";          
import { motion } from "motion/react";                   

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";

import { Leaf, Mail, Lock, Eye, EyeOff, User, CheckCircle2, MapPin } from "lucide-react";
import { signup, saveToken, saveUser } from "../../api/backend";
import { setAuth } from "../../hooks/auth";

export default function SignUp() {
  const [formData, setFormData] = useState({
    name: "",             
    email: "",             
    password: "",          
    confirmPassword: "",   
    address: "",           
    veganType: "flexitarian", 
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    if (password.length < 6) return { strength: 1, text: "약함", color: "bg-red-400" };
    if (password.length < 10) return { strength: 2, text: "보통", color: "bg-yellow-400" };
    return { strength: 3, text: "강함", color: "bg-green-400" };
  };

  const strength = passwordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreedToTerms) {
      setError("이용약관에 동의해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await signup({
        email: formData.email.trim(),
        password: formData.password,
        nickname: formData.name.trim(),
        veganType: formData.veganType || "flexitarian",
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

      alert("회원가입이 완료되었습니다! 자동으로 로그인되었습니다.");
      navigate("/"); 
    } catch (err) {
      console.error("회원가입 실패:", err);
      const errorMessage = err.message || "회원가입 중 오류가 발생했습니다.";
      setError(errorMessage);
      alert(`회원가입 실패: ${errorMessage}`);
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
        className="w-full max-w-2xl"
      >
        <Card className="border-0 shadow-2xl shadow-teal-100/50 rounded-3xl overflow-hidden">
          <CardHeader className="space-y-4 bg-gradient-to-br from-emerald-400 to-teal-400 text-white pb-8 pt-10">
            <div className="flex justify-center mb-2">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-lg">
                <Leaf className="w-10 h-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl text-center">veganing에 가입하기</CardTitle>
            <CardDescription className="text-center text-white/90 text-base">
              지속 가능한 라이프스타일의 시작
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-8 pb-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">이름</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="pl-12 h-12 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-12 h-12 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">비밀번호</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-12 pr-12 h-12 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3].map((level) => (
                          <div
                            key={level}
                            className={`h-1.5 flex-1 rounded-full transition-all ${
                              level <= strength.strength ? strength.color : "bg-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      {strength.text && (
                        <p className="text-xs text-gray-600">비밀번호 강도: {strength.text}</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-gray-700">비밀번호 확인</Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-12 pr-12 h-12 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-emerald-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formData.confirmPassword && (
                    <div className="flex items-center gap-2 mt-1">
                      {formData.password === formData.confirmPassword ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <p className="text-xs text-green-600">비밀번호가 일치합니다</p>
                        </>
                      ) : (
                        <p className="text-xs text-red-600">비밀번호가 일치하지 않습니다</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-700">주소</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="서울시 강남구 비건로 123"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="pl-12 h-12 rounded-2xl border-2 border-emerald-100 focus:border-emerald-400 bg-emerald-50/30"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="flex items-start space-x-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="w-5 h-5 rounded border-2 border-emerald-300 text-emerald-500 focus:ring-emerald-400 mt-0.5"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">이용약관</a> 및{" "}
                    <a href="#" className="text-emerald-600 hover:text-emerald-700 font-semibold">개인정보처리방침</a>
                    에 동의합니다.
                  </span>
                </label>
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600 text-center">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || !agreedToTerms}
                className="w-full h-12 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t-2 border-gray-100">
              <p className="text-center text-gray-600">
                이미 회원이신가요?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors underline-offset-2 hover:underline"
                >
                  로그인
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
