import React from "react";
import { Badge } from "./components/ui/Badge";
import { Card, CardContent } from "./components/ui/Card";
import { Avatar, AvatarFallback } from "./components/ui/Avatar";
import { MapPinIcon, HeartIcon, MessageCircleIcon } from "lucide-react";
import { Button } from "./components/ui/Button";
import quinoaSaladImage from "../../assets/community/quinoa_salad.jpg";
import dubuScrambleImage from "../../assets/community/dubu_scramble.jpg";
import rentilCarreImage from "../../assets/community/rentil_carre.jpg";

const RECIPE_RANKING_POSTS = [
    {
        id: 1,
        username: "비건셰프",
        level: "Lv.18",
        location: "서울 강남구",
        time: "2시간 전",
        content: "퀴노아와 채소 볶음 레시피 공유해요! 완전 단백질이 풍부하고 만들기도 쉬워서 저는 주 3회는 먹는 것 같아요. 특히 브로콜리와 파프리카가 들어가서 색감도 예쁘고 영양도 만점이에요! 🥗",
        recipe: [
            "1. 프라이팬에 올리브 오일을 두르고, 중불에서 당근, 브로콜리, 파프리카를 볶습니다.",
            "2. 채소가 부드러워질 때까지 볶다가, 조리된 퀴노아를 추가합니다.",
            "3. 간장과 생강가루를 넣고 잘 섞은 후 2~3분 더 볶아줍니다."
        ],
        hashtags: ["#퀴노아", "#비건레시피", "#건강식단"],
        likes: 89,
        comments: 23,
        recipeName: "퀴노아와 채소 볶음",
        imageUrl: quinoaSaladImage
    },
    {
        id: 2,
        username: "그린쿠킹",
        level: "Lv.15",
        location: "서울 서초구",
        time: "5시간 전",
        content: "오늘 두부 스크램블을 만들어봤는데 정말 맛있어요! 두부에 큐민과 파프리카 파우더를 넣어서 계란 맛이 나도록 했어요. 아보카도 토스트와 함께 먹으니 완벽한 브런치가 되었어요! 🥑",
        recipe: [
            "1. 두부는 물기를 제거한 후 으깨어준다.",
            "2. 프라이팬에 올리브 오일을 두르고 큐민과 파프리카 파우더를 볶는다.",
            "3. 으깬 두부를 넣고 계란처럼 스크램블 형태로 볶는다.",
            "4. 토스트 위에 아보카도를 올리고 그 위에 두부 스크램블을 올리면 완성!"
        ],
        hashtags: ["#두부스크램블", "#비건브런치", "#아보카도"],
        likes: 67,
        comments: 15,
        recipeName: "두부 스크램블 아보카도 토스트",
        imageUrl: dubuScrambleImage
    },
    {
        id: 3,
        username: "비건러버",
        level: "Lv.22",
        location: "서울 마포구",
        time: "1일 전",
        content: "렌틸 커리를 처음 만들어봤는데 생각보다 너무 쉬워요! 렌틸콩을 넣어서 단백질도 충분하고, 코코넛 밀크를 넣어서 부드러운 맛이에요. 바질과 케이퍼를 올리면 한층 더 맛있어집니다! 🍛",
        recipe: [
            "1. 렌틸콩을 물에 불려준다 (약 30분).",
            "2. 프라이팬에 올리브 오일을 두르고 양파, 마늘, 생강을 볶는다.",
            "3. 커리 파우더, 큐민, 코리앤더를 넣고 볶다가 불린 렌틸콩을 추가한다.",
            "4. 코코넛 밀크를 넣고 약한 불에서 15분 정도 끓인다.",
            "5. 바질과 케이퍼를 올려 완성!"
        ],
        hashtags: ["#렌틸커리", "#비건커리", "#인도요리"],
        likes: 124,
        comments: 34,
        recipeName: "렌틸 커리",
        imageUrl: rentilCarreImage
    }
];

const RecipeRankingTab = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-4">
                <h2 className="[font-family:'Nunito',Helvetica] font-semibold text-[#00a63e] text-lg mb-2">
                    인기 레시피 랭킹
                </h2>
                <p className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-sm">
                    많은 사용자들이 좋아하는 레시피에 대한 후기와 팁을 확인해보세요!
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {RECIPE_RANKING_POSTS.map((post) => (
                    <Card
                        key={post.id}
                        className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px] hover:shadow-md transition-shadow"
                    >
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-12 h-12 flex-shrink-0">
                                    <AvatarFallback className="bg-green-100 text-[#00a63e] [font-family:'Nunito',Helvetica] font-semibold">
                                        {post.username.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                        <span className="[font-family:'Nunito',Helvetica] font-semibold text-neutral-950 text-base">
                                            {post.username}
                                        </span>
                                        <Badge className="bg-green-100 text-[#008235] border-transparent hover:bg-green-100">
                                            <span className="[font-family:'Nunito',Helvetica] font-medium text-xs">
                                                {post.level}
                                            </span>
                                        </Badge>
                                        <div className="flex items-center gap-1 text-[#495565]">
                                            <MapPinIcon className="w-4 h-4" />
                                            <span className="[font-family:'Nunito',Helvetica] font-normal text-xs">
                                                {post.location}
                                            </span>
                                        </div>
                                        <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-xs">
                                            {post.time}
                                        </span>
                                    </div>

                                    <div className="mb-3">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge className="bg-purple-100 text-purple-700 border-transparent">
                                                <span className="[font-family:'Nunito',Helvetica] font-medium text-xs">
                                                    레시피: {post.recipeName}
                                                </span>
                                            </Badge>
                                        </div>
                                        {post.imageUrl && (
                                            <div className="mb-3 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                <img
                                                    src={post.imageUrl}
                                                    alt={post.recipeName}
                                                    className="w-full max-h-96 object-contain"
                                                />
                                            </div>
                                        )}
                                        <p className="[font-family:'Nunito',Helvetica] font-normal text-neutral-950 text-sm leading-6 mb-3">
                                            {post.content}
                                        </p>
                                        {post.recipe && (
                                            <div className="bg-gray-50 rounded-lg p-4 mb-3 border-l-4 border-[#00a63e]">
                                                <h4 className="[font-family:'Nunito',Helvetica] font-semibold text-[#00a63e] text-sm mb-2">
                                                    레시피
                                                </h4>
                                                <div className="space-y-2">
                                                    {post.recipe.map((step, idx) => (
                                                        <p
                                                            key={idx}
                                                            className="[font-family:'Nunito',Helvetica] font-normal text-neutral-700 text-sm leading-6"
                                                        >
                                                            {step}
                                                        </p>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {post.hashtags.map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="[font-family:'Nunito',Helvetica] font-normal text-[#00a63e] text-xs"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <Button
                                            variant="ghost"
                                            className="flex items-center gap-2 text-[#495565] hover:text-[#00a63e] p-0 h-auto"
                                        >
                                            <HeartIcon className="w-5 h-5" />
                                            <span className="[font-family:'Nunito',Helvetica] font-normal text-sm">
                                                {post.likes}
                                            </span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            className="flex items-center gap-2 text-[#495565] hover:text-[#00a63e] p-0 h-auto"
                                        >
                                            <MessageCircleIcon className="w-5 h-5" />
                                            <span className="[font-family:'Nunito',Helvetica] font-normal text-sm">
                                                {post.comments}
                                            </span>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RecipeRankingTab;

