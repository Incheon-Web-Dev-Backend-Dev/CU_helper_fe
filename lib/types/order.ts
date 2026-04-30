/*** 주문 상품 요청 타입 - order_items 테이블 삽입용 ***/
export interface OrderItemRequest {
  productId: number;
  price: number;
  quantity: number;
  /*** 서버 가격 검증용 이벤트 타입 (0: 없음, 1: 1+1, 2: 2+1) ***/
  eventType: 0 | 1 | 2;
}

/*** 주문 생성 요청 타입 - POST /api/orders ***/
export interface OrderRequest {
  name: string;
  phone: string;
  password: string;
  totalPrice: number;
  storeCode: number;
  items: OrderItemRequest[];
}

/*** 주문 응답 타입 - Supabase orders 테이블 스키마 기준 ***/
export interface OrderResponse {
  id: number;
  orderNumber: number;
  name: string;
  phone: string;
  totalPrice: number;
  isPaid: boolean;
  createdAt: string;
  storeCode: number;
}

/*** 주문 상세조회 요청 타입 - POST /api/orders/detail ***/
export interface OrderDetailRequest {
  name: string;
  phone: string;
  password: string;
}

/*** 주문 상품 상세 타입 - order_items 테이블 응답 스키마 기준 ***/
export interface OrderItemDetail {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
  isReceived: boolean;
  createdAt: string;
}

/*** 주문 상세조회 응답 타입 - 주문 기본 정보 + 상품 목록 ***/
export interface OrderDetailResponse {
  order: OrderResponse;
  items: OrderItemDetail[];
}
