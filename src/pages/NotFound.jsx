import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">페이지를 찾을 수 없습니다.</p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
};

export default NotFound;
