/*** 백엔드 연결 테스트 API - TestController (/api/test) ***/
import apiClient from "@/lib/api/client";

/*** 백엔드 ping 응답 타입 ***/
interface PingResponse {
  status: string;
  message: string;
}

/*** POST /api/test/ping - 서버 연결 상태 확인 ***/
export const pingServer = async (): Promise<PingResponse> => {
  const { data } = await apiClient.post<PingResponse>("/api/test/ping");
  return data;
};
