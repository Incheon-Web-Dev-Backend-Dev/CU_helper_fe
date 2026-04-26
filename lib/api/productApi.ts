/*** 상품 관련 API 함수 ***/
import apiClient from "@/lib/api/client";

/*** 백엔드 ProductDto 응답 타입 ***/
export interface ProductDto {
  id: number;
  barcode: number;
  name: string;
  consumerPrice: number;
  isEvent: boolean;
  eventType: number | null;
  quantity: number;
  createdAt: string;
  image: string | null;
  description: string | null;
}

/*** 상품 등록 요청 타입 ***/
export interface ProductCreateRequest {
  barcode: number;
  name: string;
  consumerPrice: number;
  isEvent: boolean;
  eventType: number | null;
  quantity: number;
  description: string;
  image?: File | null;
}

/*** File → base64 문자열 변환 유틸 ***/
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/*** 상품 전체 조회 ***/
export async function getAllProducts(): Promise<ProductDto[]> {
  const response = await apiClient.get("/api/products");
  return response.data;
}

/*** 상품 등록 - JSON @RequestBody 방식 ***/
export async function createProduct(data: ProductCreateRequest): Promise<void> {
  const imageBase64 = data.image ? await fileToBase64(data.image) : null;

  await apiClient.post("/api/products", {
    barcode: data.barcode,
    name: data.name,
    consumerPrice: data.consumerPrice,
    isEvent: data.isEvent,
    eventType: data.eventType,
    quantity: data.quantity,
    description: data.description,
    image: imageBase64,
  });
}
