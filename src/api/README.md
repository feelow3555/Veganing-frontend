# 백엔드 API 사용 가이드

## 📁 파일 구조

```
src/
├── config/
│   └── api.js           # API 설정 및 헬퍼 함수
└── api/
    ├── backend.js       # 백엔드 API 호출 함수들
    ├── naver.js         # 네이버 API (현재 미사용)
    └── openai.js        # OpenAI API
```

## 🔧 설정

### 1. 환경 변수 (.env)

```bash
# 배포된 백엔드 사용
VITE_API_BASE_URL=https://veganing-backend.onrender.com

# 로컬 백엔드 사용 (개발시)
# VITE_API_BASE_URL=http://localhost:3000
```

### 2. API 기본 URL 확인

프로젝트 루트의 `.env` 파일에서 설정됩니다.

---

## 📚 사용 예시

### 인증 (Authentication)

#### 회원가입
```javascript
import { signup, saveToken, saveUser } from '@/api/backend';

const handleSignup = async () => {
  try {
    const response = await signup({
      email: 'user@example.com',
      password: 'password123',
      nickname: '비건유저',
      veganType: 'vegan' // vegan, lacto, ovo, lacto-ovo, pescatarian, flexitarian
    });

    // 토큰과 사용자 정보 저장
    saveToken(response.token);
    saveUser(response.user);

    console.log('회원가입 성공:', response.user);
  } catch (error) {
    console.error('회원가입 실패:', error.message);
  }
};
```

#### 로그인
```javascript
import { login, saveToken, saveUser } from '@/api/backend';

const handleLogin = async () => {
  try {
    const response = await login({
      email: 'user@example.com',
      password: 'password123'
    });

    // 토큰과 사용자 정보 저장
    saveToken(response.token);
    saveUser(response.user);

    console.log('로그인 성공:', response.user);
  } catch (error) {
    console.error('로그인 실패:', error.message);
  }
};
```

#### 내 프로필 조회
```javascript
import { getMyProfile, getToken } from '@/api/backend';

const fetchMyProfile = async () => {
  try {
    const token = getToken();
    const response = await getMyProfile(token);
    console.log('내 정보:', response.user);
  } catch (error) {
    console.error('프로필 조회 실패:', error.message);
  }
};
```

#### 프로필 수정
```javascript
import { updateProfile, getToken } from '@/api/backend';

const updateMyProfile = async () => {
  try {
    const token = getToken();
    const response = await updateProfile({
      nickname: '새로운닉네임',
      veganType: 'lacto-ovo'
    }, token);
    console.log('프로필 수정 성공:', response.user);
  } catch (error) {
    console.error('프로필 수정 실패:', error.message);
  }
};
```

#### 로그아웃
```javascript
import { logout } from '@/api/backend';

const handleLogout = () => {
  logout(); // 토큰과 사용자 정보 삭제
  console.log('로그아웃 완료');
  // 로그인 페이지로 이동
};
```

---

### 챌린지 (Challenge)

#### 새 챌린지 시작
```javascript
import { startChallenge, getToken } from '@/api/backend';

const createNewChallenge = async () => {
  try {
    const token = getToken();
    const response = await startChallenge({
      title: '7일 비건 챌린지',
      description: '일주일 동안 비건 식단에 도전!',
      duration: 7, // 일수
      difficulty: 'easy' // easy, medium, hard
    }, token);
    console.log('챌린지 시작:', response.challenge);
  } catch (error) {
    console.error('챌린지 시작 실패:', error.message);
  }
};
```

#### 현재 진행중인 챌린지 조회
```javascript
import { getCurrentChallenge, getToken } from '@/api/backend';

const fetchCurrentChallenge = async () => {
  try {
    const token = getToken();
    const response = await getCurrentChallenge(token);
    console.log('현재 챌린지:', response.challenge);
  } catch (error) {
    console.error('챌린지 조회 실패:', error.message);
  }
};
```

#### 챌린지 진행률 업데이트
```javascript
import { updateChallengeProgress, getToken } from '@/api/backend';

const updateProgress = async (challengeId) => {
  try {
    const token = getToken();
    const response = await updateChallengeProgress(challengeId, 50, token); // 50% 진행
    console.log('진행률 업데이트:', response.challenge);
  } catch (error) {
    console.error('진행률 업데이트 실패:', error.message);
  }
};
```

