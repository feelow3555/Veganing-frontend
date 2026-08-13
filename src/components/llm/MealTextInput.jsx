// src/components/MealTextInput.jsx
// 사용자가 먹은 식단을 텍스트로 입력하는 컴포넌트
function MealTextInput({ value, onChange }) {
    return (
        <textarea
            rows={4}
            style={{ width: "100%", padding: "0.5rem" }}
            placeholder="오늘 먹은 식단을 입력하세요"
            value={value} // 부모에서 받은 입력값
            onChange={onChange} // 입력값 변경 시 부모에게 알림
        />
    );
}

export default MealTextInput;