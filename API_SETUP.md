# 🎉 백엔드 API 연결 완료!

## ✅ 완료된 작업

### 1. API 설정 파일 생성
- ✅ `src/config/api.js` - API 엔드포인트 및 헬퍼 함수
- ✅ `src/api/backend.js` - 백엔드 API 호출 함수들

### 2. 환경 변수 설정
- ✅ `.env` - 배포된 백엔드 URL 설정
- ✅ `.env.example` - 환경 변수 예시

### 3. 문서
- ✅ `src/api/README.md` - API 사용 가이드

---

## 🌐 연결된 백엔드

**배포된 백엔드 URL:**
```
https://veganing-backend.onrender.com
```

**사용 가능한 API:**
- ✅ 인증 (회원가입, 로그인, 프로필)
- ✅ 챌린지 (시작, 진행, 통계)
- ✅ 커뮤니티 (게시물, 좋아요)

---

## 🚀 프론트엔드 실행 방법

### 1. 의존성 설치 (처음 한 번만)
```bash
cd C:\vegan\Veganing-web
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:5173` 접속

---

## 📝 API 사용 예시

### Login 페이지 (예시)

```javascript
import { login, saveToken, saveUser } from '@/api/backend';

const handleLogin = async (email, password) => {
  try {
    const response = await login({ email, password });

    // 토큰 저장
    saveToken(response.token);
    saveUser(response.user);

    alert('로그인 성공!');
    // 메인 페이지로 이동
  } catch (error) {
    alert('로그인 실패: ' + error.message);
  }
};
```

### SignUp 페이지 (예시)

```javascript
import { signup, saveToken, saveUser } from '@/api/backend';

const handleSignup = async (userData) => {
  try {
    const response = await signup({
      email: userData.email,
      password: userData.password,
      nickname: userData.nickname,
      veganType: userData.veganType
    });

    saveToken(response.token);
    saveUser(response.user);

    alert('회원가입 성공!');
  } catch (error) {
    alert('회원가입 실패: ' + error.message);
  }
};
```

### 챌린지 페이지 (예시)

```javascript
import { getCurrentChallenge, getToken } from '@/api/backend';

const fetchChallenge = async () => {
  try {
    const token = getToken();
    const response = await getCurrentChallenge(token);
    console.log('현재 챌린지:', response.challenge);
  } catch (error) {
    console.error('챌린지 조회 실패:', error.message);
  }
};
```

---

## 🧪 API 테스트 방법

### 방법 1: 브라우저 콘솔에서 테스트

개발 서버 실행 후, 브라우저 콘솔(F12)에서:

```javascript
// 회원가입 테스트
const testSignup = async () => {
  const { signup, saveToken } = await import('/src/api/backend.js');
  const response = await signup({
    email: 'test@example.com',
    password: 'test1234',
    nickname: '테스터',
    veganType: 'vegan'
  });
  saveToken(response.token);
  console.log('회원가입 성공!', response);
};
testSignup();
```

### 방법 2: 테스트 페이지 만들기

`src/pages/test/ApiTest.jsx` 파일 생성하고 각 API 테스트

---

## 📂 추가된 파일 구조

```
Veganing-web/
├── .env                          ✅ (환경 변수)
├── .env.example                  ✅ (환경 변수 예시)
├── API_SETUP.md                  ✅ (이 파일)
└── src/
    ├── config/
    │   └── api.js                ✅ (API 설정)
    └── api/
        ├── backend.js            ✅ (백엔드 API 함수)
        ├── README.md             ✅ (사용 가이드)
        ├── naver.js              (기존 - 현재 미사용)
        └── openai.js             (기존)
```

---

## 🔐 인증 흐름

1. **회원가입/로그인** → JWT 토큰 받기
2. **토큰 저장** → `saveToken(token)`
3. **API 호출시 토큰 전달** → `apiFunction(data, token)`
4. **로그아웃** → `logout()` (토큰 삭제)

---

## ⚠️ 주의사항

### 1. .env 파일 Git 커밋 금지
- ✅ `.gitignore`에 이미 추가되어 있음
- API 키 등 민감 정보는 .env에만 저장

### 2. 로컬 개발시
로컬 백엔드를 사용하려면 `.env` 수정:
```
VITE_API_BASE_URL=http://localhost:3000
```

### 3. CORS 설정
프론트엔드 배포 후 백엔드에 환경 변수 추가:
```
ALLOWED_ORIGINS=https://your-frontend-domain.com
```

---

## 🎯 다음 단계

### 1. 로컬 테스트
```bash
cd C:\vegan\Veganing-web
npm install
npm run dev
```

### 2. Login/SignUp 페이지에 API 연결
- `src/pages/user/Login.jsx`
- `src/pages/user/SignUp.jsx`

### 3. 챌린지 페이지에 API 연결
- `src/pages/challenge/ChallengeMain.jsx`

### 4. 커뮤니티 페이지에 API 연결
- `src/pages/community/Community.jsx`

### 5. 프론트엔드 배포 (Vercel/Netlify)

---

## 📞 문제 해결

### API 호출 실패시
1. 백엔드가 실행중인지 확인: https://veganing-backend.onrender.com
2. 브라우저 콘솔에서 에러 메시지 확인
3. 네트워크 탭에서 요청/응답 확인

### CORS 에러
백엔드 Render Dashboard에서 `ALLOWED_ORIGINS` 환경 변수 추가

---

**축하합니다! 프론트엔드와 백엔드 연결 준비가 완료되었습니다!** 🎉