#### 챌린지 통계 조회
```javascript
import { getChallengeStats, getToken } from '@/api/backend';

const fetchStats = async () => {
  try {
    const token = getToken();
    const response = await getChallengeStats(token);
    console.log('챌린지 통계:', response.stats);
  } catch (error) {
    console.error('통계 조회 실패:', error.message);
  }
};
```

---

### 커뮤니티 (Community)

#### 게시물 목록 조회
```javascript
import { getPosts } from '@/api/backend';

const fetchPosts = async () => {
  try {
    const response = await getPosts({
      limit: 20,
      offset: 0,
      category: 'recipe' // recipe, story, tip, question
    });
    console.log('게시물 목록:', response.posts);
  } catch (error) {
    console.error('게시물 조회 실패:', error.message);
  }
};
```

#### 게시물 작성
```javascript
import { createPost, getToken } from '@/api/backend';

const writePost = async () => {
  try {
    const token = getToken();
    const response = await createPost({
      content: '오늘의 비건 레시피 공유합니다!',
      imageUrl: 'https://example.com/image.jpg',
      category: 'recipe'
    }, token);
    console.log('게시물 작성 완료:', response.post);
  } catch (error) {
    console.error('게시물 작성 실패:', error.message);
  }
};
```

#### 게시물 좋아요
```javascript
import { likePost, getToken } from '@/api/backend';

const handleLike = async (postId) => {
  try {
    const token = getToken();
    const response = await likePost(postId, token);
    console.log('좋아요 완료:', response.likes);
  } catch (error) {
    console.error('좋아요 실패:', error.message);
  }
};
```

#### 커뮤니티 챌린지 목록 조회
```javascript
import { getCommunityChallenges } from '@/api/backend';

const fetchCommunityChallenges = async () => {
  try {
    const response = await getCommunityChallenges();
    console.log('챌린지 목록:', response.challenges);
  } catch (error) {
    console.error('챌린지 조회 실패:', error.message);
  }
};
```

#### 커뮤니티 챌린지 참여
```javascript
import { joinCommunityChallenge, getToken } from '@/api/backend';

const joinChallenge = async (challengeId) => {
  try {
    const token = getToken();
    const response = await joinCommunityChallenge(challengeId, token);
    console.log('챌린지 참여 완료:', response.userChallenge);
  } catch (error) {
    console.error('챌린지 참여 실패:', error.message);
  }
};
```

---

## 🔐 인증이 필요한 API

다음 API는 JWT 토큰이 필요합니다:

- ✅ 프로필 조회/수정
- ✅ 챌린지 시작/진행/포기
- ✅ 게시물 작성/수정/삭제
- ✅ 게시물 좋아요
- ✅ 커뮤니티 챌린지 참여

**토큰 사용 방법:**
```javascript
import { getToken } from '@/api/backend';

const token = getToken(); // localStorage에서 토큰 가져오기
```

---

## ⚠️ 에러 처리

모든 API 함수는 에러 발생시 `throw Error`를 하므로, `try-catch`로 처리해야 합니다:

```javascript
try {
  const response = await someApiFunction();
  // 성공 처리
} catch (error) {
  console.error('API 오류:', error.message);
  // 에러 처리 (예: 에러 메시지 표시)
}
```

---

## 🌐 API 엔드포인트

배포된 백엔드: **https://veganing-backend.onrender.com**

전체 엔드포인트는 `src/config/api.js`에서 확인할 수 있습니다.

---

## 📝 비건 타입 (veganType)

- `vegan` - 완전 비건
- `lacto` - 락토 베지테리언 (유제품 O)
- `ovo` - 오보 베지테리언 (계란 O)
- `lacto-ovo` - 락토-오보 (유제품 + 계란 O)
- `pescatarian` - 페스코 (해산물 O)
- `flexitarian` - 플렉시테리언 (가끔 육류)

---

## 🎯 다음 단계

1. Login.jsx / SignUp.jsx에서 `backend.js` 함수 사용
2. 챌린지 페이지에서 API 연동
3. 커뮤니티 페이지에서 게시물 API 연동
4. 로컬에서 테스트 후 배포
