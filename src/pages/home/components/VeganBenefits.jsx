import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { ImageWithFallback } from "../figma-temp/ImageWithFallback";
import { Heart, Zap, Shield, Sparkles, TrendingUp, Clock, Brain, Activity } from "lucide-react";
import { motion } from "motion/react";

const healthBenefits = [
  {
    icon: Heart,
    title: "심혈관 건강",
    description: "콜레스테롤 수치 개선과 심장 질환 위험 감소",
    improvement: 85,
    color: "text-red-500 bg-red-50"
  },
  {
    icon: Zap,
    title: "에너지 증가",
    description: "지속적이고 안정적인 에너지 공급",
    improvement: 92,
    color: "text-yellow-500 bg-yellow-50"
  },
  {
    icon: Shield,
    title: "면역력 강화",
    description: "항산화 성분으로 면역 시스템 강화",
    improvement: 78,
    color: "text-blue-500 bg-blue-50"
  },
  {
    icon: Brain,
    title: "뇌 기능 향상",
    description: "집중력과 기억력 개선 효과",
    improvement: 81,
    color: "text-purple-500 bg-purple-50"
  }
];

const lifestyleBenefits = [
  {
    icon: Sparkles,
    title: "체중 관리",
    description: "자연스럽고 건강한 체중 유지"
  },
  {
    icon: Clock,
    title: "수명 연장",
    description: "평균 수명 3-6년 증가 효과"
  },
  {
    icon: Activity,
    title: "근육 회복",
    description: "운동 후 빠른 회복과 염증 감소"
  },
  {
    icon: TrendingUp,
    title: "피부 개선",
    description: "맑고 건강한 피부톤 개선"
  }
];

export function VeganBenefits() {

  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-br from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-40"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -50, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-0 w-64 h-64 bg-gradient-to-br from-cyan-200 to-emerald-200 rounded-full blur-3xl opacity-30"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0]
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
          <Badge variant="outline" className="mb-6 bg-white/95 border-2 border-emerald-200 text-emerald-600 rounded-full px-5 py-2 shadow-lg">
            <Sparkles className="w-4 h-4 mr-2 text-emerald-600" />
            놀라운 효과
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 bg-clip-text text-transparent mb-6">
            비건의
            <span className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-700 bg-clip-text text-transparent block">건강 혜택</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            과학적으로 입증된 비건 라이프스타일의 놀라운 건강 효과를 경험해보세요.
            몸과 마음이 한층 더 건강해지는 변화를 느낄 수 있습니다.
          </p>
        </motion.div>

        {/* Health Benefits with Progress */}
        <div className="mb-20">
          <motion.h3
            className="text-3xl font-bold text-center bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            건강 지표 개선 효과
          </motion.h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {healthBenefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -10 }}
                >
                  <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm rounded-3xl">
                    <CardHeader className="pb-4">
                      <div className={`w-14 h-14 rounded-2xl ${benefit.color} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-7 h-7" />
                      </div>
                      <CardTitle className="text-lg">{benefit.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                        {benefit.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-700">개선율</span>
                          <span className="text-sm font-bold text-emerald-600">{benefit.improvement}%</span>
                        </div>
                        <Progress value={benefit.improvement} className="h-3 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Lifestyle Benefits */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent mb-4">
                  라이프스타일의 변화
                </h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  비건 생활은 단순히 식단의 변화가 아닙니다.
                  전반적인 삶의 질이 향상되는 놀라운 경험을 할 수 있습니다.
                </p>
              </div>

              <div className="grid gap-4">
                {lifestyleBenefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.5 }}
                      viewport={{ once: true }}
                      whileHover={{ x: 10 }}
                    >
                      <Card className="border-l-4 border-l-emerald-400 hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm rounded-2xl">
                        <CardContent className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center shadow-md">
                              <Icon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">{benefit.title}</h4>
                              <p className="text-sm text-gray-600">{benefit.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
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
                  alt="건강한 비건 라이프스타일"
                  className="w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                />
              </motion.div>

              {/* Floating testimonial */}
              <motion.div
                className="absolute -bottom-6 -left-6 z-10"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 max-w-sm rounded-3xl ring-2 ring-emerald-100">
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-2xl flex items-center justify-center shadow-lg">
                          <Heart className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">김민정님</div>
                          <div className="text-sm text-emerald-600">6개월 경험자</div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 italic leading-relaxed">
                        "에너지가 넘치고 피부가 맑아졌어요.
                        가장 좋은 선택이었습니다!"
                      </p>
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">⭐</span>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-white/80 backdrop-blur-lg rounded-[3rem] p-12 shadow-2xl ring-4 ring-emerald-100">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
              지금 바로 건강한 변화를 시작하세요
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              30일 챌린지를 통해 이 모든 혜택을 직접 경험해보세요.
              전문가의 가이드와 함께라면 더욱 쉽고 안전합니다.
            </p>
            <Button
              size="lg"
              onClick={() => navigate("/challenge/main")}
              className="pointer-events-auto bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white shadow-xl shadow-emerald-200 hover:shadow-2xl transition-all duration-300 rounded-2xl px-8"
            >
              <Heart className="w-5 h-5 mr-2" />
              나의 건강 여정 시작하기
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
