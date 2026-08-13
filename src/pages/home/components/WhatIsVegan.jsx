import { Card, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma-temp/ImageWithFallback";
import { Leaf, Heart, Globe, Utensils, Sprout, Shield } from "lucide-react";
import { motion } from "motion/react";
const veganPrinciples = [
    {
        icon: Heart,
        title: "동물 보호",
        description: "모든 동물의 권리를 존중하고 동물성 제품을 사용하지 않습니다."
    },
    {
        icon: Globe,
        title: "환경 보호",
        description: "지구 환경을 위해 지속 가능한 생활 방식을 추구합니다."
    },
    {
        icon: Sprout,
        title: "건강한 삶",
        description: "식물성 식품으로 더 건강하고 활기찬 삶을 만들어갑니다."
    }
];

export default function WhatIsVegan() {
    return (
        <section className="py-24 relative overflow-hidden">
            { }
            <motion.div
                className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-emerald-200 to-cyan-200 rounded-full blur-3xl opacity-40"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0]
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />
            <motion.div
                className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-teal-200 to-emerald-200 rounded-full blur-3xl opacity-30"
                animate={{
                    x: [0, -40, 0],
                    y: [0, 40, 0]
                }}
                transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="container mx-auto px-4">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <Badge variant="outline" className="mb-6 bg-white/95 border-2 border-teal-200 text-teal-600 rounded-full px-5 py-2 shadow-lg">
                        <Leaf className="w-4 h-4 mr-2 text-teal-600" />
                        비건이란?
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-700 bg-clip-text text-transparent mb-6">
                        식물 기반의
                        <span className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent block">생활 철학</span>
                    </h2>
                    <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                        비건(Vegan)은 단순한 식단이 아닙니다. 동물을 해치지 않고,
                        환경을 보호하며, 건강한 삶을 추구하는 전체적인 라이프스타일입니다.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="relative">
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                transition={{ type: "spring", stiffness: 300 }}
                            >
                                <ImageWithFallback
                                    src="https://images.unsplash.com/photo-1608474786042-baee07c9a4b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwbGFudCUyMGJhc2VkJTIwZGlldCUyMGJlbmVmaXRzfGVufDF8fHx8MTc1OTA3NzU3MHww&ixlib=rb-4.1.0&q=80&w=1080"
                                    alt="식물성 식품의 다양성"
                                    className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                                />
                            </motion.div>

                            { }
                            <motion.div
                                className="absolute -top-6 -right-6 z-10"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl ring-2 ring-teal-100">
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                                                <Utensils className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="font-bold text-2xl bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">40,000+</div>
                                            <div className="text-sm text-gray-600">식물성 식품 종류</div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="space-y-8"
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                    >
                        <div className="space-y-6">
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
                                비건 라이프의 핵심 가치
                            </h3>
                            <p className="text-lg text-gray-700 leading-relaxed">
                                비건 생활은 세 가지 핵심 원칙을 바탕으로 합니다.
                                이 원칙들이 조화롭게 어우러져 더 나은 세상을 만드는 데 기여합니다.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {veganPrinciples.map((principle, index) => {
                                const Icon = principle.icon;
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.2, duration: 0.6 }}
                                        viewport={{ once: true }}
                                        whileHover={{ x: 10 }}
                                    >
                                        <Card className="border-l-4 border-l-teal-400 hover:shadow-2xl transition-all duration-300 rounded-2xl bg-white/80 backdrop-blur-sm">
                                            <CardContent className="p-6">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-14 h-14 bg-gradient-to-br from-teal-100 to-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                                                        <Icon className="w-7 h-7 text-teal-600" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-900 mb-2">
                                                            {principle.title}
                                                        </h4>
                                                        <p className="text-gray-600 leading-relaxed">
                                                            {principle.description}
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                { }
                <motion.div
                    className="bg-white/70 backdrop-blur-lg rounded-[3rem] p-12 shadow-2xl ring-4 ring-white/50"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                >
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent mb-4">
                            전 세계 비건 트렌드
                        </h3>
                        <p className="text-lg text-gray-700">
                            전 세계적으로 비건 라이프스타일을 선택하는 사람들이 급속히 증가하고 있습니다.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { number: "79M", label: "전 세계 비건 인구", icon: "🌍" },
                            { number: "600%", label: "지난 3년간 증가율", icon: "📈" },
                            { number: "25%", label: "젊은 세대 참여율", icon: "👥" },
                            { number: "15B", label: "비건 시장 규모 (달러)", icon: "💰" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center bg-white/80 rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                viewport={{ once: true }}
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent mb-2">{stat.number}</div>
                                <div className="text-sm text-gray-600">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
