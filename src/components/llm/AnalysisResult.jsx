// src/components/AnalysisResult.jsx
// AI 분석 결과를 표시하는 컴포넌트
function AnalysisResult({ output }) {
    return (
        <div style={{ marginTop: "1rem", whiteSpace: "pre-wrap" }}>
            {output || "아직 실행 전"} {/* AI 응답 저장 - 없으면 기본 메시지 */}
        </div>
    );
}

export default AnalysisResult;