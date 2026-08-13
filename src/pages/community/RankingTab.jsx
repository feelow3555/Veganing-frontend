import React from "react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "./components/ui/Avatar";
import { Badge } from "./components/ui/Badge";
import { Card, CardContent } from "./components/ui/Card";
import { Progress } from "./components/ui/Progress";

const RankingTab = ({
    rankingData,
    profileLoading,
    isLoggedIn,
    userProfile,
    userStats,
    userBadgesData,
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px]">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <img
                            className="w-5 h-5"
                            alt="Icon"
                            src="https://c.animaapp.com/mh1j2gpo64vpvu/img/icon-8.svg"
                        />
                        <h2 className="[font-family:'Nunito',Helvetica] font-normal text-[#00a63e] text-base tracking-[0] leading-4">
                            전체 랭킹 (서울 강남구)
                        </h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        {rankingData.map((user, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-[10px] transition-colors hover:bg-gray-100"
                            >
                                <div className="flex items-center gap-3">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage src={user.avatar} />
                                        {user.fallback && (
                                            <AvatarFallback className="bg-[#ececf0] text-neutral-950 [font-family:'Nunito',Helvetica] font-normal text-base">
                                                {user.fallback}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <span className="[font-family:'Nunito',Helvetica] font-semibold text-neutral-950 text-base tracking-[0] leading-6">
                                                {user.name}
                                            </span>
                                            <Badge className="bg-green-100 text-[#008235] border-transparent hover:bg-green-100">
                                                <span className="[font-family:'Nunito',Helvetica] font-medium text-xs">
                                                    {user.level}
                                                </span>
                                            </Badge>
                                        </div>
                                        <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-sm tracking-[0] leading-5">
                                            {user.streak}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-1">
                                    <span className="[font-family:'Nunito',Helvetica] font-semibold text-[#00a63e] text-base text-right tracking-[0] leading-6">
                                        {user.points}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        {user.badges.map((badge, badgeIndex) => (
                                            <span
                                                key={badgeIndex}
                                                className="[font-family:'Nunito',Helvetica] font-normal text-neutral-950 text-sm"
                                            >
                                                {badge}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px]">
                <CardContent className="p-6">
                    <h2 className="[font-family:'Nunito',Helvetica] font-normal text-[#00a63e] text-base tracking-[0] leading-4 mb-6">
                        나의 프로필
                    </h2>

                    {profileLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="text-2xl">⏳</div>
                            <p className="ml-2 text-gray-600">로딩 중...</p>
                        </div>
                    ) : !isLoggedIn ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="text-4xl">🌱</div>
                            <p className="text-gray-600">로그인하고 프로필을 확인하세요!</p>
                        </div>
                    ) : !userProfile ? (
                        <div className="flex flex-col items-center gap-4 py-8">
                            <div className="text-4xl">🌱</div>
                            <p className="text-gray-600">프로필을 불러올 수 없습니다.</p>
                            <p className="text-sm text-gray-500">새로고침해주세요.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-2 px-4 py-2 bg-[#00a63e] text-white rounded-lg hover:bg-[#008235] transition-colors [font-family:'Nunito',Helvetica] font-medium text-sm"
                            >
                                새로고침
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center gap-4">
                                <div className="flex items-center justify-center w-20 h-20 bg-green-100 rounded-full">
                                    <span className="[font-family:'Nunito',Helvetica] font-normal text-neutral-950 text-3xl text-center tracking-[0] leading-9">
                                        🌱
                                    </span>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="[font-family:'Nunito',Helvetica] font-normal text-neutral-950 text-2xl text-center tracking-[0] leading-8">
                                        {userProfile.nickname || "비건러버"}
                                    </span>
                                    <Badge className="bg-green-100 text-[#008235] border-transparent hover:bg-green-100">
                                        <span className="[font-family:'Nunito',Helvetica] font-medium text-xs">
                                            Lv.{userProfile.level || 1}
                                        </span>
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-8 w-full">
                                    <div className="flex flex-col items-center gap-1">
                                        <span className="[font-family:'Nunito',Helvetica] font-normal text-[#00a63e] text-2xl text-center tracking-[0] leading-8">
                                            {userStats?.currentStreak || 0}일
                                        </span>
                                        <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-sm text-center tracking-[0] leading-5">
                                            연속 달성
                                        </span>
                                    </div>

                                    <div className="flex flex-col items-center gap-1">
                                        <span className="[font-family:'Nunito',Helvetica] font-normal text-[#155cfb] text-2xl text-center tracking-[0] leading-8">
                                            {userStats?.currentPoints || userProfile.points || 0}
                                        </span>
                                        <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-sm text-center tracking-[0] leading-5">
                                            포인트
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h3 className="[font-family:'Nunito',Helvetica] font-semibold text-neutral-950 text-base tracking-[0] leading-6">
                                    보유 뱃지
                                </h3>

                                <div className="grid grid-cols-3 gap-3">
                                    {userBadgesData.map((badge, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col items-center gap-1 p-3 ${badge.bg} rounded-[10px]`}
                                        >
                                            <span className="[font-family:'Nunito',Helvetica] font-normal text-neutral-950 text-2xl text-center tracking-[0] leading-8">
                                                {badge.emoji}
                                            </span>
                                            <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-xs text-center tracking-[0] leading-4">
                                                {badge.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <h3 className="[font-family:'Nunito',Helvetica] font-semibold text-neutral-950 text-base tracking-[0] leading-6">
                                    다음 레벨까지
                                </h3>

                                <div className="flex items-center justify-between text-sm">
                                    <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565]">
                                        Lv.{userProfile.level || 1}
                                    </span>
                                    <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565]">
                                        {userProfile.points || 0}/1000 XP
                                    </span>
                                    <span className="[font-family:'Nunito',Helvetica] font-normal text-[#495565]">
                                        Lv.{(userProfile.level || 1) + 1}
                                    </span>
                                </div>

                                <Progress value={((userProfile.points || 0) / 1000) * 100} className="h-2" />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default RankingTab;

