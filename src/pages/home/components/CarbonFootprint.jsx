// Option A — Tailwind 유지+간소화
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useNavigate } from "react-router-dom";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ImageWithFallback } from "../figma-temp/ImageWithFallback";
import { Globe, Car, Droplets, TreePine, Recycle, Factory, Zap } from "lucide-react";
import { motion } from "motion/react";

const sectionTitle = "text-4xl md:text-6xl font-bold text-gray-900 mb-6";
const subText = "text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed";
const wrapper = "container mx-auto px-4";
const shadowBox = "bg-white rounded-3xl p-12 shadow-xl";
const iconCircle = "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4";

const carbonImpacts = [
    { icon: Factory, title: "온실가스 감소", before: "14.5%", after: "2.3%" },
    { icon: Droplets, title: "물 절약", before: "15,415L", after: "322L" },
    { icon: TreePine, title: "토지 사용 감소", before: "164㎡", after: "2.8㎡" },
    { icon: Zap, title: "에너지 효율", before: "25kcal", after: "2kcal" }
];

const dailyImpact = [
    { icon: Car, value: "2.9kg CO₂", desc: "탄소 절약", eq: "≈ 7km 자동차" },
    { icon: Droplets, value: "4,164L", desc: "물 절약", eq: "≈ 55분 샤워" },
    { icon: TreePine, value: "3.3㎡", desc: "산림 보호", eq: "≈ 작은 방" },
    { icon: Recycle, value: "75%", desc: "자원 효율", eq: "≈ 4배 효율" }
];

export function CarbonFootprint() {

    const navigate = useNavigate();

    return (
        <section className="py-24 bg-gradient-to-br from-blue-50 via-green-50 to-emerald-50">
            <div className={wrapper}>

                {/* TITLE */}
                <div className="text-center mb-20">
                    <Badge variant="outline" className="mb-6 bg-blue-50 border-blue-200">
                        <Globe className="w-4 h-4 mr-2 text-blue-600" />
                        환경 영향
                    </Badge>

                    <h2 className={sectionTitle}>
                        지구를 위한 <span className="text-blue-600 block">탄소발자국 줄이기</span>
                    </h2>
                    <p className={subText}>
                        당신의 식단 선택이 지구 환경에 미치는 영향을 알아보세요.
                    </p>
                </div>

                {/* IMAGE + STATS */}
                <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
                    <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }}>
                        <ImageWithFallback
                            src="https://images.unsplash.com/photo-1641893916780-68011f78f1de"
                            className="rounded-3xl shadow-2xl h-[500px] object-cover"
                        />
                    </motion.div>

                    <div className="space-y-6">
                        <h3 className="text-3xl font-bold">놀라운 환경 보호 효과</h3>
                        <p className="text-gray-600">식단 변경만으로도 환경 보호에 큰 기여를 할 수 있습니다.</p>

                        <Card className="shadow-lg">
                            <CardContent className="space-y-6 p-6">
                                <ImpactRow icon={Car} title="CO₂ 절약" value="1.06톤" sub="= 2,600km 운행" />
                                <ImpactRow icon={Droplets} title="물 절약" value="1.5M 리터" sub="= 1년 샤워" />
                                <ImpactRow icon={TreePine} title="토지 보호" value="1,200㎡" sub="= 작은 농장" />
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* BEFORE vs AFTER */}
                <SectionTitle>축산업 vs 식물성 농업 비교</SectionTitle>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
                    {carbonImpacts.map((item, i) => <ImpactCard key={i} {...item} />)}
                </div>

                {/* DAILY IMPACT */}
                <motion.div className={shadowBox}>
                    <SectionTitle>당신의 하루가 만드는 변화</SectionTitle>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {dailyImpact.map((item, i) => <DailyCard key={i} {...item} />)}
                    </div>

                    <div className="text-center mt-10">
                        <Button size="lg" className="bg-blue-600 text-white"
                            onClick={() => navigate("/challenge/main")}>
                            지구를 위한 첫걸음 시작하기
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

const SectionTitle = ({ children }) => (
    <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">{children}</h3>
);

function ImpactRow({ icon: Icon, title, value, sub }) {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-blue-600" />
                <span className="font-medium">{title}</span>
            </div>
            <div className="text-right">
                <div className="font-bold">{value}</div>
                <div className="text-xs text-gray-500">{sub}</div>
            </div>
        </div>
    );
}

function ImpactCard({ icon: Icon, title, before, after }) {
    return (
        <Card className="hover:shadow-xl transition">
            <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                    <Icon className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <Compare before={before} after={after} />
            </CardContent>
        </Card>
    );
}

const Compare = ({ before, after }) => (
    <>
        <div className="flex justify-between bg-red-50 p-3 rounded-lg">
            <span className="text-sm text-red-700">축산업</span>
            <span className="font-bold text-red-600">{before}</span>
        </div>
        <div className="flex justify-between bg-green-50 p-3 rounded-lg">
            <span className="text-sm text-green-700">식물성</span>
            <span className="font-bold text-green-600">{after}</span>
        </div>
    </>
);

function DailyCard({ icon: Icon, value, desc, eq }) {
    return (
        <div className="text-center">
            <div className={iconCircle}>
                <Icon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="font-bold text-2xl text-blue-600">{value}</div>
            <div className="font-medium text-gray-900">{desc}</div>
            <div className="text-sm text-gray-500">{eq}</div>
        </div>
    );
}
