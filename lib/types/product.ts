/*** 상품 타입 - products 테이블 스키마 기준 ***/
export interface Product {
  id: number;
  name: string;
  consumerPrice: number;
  isEvent: boolean;
  eventType: 0 | 1 | 2;
  /*** 행사 가격 (행사 적용 시 기준 금액) ***/
  eventPrice: number | null;
  quantity: number;
  createdAt: string;
  image: string | null;
  description: string | null;
  barcode?: number;
}

/*** 장바구니 수량 상태 타입 ***/
export type CartQuantities = Record<number, number>;
