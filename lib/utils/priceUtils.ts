/*** 이벤트 타입별 실제 결제 금액 계산 ***/
export function calcItemTotal(
  consumerPrice: number,
  quantity: number,
  isEvent: boolean,
  eventType: 0 | 1 | 2
): number {
  if (!isEvent || quantity === 0) return consumerPrice * quantity;
  if (eventType === 1) return Math.ceil(quantity / 2) * consumerPrice;
  if (eventType === 2) return (quantity - Math.floor(quantity / 3)) * consumerPrice;
  return consumerPrice * quantity;
}

/*** 이벤트 혜택으로 무료 제공되는 수량 ***/
export function calcFreeQty(
  quantity: number,
  isEvent: boolean,
  eventType: 0 | 1 | 2
): number {
  if (!isEvent || quantity === 0) return 0;
  if (eventType === 1) return Math.floor(quantity / 2);
  if (eventType === 2) return Math.floor(quantity / 3);
  return 0;
}
