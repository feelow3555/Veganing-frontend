import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Calendar } from "lucide-react";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { getHomeHeroData } from "../../../api/backend";

// 🔥 백엔드 없을 때 사용할 더미데이터
const fallbackHeroData = {
    images: [
        "https://images.unsplash.com/photo-1607264021653-0a884a9740cd?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1692194741596-46ff868c4509?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1642497394078-4794e837019c?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1568158958563-c13c713d69f1?auto=format&fit=crop&w=1200&q=80",
        "https://images.unsplash.com/photo-1675092789086-4bd2b93ffc69?auto=format&fit=crop&w=1200&q=80"
    ],
    participants: 15000,
    successRate: 89,
    satisfaction: 4.9,
};

export default function HeroSection() {

    const navigate = useNavigate();

    const [heroData, setHeroData] = useState({
        images: [],
        participants: 0,
        successRate: 0,
        satisfaction: 0,
    });

    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    // 🔥 API + fallback 적용
    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await getHomeHeroData(token);

                // 성공 시 API 데이터 사용 / 일부 null 이면 fallback 병합
                setHeroData({
                    images: response.images?.length ? response.images : fallbackHeroData.images,
                    participants: response.participants ?? fallbackHeroData.participants,
                    successRate: response.successRate ?? fallbackHeroData.successRate,
                    satisfaction: response.satisfaction ?? fallbackHeroData.satisfaction,
                });
            } catch (err) {
                console.error("HeroSection 데이터 조회 실패: 더미 데이터 사용", err);
                setHeroData(fallbackHeroData); // 실패하면 더미데이터 적용
            }

            setLoading(false);
        };

        fetchHeroData();
    }, []);

    // 🔥 이미지 자동전환
    useEffect(() => {
        if (!heroData.images.length) return;

        const interval = setInterval(() => {
            setCurrentImage((i) => (i + 1) % heroData.images.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [heroData.images]);

    return (
        <section className="w-full min-h-[90vh] flex items-center relative mt-20">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 px-6 py-16 items-center">

                {/* LEFT TEXT */}
                <div className="space-y-6">
                    <Badge variant="outline" className="border-teal-300 text-teal-700 bg-white">
                        🌱 지속 가능한 라이프스타일
                    </Badge>

                    <h1 className="text-5xl font-extrabold leading-tight">
                        <span className="text-teal-600">30일 비건</span><br />
                        <span className="text-emerald-600">챌린지</span>
                    </h1>

                    <p className="text-gray-600 text-lg max-w-md">
                        건강한 몸과 지구를 위한 첫 걸음.
                        전문가와 함께하는 30일 비건 라이프스타일 프로그램입니다.
                    </p>

                    {/* BUTTONS */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <Button
                            className="rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 text-white shadow-md"
                            onClick={() => navigate("/challenge")}
                        >
                            <Calendar size={18} className="mr-2" />
                            30일 챌린지 시작하기
                            <ArrowRight size={16} className="ml-2" />
                        </Button>

                        <Button
                            variant="outline"
                            className="rounded-2xl border-teal-400 text-teal-600 hover:bg-teal-50"
                            onClick={() => navigate("/challenge/choice")}
                        >
                            체험해보기
                        </Button>
                    </div>

                    {/* STAT CARDS */}
                    <div className="grid grid-cols-3 gap-4 pt-6">
                        {loading ? (
                            <>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-[80px]" />
                                ))}
                            </>
                        ) : (
                            <>
                                <StatCard value={`${heroData.participants.toLocaleString()}+`} label="참여자" />
                                <StatCard value={`${heroData.successRate}%`} label="성공률" />
                                <StatCard value={`${heroData.satisfaction}★`} label="만족도" />
                            </>
                        )}
                    </div>
                </div>

                {/* RIGHT IMAGE */}
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl">
                    {loading || heroData.images.length === 0 ? (
                        <div className="w-full h-full bg-gray-100 animate-pulse" />
                    ) : (
                        <AnimatePresence mode="wait">
                            <motion.img
                                key={currentImage}
                                src={heroData.images[currentImage]}
                                alt="vegan"
                                className="absolute inset-0 w-full h-full object-cover"
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.8 }}
                            />
                        </AnimatePresence>
                    )}
                </div>

            </div>
        </section>
    );
}

function StatCard({ value, label }) {
    return (
        <div className="text-center bg-white shadow-md rounded-xl py-4">
            <div className="text-2xl font-bold text-teal-600">{value}</div>
            <div className="text-gray-500 text-sm">{label}</div>
        </div>
    );
}
