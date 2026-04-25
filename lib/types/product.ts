/*** 상품 타입 - products 테이블 스키마 기준 ***/
export interface Product {
  id: number;
  storeId: number; /*** 클라이언트 필터링용 (실제 DB에선 store_product 관계 테이블) ***/
  name: string;
  consumerPrice: number;
  isEvent: boolean;
  eventType: 0 | 1 | 2; /*** 0: 행사없음, 1: 1+1, 2: 2+1 ***/
  eventPrice: number | null;
  quantity: number; /*** 재고 수량 ***/
  image: string | null;
  description: string | null;
}

/*** 장바구니 수량 상태 타입 ***/
export type CartQuantities = Record<number, number>;
