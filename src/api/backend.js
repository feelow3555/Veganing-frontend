// 백엔드 API 호출 함수들
import { apiClient } from '../config/api';
import API_BASE_URL from '../config/api';

// ==========================================
// 인증 API
// ==========================================

/**
 * 회원가입
 * @param {Object} userData - { email, password, nickname, veganType }
 * @returns {Promise<Object>} - { message, user, token }
 */
export const signup = async (userData) => {
  return await apiClient.post(`${API_BASE_URL}/api/auth/signup`, userData);
};

/**
 * 로그인
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} - { message, user, token }
 */
export const login = async (credentials) => {
  return await apiClient.post(`${API_BASE_URL}/api/auth/login`, credentials);
};

/**
 * 내 프로필 조회 (JWT 토큰 필요)
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { user }
 */
export const getMyProfile = async (token) => {
  return await apiClient.get(`${API_BASE_URL}/api/auth/me`, token);
};

/**
 * 프로필 수정 (JWT 토큰 필요)
 * @param {Object} updateData - { nickname?, veganType?, profileImage? }
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, user }
 */
export const updateProfile = async (updateData, token) => {
  return await apiClient.put(`${API_BASE_URL}/api/auth/profile`, updateData, token);
};

// ==========================================
// 챌린지 API
// ==========================================

/**
 * 새 챌린지 시작 (JWT 토큰 필요)
 * @param {Object} challengeData - { title, description, duration, difficulty? }
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, challenge }
 */
export const startChallenge = async (challengeData, token) => {
  return await apiClient.post(`${API_BASE_URL}/api/challenge/start`, challengeData, token);
};

/**
 * 현재 진행중인 챌린지 조회 (JWT 토큰 필요)
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { challenge }
 */
export const getCurrentChallenge = async (token) => {
  return await apiClient.get(`${API_BASE_URL}/api/challenge/current`, token);
};

/**
 * 챌린지 히스토리 조회 (JWT 토큰 필요)
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { challenges }
 */
export const getChallengeHistory = async (token) => {
  return await apiClient.get(`${API_BASE_URL}/api/challenge/history`, token);
};

/**
 * 챌린지 통계 조회 (JWT 토큰 필요)
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { stats }
 */
export const getChallengeStats = async (token) => {
  return await apiClient.get(`${API_BASE_URL}/api/challenge/stats`, token);
};

/**
 * 챌린지 진행률 업데이트 (JWT 토큰 필요)
 * @param {number} challengeId - 챌린지 ID
 * @param {number} progress - 진행률 (0-100)
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, challenge }
 */
export const updateChallengeProgress = async (challengeId, progress, token) => {
  return await apiClient.put(`${API_BASE_URL}/api/challenge/${challengeId}/progress`, { progress }, token);
};

/**
 * 챌린지 포기 (JWT 토큰 필요)
 * @param {number} challengeId - 챌린지 ID
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, challenge }
 */
export const quitChallenge = async (challengeId, token) => {
  return await apiClient.put(`${API_BASE_URL}/api/challenge/${challengeId}/quit`, {}, token);
};

/**
 * 포인트 추가 및 레벨업 (식단 저장 시) (JWT 토큰 필요)
 * @param {number} points - 추가할 포인트 (기본값: 200)
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, user }
 */
export const addPoints = async (points = 200, token) => {
  return await apiClient.post(`${API_BASE_URL}/api/challenge/add-points`, { points, reason: '식단 저장' }, token);
};

// ==========================================
// 커뮤니티 API
// ==========================================

/**
 * 게시물 목록 조회
 * @param {Object} params - { limit?, offset?, category? }
 * @returns {Promise<Object>} - { posts, total }
 */
export const getPosts = async (params = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const url = queryString ? `${API_BASE_URL}/api/community/posts?${queryString}` : `${API_BASE_URL}/api/community/posts`;
  return await apiClient.get(url);
};

