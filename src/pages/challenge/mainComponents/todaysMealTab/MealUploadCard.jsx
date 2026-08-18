import { useEffect, useRef, useState, memo } from 'react';
import { getUploadUrl, uploadToS3, analyzeMeal, getToken } from '../../../../api/backend';

let itemIdCounter = 0;
const nextItemId = () => `pending-${Date.now()}-${itemIdCounter++}`;

const MealUploadCard = memo(function MealUploadCard({
    onMealCreated,
    resetTrigger
}) {
    const [pendingItems, setPendingItems] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (resetTrigger > 0) {
            setPendingItems([]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    }, [resetTrigger, setPendingItems]);

    const updateItem = (id, patch) => {
        setPendingItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    };

    const handleFilesChange = (e) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        const validItems = [];
        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                alert(`${file.name}: 이미지 파일만 업로드 가능합니다.`);
                continue;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert(`${file.name}: 이미지 크기는 10MB 이하여야 합니다.`);
                continue;
            }
            validItems.push({
                id: nextItemId(),
                file,
                previewUrl: URL.createObjectURL(file),
                foodName: '',
                description: '',
                status: 'idle', // idle | uploading | error
                error: null
            });
        }

        if (validItems.length > 0) {
            setPendingItems((prev) => [...prev, ...validItems]);
        }
        e.target.value = '';
    };

    const handleRemoveItem = (id) => {
        setPendingItems((prev) => {
            const target = prev.find((item) => item.id === id);
            if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
            return prev.filter((item) => item.id !== id);
        });
    };

    const uploadOne = async (item, token) => {
        updateItem(item.id, { status: 'uploading', error: null });
        try {
            // 1. presigned URL 발급
            const urlRes = await getUploadUrl(token);
            const { uploadUrl, imageUrl } = urlRes.data || {};
            if (!uploadUrl || !imageUrl) throw new Error('업로드 URL을 받지 못했습니다.');

            // 2. S3 직접 업로드
            await uploadToS3(uploadUrl, item.file);

            // 3. 식단 분석 요청
            const mealRes = await analyzeMeal({
                imageUrl,
                foodName: item.foodName.trim() || null
            }, token);
            const mealId = mealRes.data?.mealId;
            if (!mealId) throw new Error('meal ID를 받지 못했습니다.');

            // 4. 인덱스에 카드 추가 (분석 중 상태)
            onMealCreated({
                id: mealId,
                mealId,
                imageUrl,
                previewUrl: item.previewUrl,
                foodName: item.foodName.trim(),
                description: item.description.trim(),
                status: 'ANALYZING',
                result: null,
                error: null
            });

            // 레거시 전체 저장 카운트 연동 (UploadButton 등에서 사용)
            window.addMealToIndex?.({
                image: item.previewUrl,
                analysis: '',
                recommendedRecipe: null,
                ingredients: null,
                carbonFootprint: null
            });

            // 업로드 성공한 항목은 대기 목록에서 제거
            setPendingItems((prev) => {
                const target = prev.find((p) => p.id === item.id);
                if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
                return prev.filter((p) => p.id !== item.id);
            });
        } catch (err) {
            console.error('식단 업로드 실패:', err);
            updateItem(item.id, { status: 'error', error: err.message });
        }
    };

    const handleUploadAll = async () => {
        const token = getToken();
        if (!token) {
            alert('로그인이 필요합니다.');
            return;
        }

        const targets = pendingItems.filter((item) => item.status !== 'uploading');
        if (targets.length === 0) return;

        await Promise.allSettled(targets.map((item) => uploadOne(item, token)));
    };

    const isUploading = pendingItems.some((item) => item.status === 'uploading');
    const canUpload = pendingItems.length > 0 && !isUploading;

    return (
        <div className="w-full bg-white/90 rounded-[48px] shadow-xl p-6" style={{ width: '100%', maxWidth: '100%', minWidth: 0, boxSizing: 'border-box' }}>
            <h3 className="text-base font-normal font-['Nunito'] text-gray-900 mb-6">
                오늘의 식단 등록
            </h3>

            <div className="space-y-4">
                <input
                    id="meal-image-upload"
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    className="hidden"
                />

                {pendingItems.length === 0 ? (
                    <div className="w-full h-64 bg-teal-50/30 rounded-3xl border-2 border-teal-300 shadow-inner flex flex-col items-center justify-center gap-4">
                        <div className="text-5xl text-cyan-500 animate-pulse">📷</div>
                        <p className="text-base text-gray-600 font-['Nunito'] font-medium">식단 사진을 업로드해주세요</p>
                        <label
                            htmlFor="meal-image-upload"
                            className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-2xl shadow-lg text-sm font-medium font-['Nunito'] hover:shadow-xl transition-shadow cursor-pointer inline-block"
                        >
                            사진 선택 (여러 장 가능)
                        </label>
                        <p className="text-xs text-gray-400 font-['Nunito']">JPG, PNG, GIF (최대 10MB)</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {pendingItems.map((item) => (
                            <div key={item.id} className="flex gap-3 bg-teal-50/30 rounded-3xl border-2 border-teal-200 p-3">
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden bg-white">
                                    <img src={item.previewUrl} alt="식단 미리보기" className="w-full h-full object-cover" />
                                    {item.status === 'uploading' && (
                                        <div className="absolute inset-0 flex items-center justify-center bg-white/80">
                                            <div className="w-6 h-6 border-2 border-teal-200 border-t-teal-600 rounded-full animate-spin"></div>
                                        </div>
                                    )}
                                    <button
                                        onClick={() => handleRemoveItem(item.id)}
                                        disabled={item.status === 'uploading'}
                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                                    >
                                        <span className="text-sm font-bold">×</span>
                                    </button>
                                </div>

                                <div className="flex-1 min-w-0 space-y-2">
                                    <input
                                        type="text"
                                        value={item.foodName}
                                        onChange={(e) => updateItem(item.id, { foodName: e.target.value })}
                                        placeholder="음식 이름 (예: 두부 샐러드)"
                                        disabled={item.status === 'uploading'}
                                        className="w-full px-3 py-1.5 bg-white rounded-xl border border-teal-200 text-sm font-['Nunito'] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-teal-400"
                                    />
                                    <textarea
                                        value={item.description}
                                        onChange={(e) => updateItem(item.id, { description: e.target.value })}
                                        placeholder="식단에 대한 설명 (선택사항)"
                                        rows={2}
                                        disabled={item.status === 'uploading'}
                                        className="w-full px-3 py-1.5 bg-white rounded-xl border border-teal-200 text-sm font-['Nunito'] text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:border-teal-400"
                                    />
                                    {item.status === 'error' && (
                                        <div className="flex items-center gap-2">
                                            <p className="text-xs text-red-600 font-['Nunito']">업로드 실패: {item.error}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        <label
                            htmlFor="meal-image-upload"
                            className="block w-full text-center py-2 rounded-2xl border-2 border-dashed border-teal-300 text-sm text-teal-500 font-['Nunito'] cursor-pointer hover:bg-teal-50/50 transition-colors"
                        >
                            ＋ 사진 추가
                        </label>
                    </div>
                )}

                {/* 업로드 버튼 */}
                <button
                    onClick={handleUploadAll}
                    disabled={!canUpload}
                    className={`w-full h-9 rounded-2xl shadow-lg text-sm font-medium font-['Nunito'] flex items-center justify-center gap-2 transition-all ${
                        canUpload
                            ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white hover:from-cyan-600 hover:to-emerald-600 cursor-pointer'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50'
                    }`}
                >
                    <span>📤</span>
                    {isUploading ? '업로드 중...' : '업로드'}
                </button>
            </div>
        </div>
    );
});

export default MealUploadCard;
