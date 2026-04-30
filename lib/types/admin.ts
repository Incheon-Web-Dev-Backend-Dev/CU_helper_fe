/*** 관리자 인증 타입 정의 ***/

export interface AdminLoginRequest {
  password: string;
}

export interface AdminLoginResponse {
  adminKey: string;
}
