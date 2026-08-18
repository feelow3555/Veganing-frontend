import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/Card";
import { Input } from "./components/ui/Input";
import { ImageIcon, X, Upload, Plus, Trash2 } from "lucide-react";
import { createPost, getUploadUrl, uploadToS3, getToken, removeToken } from "../../api/backend";
import { clearAuth } from "../../hooks/auth";

const CreatePost = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [imagePreview, setImagePreview] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // 재료: [{name, amount}]
    const [ingredients, setIngredients] = useState([{ name: "", amount: "" }]);
    // 순서: [{order, description}]
    const [steps, setSteps] = useState([{ order: "1", description: "" }]);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith("image/")) { alert("이미지 파일만 업로드 가능합니다."); return; }
        if (file.size > 5 * 1024 * 1024) { alert("이미지 크기는 5MB 이하여야 합니다."); return; }
        setSelectedFile(file);
        setImageUrl("");
        const reader = new FileReader();
        reader.onloadend = () => { setImagePreview(reader.result); };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImagePreview(""); setImageUrl(""); setSelectedFile(null);
        const fi = document.getElementById("image-file-input");
        if (fi) fi.value = "";
    };

    // 재료 추가/수정/삭제
    const addIngredient = () => setIngredients([...ingredients, { name: "", amount: "" }]);
    const updateIngredient = (idx, field, val) => {
        const updated = [...ingredients];
        updated[idx][field] = val;
        setIngredients(updated);
    };
    const removeIngredient = (idx) => setIngredients(ingredients.filter((_, i) => i !== idx));

    // 순서 추가/수정/삭제
    const addStep = () => setSteps([...steps, { order: String(steps.length + 1), description: "" }]);
    const updateStep = (idx, val) => {
        const updated = [...steps];
        updated[idx].description = val;
        setSteps(updated);
    };
    const removeStep = (idx) => {
        const updated = steps.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: String(i + 1) }));
        setSteps(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim()) { alert("레시피 이름을 입력해주세요."); return; }
        if (!selectedFile) { alert("완성 사진을 업로드해주세요."); return; }
        if (ingredients.some(ig => !ig.name.trim())) { alert("재료 이름을 모두 입력해주세요."); return; }
        if (steps.some(st => !st.description.trim())) { alert("조리 순서를 모두 입력해주세요."); return; }

        setIsLoading(true);
        try {
            const token = getToken();
            if (!token) { alert("로그인이 필요합니다."); navigate("/login"); return; }

            let finalImageUrl = imageUrl;
            if (selectedFile) {
                const urlRes = await getUploadUrl(token);
                const presignedUrl = urlRes.data?.uploadUrl;
                finalImageUrl = presignedUrl.split('?')[0];
                await uploadToS3(presignedUrl, selectedFile);
            }

            const postData = {
                title: title.trim(),
                content: content.trim(),
                imageUrl: finalImageUrl,
                ingredients: ingredients.filter(ig => ig.name.trim()),
                steps: steps.filter(st => st.description.trim()),
            };

            await createPost(postData, token);
            alert("게시글이 작성되었습니다!");
            navigate("/community", { replace: true });
        } catch (error) {
            console.error("게시글 작성 실패:", error);
            if (error.message?.includes("401")) {
                removeToken(); clearAuth();
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate("/login"); return;
            }
            alert(`게시글 작성에 실패했습니다: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex-1 relative">
            <section className="container mx-auto px-4 py-16 relative">
                <div className="flex flex-col items-center gap-8 max-w-3xl mx-auto">
                    <div className="flex flex-col items-center gap-4 text-center w-full">
                        <h1 className="[font-family:'Nunito',Helvetica] font-normal text-white text-4xl tracking-[0] leading-[48px]">레시피 작성</h1>
                        <p className="[font-family:'Nunito',Helvetica] font-normal text-[#fffefee6] text-lg">비건 커뮤니티에 레시피를 공유해보세요</p>
                    </div>

                    <Card className="bg-[#fffffff2] border-[0.67px] border-[#0000001a] rounded-[14px] w-full">
                        <CardHeader>
                            <CardTitle className="[font-family:'Nunito',Helvetica] font-semibold text-[#00a63e] text-xl">새 레시피</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                {/* 레시피 이름 */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-[#495565] text-sm">레시피 이름 *</label>
                                    <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="레시피 이름을 입력해주세요" className="rounded-lg" required />
                                </div>

                                {/* 레시피 설명 */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-[#495565] text-sm">레시피 설명 (선택)</label>
                                    <textarea value={content} onChange={(e) => setContent(e.target.value)}
                                        placeholder="레시피에 대한 설명을 입력해주세요..."
                                        className="w-full min-h-[120px] p-4 rounded-lg border-2 border-gray-200 focus:border-[#00a63e] focus:outline-none resize-y text-sm" />
                                </div>

                                {/* 완성 사진 */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-[#495565] text-sm flex items-center gap-2"><ImageIcon className="w-4 h-4" />완성 사진 *</label>
                                    {!imagePreview ? (
                                        <label htmlFor="image-file-input" className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-[#00a63e] hover:bg-green-50 transition-colors">
                                            <Upload className="w-5 h-5 text-[#495565]" />
                                            <span className="font-medium text-[#495565] text-sm">완성 사진 선택 (최대 5MB)</span>
                                            <input id="image-file-input" type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                                        </label>
                                    ) : (
                                        <div className="relative">
                                            <img src={imagePreview} alt="미리보기" className="w-full h-auto max-h-96 object-contain rounded-lg border-2 border-gray-200" />
                                            <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage} className="absolute top-2 right-2 bg-white hover:bg-gray-100 rounded-full shadow-lg">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    )}
                                </div>

                                {/* 재료 */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-[#495565] text-sm">재료 *</label>
                                    {ingredients.map((ig, idx) => (
                                        <div key={idx} className="flex gap-2 items-center">
                                            <Input value={ig.name} onChange={(e) => updateIngredient(idx, "name", e.target.value)} placeholder="재료명 (예: 두부)" className="rounded-lg flex-1" />
                                            <Input value={ig.amount} onChange={(e) => updateIngredient(idx, "amount", e.target.value)} placeholder="양 (예: 150g)" className="rounded-lg w-32" />
                                            {ingredients.length > 1 && (
                                                <button type="button" onClick={() => removeIngredient(idx)} className="text-red-400 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addIngredient} className="flex items-center gap-1 text-[#00a63e] text-sm font-medium hover:underline w-fit">
                                        <Plus className="w-4 h-4" /> 재료 추가
                                    </button>
                                </div>

                                {/* 레시피 순서 */}
                                <div className="flex flex-col gap-2">
                                    <label className="font-medium text-[#495565] text-sm">레시피 순서 *</label>
                                    {steps.map((st, idx) => (
                                        <div key={idx} className="flex gap-2 items-start">
                                            <span className="w-7 h-7 flex items-center justify-center bg-[#00a63e] text-white rounded-full text-xs font-bold flex-shrink-0 mt-2">{idx + 1}</span>
                                            <textarea value={st.description} onChange={(e) => updateStep(idx, e.target.value)}
                                                placeholder={`${idx + 1}번째 순서를 입력해주세요`}
                                                className="flex-1 p-3 rounded-lg border-2 border-gray-200 focus:border-[#00a63e] focus:outline-none resize-none text-sm min-h-[70px]" />
                                            {steps.length > 1 && (
                                                <button type="button" onClick={() => removeStep(idx)} className="text-red-400 hover:text-red-600 mt-2">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button type="button" onClick={addStep} className="flex items-center gap-1 text-[#00a63e] text-sm font-medium hover:underline w-fit">
                                        <Plus className="w-4 h-4" /> 순서 추가
                                    </button>
                                </div>

                                {/* 버튼 */}
                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                                    <Button type="button" variant="outline" onClick={() => navigate("/community")} className="font-medium">취소</Button>
                                    <Button type="submit" disabled={isLoading || !title.trim() || !selectedFile}
                                        className="bg-[#00a63e] text-white hover:bg-[#008235] font-medium">
                                        {isLoading ? "작성 중..." : "작성하기"}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
};

export default CreatePost;
