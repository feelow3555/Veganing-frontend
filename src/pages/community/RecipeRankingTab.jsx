import React, { useState, useEffect } from "react";
import { Badge } from "./components/ui/Badge";
import { Card, CardContent } from "./components/ui/Card";
import { Avatar, AvatarFallback } from "./components/ui/Avatar";
import { HeartIcon, MessageCircleIcon } from "lucide-react";
import { getPostsByLikes, getToken, likePost } from "../../api/backend";

const formatTimeAgo = (dateString) => {
    if (!dateString) return "방금 전";
    const now = new Date();
    const postDate = new Date(dateString);
    const diffMins = Math.floor((now - postDate) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return postDate.toLocaleDateString("ko-KR");
};

const RecipeRankingTab = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [likedPosts, setLikedPosts] = useState(new Set());

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const res = await getPostsByLikes(10);
            setPosts(res.data?.content || []);
        } catch (err) {
            console.error("레시피 랭킹 로드 실패:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLike = async (postId) => {
        const token = getToken();
        if (!token) { alert("로그인이 필요합니다."); return; }
        try {
            await likePost(postId, token);
            setLikedPosts(prev => {
                const next = new Set(prev);
                next.has(postId) ? next.delete(postId) : next.add(postId);
                return next;
            });
            setPosts(prev => prev.map(p => p.id === postId
                ? { ...p, likeCount: likedPosts.has(postId) ? p.likeCount - 1 : p.likeCount + 1 }
                : p
            ));
        } catch (err) {
            console.error("좋아요 실패:", err);
        }
    };

    if (isLoading) return (
        <div className="flex justify-center py-12">
            <div className="w-10 h-10 border-4 border-green-200 border-t-green-500 rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                <h2 className="font-semibold text-[#00a63e] text-lg mb-1">인기 레시피 랭킹</h2>
                <p className="text-[#495565] text-sm">좋아요가 많은 레시피를 확인해보세요!</p>
            </div>

            {posts.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    <p className="text-4xl mb-4">🌱</p>
                    <p>아직 레시피가 없습니다. 첫 번째 레시피를 공유해보세요!</p>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {posts.map((post, idx) => (
                        <Card key={post.id} className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px] hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 rounded-full font-bold text-sm flex-shrink-0">
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Avatar className="w-8 h-8">
                                                <AvatarFallback className="bg-green-100 text-[#00a63e] text-xs font-semibold">
                                                    {(post.nickname || "익")[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-semibold text-sm">{post.nickname || "익명"}</span>
                                            <span className="text-xs text-gray-400">{formatTimeAgo(post.createdAt)}</span>
                                        </div>

                                        {post.title && (
                                            <Badge className="bg-purple-100 text-purple-700 border-transparent mb-2 text-xs">
                                                {post.title}
                                            </Badge>
                                        )}

                                        {post.imageUrl && (
                                            <div className="mb-3 rounded-lg overflow-hidden">
                                                <img src={post.imageUrl} alt={post.title} className="w-full max-h-64 object-cover" />
                                            </div>
                                        )}

                                        <p className="text-sm text-gray-700 leading-6 mb-3">{post.content}</p>

                                        <div className="flex items-center gap-4">
                                            <button
                                                onClick={() => handleLike(post.id)}
                                                className={`flex items-center gap-1 text-sm transition-colors ${likedPosts.has(post.id) ? 'text-pink-500' : 'text-gray-500 hover:text-pink-500'}`}
                                            >
                                                <HeartIcon className={`w-4 h-4 ${likedPosts.has(post.id) ? 'fill-pink-500' : ''}`} />
                                                {post.likeCount || 0}
                                            </button>
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <MessageCircleIcon className="w-4 h-4" />
                                                {post.commentCount || 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecipeRankingTab;
