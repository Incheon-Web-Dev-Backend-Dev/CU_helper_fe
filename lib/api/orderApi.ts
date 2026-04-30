/*** 주문 관련 API 함수 ***/
import apiClient from "@/lib/api/client";
import { OrderDetailRequest, OrderDetailResponse, OrderRequest, OrderResponse } from "@/lib/types/order";

/*** 주문 생성 - 예약자 정보 + 상품 목록 POST ***/
export async function createOrder(data: OrderRequest): Promise<OrderResponse> {
  const response = await apiClient.post<OrderResponse>("/api/orders", data);
  return response.data;
}

/*** 주문 상세조회 - 이름/전화번호/비밀번호 본인 인증 후 주문 및 상품 목록 반환 ***/
export async function getOrderDetail(data: OrderDetailRequest): Promise<OrderDetailResponse> {
  const response = await apiClient.post<OrderDetailResponse>("/api/orders/detail", data);
  return response.data;
}
