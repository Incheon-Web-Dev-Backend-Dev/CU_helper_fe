/*** 관리자 인증 API ***/
import apiClient from "@/lib/api/client";
import { AdminLoginResponse } from "@/lib/types/admin";

/*** 관리자 로그인 - 비밀번호 검증 후 adminKey 반환 ***/
export async function adminLogin(password: string): Promise<AdminLoginResponse> {
  const response = await apiClient.post<AdminLoginResponse>("/api/admin/login", { password });
  return response.data;
}
