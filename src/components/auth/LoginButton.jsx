// 로그인 버튼을 어떤 화면에서도 재사용하기 위한 컴포넌트
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위해 useNavigate 사용

export default function LoginButton() {
  const navigate = useNavigate(); // 네비게이터 훅 생성

  // 버튼 클릭 시 /login으로 이동
  const goLogin = () => {
    navigate("/login"); // 로그인 페이지로 라우팅
  };

  return (
    // Tailwind 예시 스타일: 파란 버튼 / 접근성용 aria-label 포함
    <button
      type="button"                    // 폼 제출 방지
      onClick={goLogin}                // 클릭 시 라우팅 함수 실행
      aria-label="로그인 페이지로 이동"  // 스크린리더 접근성
      className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition"
    >
      로그인
    </button>
  );
}
