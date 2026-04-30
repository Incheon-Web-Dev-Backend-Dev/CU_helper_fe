import { redirect } from "next/navigation";
import { getAllProducts } from "@/lib/api/productApi";
import { ProductList } from "@/components/product";

const STORE_NAMES: Record<number, string> = {
  1: "장현루벤시아21단지점",
  2: "은계꽃길점",
};

/*** 상품 페이지 - storeId 파라미터로 매장 구분, 상품 목록은 전체 공통 ***/
export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store } = await searchParams;
  const storeId = Number(store);

  if (!storeId || !STORE_NAMES[storeId]) {
    redirect("/select");
  }

  const storeName = STORE_NAMES[storeId];
  const products = await getAllProducts();

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <ProductList products={products} storeName={storeName} storeId={storeId} />
    </div>
  );
}
