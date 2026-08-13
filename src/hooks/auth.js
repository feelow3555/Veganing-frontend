// 위치: src/hooks/auth.js

// --- [간단 로컬 인증 저장/이벤트 시스템] -----------------
const AUTH_KEY = "veganing_auth";
const listeners = new Set();

function emit() {
    const auth = getAuth();
    listeners.forEach((cb) => {
    try { cb(auth); } catch (_) {}
    });
}

// 현재 로그인 상태 얻기
export function getAuth() {
    try {
        const raw = localStorage.getItem(AUTH_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

// 로그인 상태 저장(이벤트 알림 포함)
export function setAuth(auth) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    emit();
}

// 로그아웃(저장소 제거 + 이벤트 알림)
export function clearAuth() {
    localStorage.removeItem(AUTH_KEY);
    emit();
}

// 헤더 등에서 상태변경 구독할 때 사용
export function onAuthChanged(cb) {
    listeners.add(cb);
  return () => listeners.delete(cb); // 해제용
}

// --- [테스트용 계정] --------------------------------------
// 필요시 이메일/비번/이름을 여기서 원하는 값으로 바꿔 써.
const SEED_USERS = [
    { email: "vegan@example.com", password: "1234", name: "김비건" },
    { email: "test@example.com",  password: "1234", name: "테스트"  },
];

// 이메일/비번으로 로그인 → 성공 시 setAuth 호출
export async function loginWithPassword(email, password) {
  // 실제 API를 붙일 때는 여기서 fetch/axios로 교체
    const found = SEED_USERS.find(
        (u) => u.email === email && u.password === password
    );
  await new Promise((r) => setTimeout(r, 300)); // 살짝 딜레이(UX)

    if (!found) {
    const err = new Error("INVALID_CREDENTIALS");
    err.code = "INVALID_CREDENTIALS";
    throw err;
    }

  // 최소 정보만 저장(원하면 토큰 등 추가)
    setAuth({ email: found.email, name: found.name });
    return { email: found.email, name: found.name };
}
