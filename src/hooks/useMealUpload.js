import { useState, useEffect } from 'react';

const STORAGE_KEY = 'challenge_meal_upload_state';

/**
 * 식단 업로드 및 분석 관련 상태를 관리하는 hook (localStorage로 영구 저장)
 */
function useMealUpload() {
    // localStorage에서 초기 상태 복원
    const getInitialState = () => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                return {
                    analysisResult: parsed.analysisResult || "",
                    currentImage: parsed.currentImage || null,
                    currentDescription: parsed.currentDescription || ""
                };
            }
        } catch (error) {
            console.error('localStorage 복원 실패:', error);
        }
        return {
            analysisResult: "",
            currentImage: null,
            currentDescription: ""
        };
    };

    const initialState = getInitialState();
    const [analysisResult, setAnalysisResult] = useState(initialState.analysisResult);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [currentImage, setCurrentImage] = useState(initialState.currentImage);
    const [currentDescription, setCurrentDescription] = useState(initialState.currentDescription);
    const [resetTrigger, setResetTrigger] = useState(0);

    // 상태 변경 시 localStorage에 저장
    useEffect(() => {
        try {
            const stateToSave = {
                analysisResult,
                currentImage,
                currentDescription
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
        } catch (error) {
            console.error('localStorage 저장 실패:', error);
        }
    }, [analysisResult, currentImage, currentDescription]);

    // 전체 리셋 (localStorage도 함께 초기화)
    const resetUpload = () => {
        setAnalysisResult("");
        setCurrentImage(null);
        setCurrentDescription("");
        setResetTrigger(prev => prev + 1);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch (error) {
            console.error('localStorage 초기화 실패:', error);
        }
    };

    // 분석 완료 처리
    const handleAnalysisComplete = (result) => {
        setAnalysisResult(result);
        setIsAnalyzing(false);
    };

    // 분석 시작
    const startAnalysis = () => {
        setIsAnalyzing(true);
    };

    return {
        // 상태
        analysisResult,
        isAnalyzing,
        currentImage,
        currentDescription,
        resetTrigger,
        
        // 액션
        setAnalysisResult,
        setIsAnalyzing,
        setCurrentImage,
        setCurrentDescription,
        resetUpload,
        handleAnalysisComplete,
        startAnalysis
    };
}

export default useMealUpload;