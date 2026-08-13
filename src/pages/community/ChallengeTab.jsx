import React, { useState, useMemo } from "react";
import { Badge } from "./components/ui/Badge";
import { Card, CardContent } from "./components/ui/Card";
import { Avatar, AvatarFallback } from "./components/ui/Avatar";
import { Button } from "./components/ui/Button";
import { MapPinIcon, HeartIcon, MessageCircleIcon, TrendingUp, Clock, Flame } from "lucide-react";

const ChallengeTab = ({ feedPosts = [] }) => {
    const [sortBy, setSortBy] = useState("recent"); // "likes", "comments", "recent"

    const sortedPosts = useMemo(() => {
        const posts = [...feedPosts];

        switch (sortBy) {
            case "likes":
                return posts.sort((a, b) => (b.likes || 0) - (a.likes || 0));
            case "comments":
                return posts.sort((a, b) => (b.comments || 0) - (a.comments || 0));
            case "recent":
            default:
                return posts;
        }
    }, [feedPosts, sortBy]);

    const sortOptions = [
        { value: "likes", label: "하트 많은 순", icon: Flame },
        { value: "comments", label: "댓글 많은 순", icon: TrendingUp },
        { value: "recent", label: "최근 순", icon: Clock },
    ];

    return (
        <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
            { }
            <Card className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px]">
                <CardContent className="p-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <span className="[font-family:'Nunito',Helvetica] font-semibold text-[#495565] text-sm">
                            정렬:
                        </span>
                        {sortOptions.map((option) => {
                            const Icon = option.icon;
                            const isActive = sortBy === option.value;
                            return (
                                <Button
                                    key={option.value}
                                    onClick={() => setSortBy(option.value)}
                                    variant={isActive ? "default" : "outline"}
                                    className={`h-9 px-4 rounded-lg transition-all ${isActive
                                        ? "bg-[#00a63e] text-white hover:bg-[#008235] [font-family:'Nunito',Helvetica] font-medium text-sm"
                                        : "bg-white border-[#0000001a] text-[#495565] hover:bg-gray-50 [font-family:'Nunito',Helvetica] font-medium text-sm"
                                        }`}
                                >
                                    <Icon className="w-4 h-4 mr-2" />
                                    {option.label}
                                </Button>
                            );
                        })}
                    </div>
                </CardContent>
            </Card>

            {/* 피드랭킹부분!! */}
            <div className="flex flex-col gap-4">
                {sortedPosts.length === 0 ? (
                    <Card className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px]">
                        <CardContent className="p-12 text-center">
                            <div className="text-4xl mb-4">📝</div>
                            <p className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-base">
                                아직 게시글이 없습니다.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    sortedPosts.map((post, index) => (
                        <Card
                            key={index}
                            className="bg-[#fffffff2] rounded-[14px] border-[0.67px] border-[#0000001a] hover:shadow-md transition-shadow"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* 랭킹순위 */}
                                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-[#00a63e] to-[#008235] flex items-center justify-center">
                                        <span className="[font-family:'Nunito',Helvetica] font-bold text-white text-lg">
                                            {index + 1}
                                        </span>
                                    </div>

                                    {/* 게시글내용 */}
                                    <div className="flex-1 flex flex-col gap-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start gap-3 flex-1">
                                                <Avatar className="w-10 h-10">
                                                    <AvatarFallback className="bg-[#ececf0] text-neutral-950 [font-family:'Nunito',Helvetica] font-normal text-base">
                                                        {post.avatar || post.username?.charAt(0) || "👤"}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex flex-col gap-1 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="[font-family:'Nunito',Helvetica] font-semibold text-neutral-950 text-base tracking-[0] leading-6">
                                                            {post.username}
                                                        </span>
                                                        <Badge className="bg-green-100 text-[#008235] border-[0.67px] border-transparent [font-family:'Nunito',Helvetica] font-medium text-xs">
                                                            {post.level}
                                                        </Badge>
                                                    </div>

                                                    <div className="flex items-center gap-1 text-[#697282] text-sm">
                                                        <MapPinIcon className="w-3 h-3" />
                                                        <span className="[font-family:'Nunito',Helvetica] font-normal tracking-[0] leading-5">
                                                            {post.location} • {post.time}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="[font-family:'Nunito',Helvetica] font-normal text-[#354152] text-base tracking-[0] leading-6 line-clamp-3">
                                            {post.content}
                                        </p>

                                        {post.hashtags && post.hashtags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {post.hashtags.map((tag, tagIndex) => (
                                                    <Badge
                                                        key={tagIndex}
                                                        variant="outline"
                                                        className="border-[#00a63e] text-[#00a63e] [font-family:'Nunito',Helvetica] font-medium text-xs"
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                                            <div className="flex items-center gap-2">
                                                <HeartIcon className="w-5 h-5 text-[#e60076]" />
                                                <span className="[font-family:'Nunito',Helvetica] font-semibold text-[#e60076] text-base">
                                                    {post.likes || 0}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <MessageCircleIcon className="w-5 h-5 text-[#00a63e]" />
                                                <span className="[font-family:'Nunito',Helvetica] font-semibold text-[#00a63e] text-base">
                                                    {post.comments || 0}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            { }
            {sortedPosts.length > 0 && sortBy !== "recent" && (
                <div className="mt-6 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-[14px] border border-[#00a63e]/20">
                    <h3 className="[font-family:'Nunito',Helvetica] font-semibold text-[#00a63e] text-lg mb-2">
                        🏆 {sortBy === "likes" ? "인기 게시글" : "댓글이 많은 게시글"} Top 3
                    </h3>
                    <p className="[font-family:'Nunito',Helvetica] font-normal text-[#495565] text-sm">
                        {sortedPosts.slice(0, 3).map((post, idx) => (
                            <span key={idx}>
                                {idx + 1}위: {post.username}
                                {idx < 2 && " • "}
                            </span>
                        ))}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ChallengeTab;
