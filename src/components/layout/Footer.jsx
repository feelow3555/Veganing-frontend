import logoImg from "../../assets/logo/logo.svg";
import faceBook from "../../assets/footerImg/faceBook.svg";
import insta from "../../assets/footerImg/insta.svg";
import twitter from "../../assets/footerImg/twitter.svg";
import youtube from "../../assets/footerImg/youtube.svg";

function Footer() {
    return (
        <footer className="w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-8 py-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* 로고 & 소개 */}
                <div className="flex flex-col gap-4">
                    {/* 로고 */}
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-emerald-500 rounded-2xl shadow-sm flex justify-center items-center">
                            <img src={logoImg} alt="veganing" className="w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold font-['Inter'] bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent ml-1">Veganing</span>
                    </div>

                    {/* 설명 텍스트 */}
                    <p className="text-gray-400 text-sm leading-relaxed">
                        건강하고 지속가능한 비건 라이프스타일을 위한 모든 정보와 제품을 제공합니다.
                    </p>

                    {/* SNS 아이콘 */}
                    <div className="flex items-center gap-3">
                        <img src={faceBook} alt="faceBookImg" className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        <img src={insta} alt="instaImg" className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        <img src={twitter} alt="twitterImg" className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                        <img src={youtube} alt="youtubeImg" className="w-5 h-5 cursor-pointer hover:opacity-80 transition-opacity" />
                    </div>
                </div>

                {/* 빠른 링크 */}
                <div>
                    <h3 className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent font-bold font-['Inter'] mb-4">빠른 링크</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">레시피</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">제품</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">라이프스타일 팁</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">영양 가이드</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">커뮤니티</a></li>
                    </ul>
                </div>

                {/* 고객 지원 */}
                <div>
                    <h3 className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent font-bold font-['Inter'] mb-4">고객 지원</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">자주 묻는 질문</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">배송 정보</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">반품/교환</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">이용약관</a></li>
                        <li><a href="#" className="text-gray-400 hover:text-white transition-colors">개인정보처리방침</a></li>
                    </ul>
                </div>

                {/* 뉴스레터 */}
                <div className="flex flex-col gap-4">
                    <h3 className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent font-bold font-['Inter']">뉴스레터</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                        최신 레시피와 비건 소식을 이메일로 받아보세요.
                    </p>
                    
                    <form className="flex flex-col gap-3">
                        <input
                            type="email"
                            placeholder="이메일 주소"
                            className="w-full h-9 px-3 py-1 bg-slate-800 text-gray-300 placeholder:text-gray-500 text-sm rounded-2xl border-2 border-teal-800 focus:outline-none focus:border-teal-600"
                        />
                        <button
                            type="submit"
                            className="w-full h-9 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl shadow-lg text-white text-sm font-medium hover:from-teal-600 hover:to-emerald-600 transition-colors"
                        >
                            구독하기
                        </button>
                    </form>
                </div>

            </div>
        </footer>
    )
}

export default Footer;