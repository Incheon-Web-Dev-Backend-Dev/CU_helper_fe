/*** Axios 공통 인스턴스 - 모든 API 요청의 기반 설정 ***/
import axios from "axios";

/*** 백엔드 기본 URL (.env.local의 NEXT_PUBLIC_API_BASE_URL) ***/
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

/*** 요청 인터셉터 - 공통 헤더 처리 (토큰 등 추후 확장) ***/
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

/*** 응답 인터셉터 - 공통 에러 처리 ***/
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;