/**
 * 게시물 상세 조회
 * @param {number} postId - 게시물 ID
 * @returns {Promise<Object>} - { post }
 */
export const getPostDetail = async (postId) => {
  return await apiClient.get(`${API_BASE_URL}/api/community/posts/${postId}`);
};

/**
 * 게시물 작성 (JWT 토큰 필요)
 * @param {Object} postData - { content, imageUrl?, category? }
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, post }
 */
export const createPost = async (postData, token) => {
  return await apiClient.post(`${API_BASE_URL}/api/community/posts`, postData, token);
};

/**
 * 게시물 수정 (JWT 토큰 필요)
 * @param {number} postId - 게시물 ID
 * @param {Object} postData - { content?, imageUrl?, category? }
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, post }
 */
export const updatePost = async (postId, postData, token) => {
  return await apiClient.put(`${API_BASE_URL}/api/community/posts/${postId}`, postData, token);
};

/**
 * 게시물 삭제 (JWT 토큰 필요)
 * @param {number} postId - 게시물 ID
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message }
 */
export const deletePost = async (postId, token) => {
  return await apiClient.delete(`${API_BASE_URL}/api/community/posts/${postId}`, token);
};

/**
 * 게시물 좋아요 (JWT 토큰 필요)
 * @param {number} postId - 게시물 ID
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, likes }
 */
export const likePost = async (postId, token) => {
  return await apiClient.post(`${API_BASE_URL}/api/community/posts/${postId}/like`, {}, token);
};

/**
 * 게시물 댓글 목록 조회
 * @param {number} postId - 게시물 ID
 * @returns {Promise<Object>} - { comments }
 */
export const getComments = async (postId) => {
  return await apiClient.get(`${API_BASE_URL}/api/community/posts/${postId}/comments`);
};

/**
 * 댓글 작성 (JWT 토큰 필요)
 * @param {number} postId - 게시물 ID
 * @param {Object} commentData - { content }
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, comment }
 */
export const createComment = async (postId, commentData, token) => {
  return await apiClient.post(`${API_BASE_URL}/api/community/posts/${postId}/comments`, commentData, token);
};

/**
 * 댓글 삭제 (JWT 토큰 필요)
 * @param {number} commentId - 댓글 ID
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message }
 */
export const deleteComment = async (commentId, token) => {
  return await apiClient.delete(`${API_BASE_URL}/api/community/comments/${commentId}`, token);
};

/**
 * 커뮤니티 챌린지 목록 조회
 * @returns {Promise<Object>} - { challenges }
 */
export const getCommunityChallenges = async () => {
  return { data: [] }; // Spring Boot 미구현
};

/**
 * 커뮤니티 챌린지 상세 조회
 * @param {number} challengeId - 챌린지 ID
 * @returns {Promise<Object>} - { challenge }
 */
export const getCommunityChallenge = async (challengeId) => {
  return { data: null }; // Spring Boot 미구현
};

/**
 * 커뮤니티 챌린지 참여 (JWT 토큰 필요)
 * @param {number} challengeId - 챌린지 ID
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { message, userChallenge }
 */
export const joinCommunityChallenge = async (challengeId, token) => {
  return { data: null }; // Spring Boot 미구현
};

/**
 * 내 챌린지 목록 조회 (JWT 토큰 필요)
 * @param {Object} params - { status? }
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { challenges }
 */
export const getMyChallenges = async (params = {}, token) => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/api/challenge/history`;
  return await apiClient.get(url, token);
};

// ==========================================
// 토큰 관리 헬퍼 함수
// ==========================================

/**
 * 로컬 스토리지에 토큰 저장
 * @param {string} token - JWT 토큰
 */
export const saveToken = (token) => {
  localStorage.setItem('authToken', token);
};

/**
 * 로컬 스토리지에서 토큰 가져오기
 * @returns {string|null} - JWT 토큰
 */
export const getToken = () => {
  return localStorage.getItem('authToken');
};

/**
 * 로컬 스토리지에서 토큰 삭제
 */
export const removeToken = () => {
  localStorage.removeItem('authToken');
};

/**
 * 사용자 정보 저장
 * @param {Object} user - 사용자 객체
 */
export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

/**
 * 사용자 정보 가져오기
 * @returns {Object|null} - 사용자 객체
 */
export const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * 사용자 정보 삭제
 */
export const removeUser = () => {
  localStorage.removeItem('user');
};

/**
 * 로그아웃 (토큰 및 사용자 정보 삭제)
 */
export const logout = () => {
  removeToken();
  removeUser();
};

// ==========================================
// 홈 화면 Hero 데이터 API
// ==========================================

/**
 * 홈 히어로 섹션 데이터 조회
 * @param {string} token - JWT 토큰
 * @returns {Promise<Object>} - { images, participants, successRate, satisfaction }
 */
export const getHomeHeroData = async (token) => {
  return await apiClient.get(`${API_BASE_URL}/api/home/hero`, token);
};

// ==========================================
// MEAL API
// ==========================================
export const getUploadUrl = (token) => apiClient.get(`${API_BASE_URL}/api/meal/upload-url`, token);
export const analyzeMeal = (data, token) => apiClient.post(`${API_BASE_URL}/api/meal`, data, token);
export const getMeal = (mealId, token) => apiClient.get(`${API_BASE_URL}/api/meal/${mealId}`, token);
export const getMealHistory = (token) => apiClient.get(`${API_BASE_URL}/api/meal/history`, token);
export const getRecommend = (token) => apiClient.get(`${API_BASE_URL}/api/meal/recommend`, token);

// ==========================================
// RECIPE API
// ==========================================
export const getTodayRecipes = (token) => apiClient.get(`${API_BASE_URL}/api/recipe/today`, token);

export const uploadToS3 = async (presignedUrl, file) => {
  const response = await fetch(presignedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });
  if (!response.ok) throw new Error('S3 업로드 실패');
};

// ==========================================
// CARBON API
// ==========================================
export const getCarbonStats = (token) => apiClient.get(`${API_BASE_URL}/api/carbon/stats`, token);
export const getCarbonToday = (token) => apiClient.get(`${API_BASE_URL}/api/carbon/today`, token);
export const getCarbonHistory = (days = 7, token) => apiClient.get(`${API_BASE_URL}/api/carbon/history?days=${days}`, token);

// ==========================================
// PRODUCT API
// ==========================================
export const getProducts = (page = 0, size = 20) => apiClient.get(`${API_BASE_URL}/api/product?page=${page}&size=${size}`);
export const getProduct = (id) => apiClient.get(`${API_BASE_URL}/api/product/${id}`);

// ==========================================
// CART API
// ==========================================
export const getCart = (token) => apiClient.get(`${API_BASE_URL}/api/cart`, token);
export const addCartItem = (data, token) => apiClient.post(`${API_BASE_URL}/api/cart`, data, token);
export const updateCartItem = (cartItemId, data, token) => apiClient.put(`${API_BASE_URL}/api/cart/${cartItemId}`, data, token);
export const removeCartItem = (cartItemId, token) => apiClient.delete(`${API_BASE_URL}/api/cart/${cartItemId}`, token);

// ==========================================
// ORDER API
// ==========================================
export const createOrder = (data, token) => apiClient.post(`${API_BASE_URL}/api/order`, data, token);
export const getMyOrders = (token) => apiClient.get(`${API_BASE_URL}/api/order`, token);
export const getOrder = (orderId, token) => apiClient.get(`${API_BASE_URL}/api/order/${orderId}`, token);

// 좋아요 순 게시글 (레시피 랭킹용)
export const getPostsByLikes = async (size = 10) => {
  return await apiClient.get(`${API_BASE_URL}/api/community/posts?page=0&size=${size}&sort=likeCount,desc`);
};
