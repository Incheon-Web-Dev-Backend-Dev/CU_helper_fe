import { redirect } from "next/navigation";
import { getProductsByStore } from "@/lib/data/mockProducts";
import { ProductList } from "@/components/product";

const STORE_NAMES: Record<number, string> = {
  1: "장현루벤시아21단지점",
  2: "은계꽃길점",
};

/*** 상품 페이지 - storeId 파라미터로 매장 구분, UI는 동일 ***/
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

  const products = getProductsByStore(storeId);
  const storeName = STORE_NAMES[storeId];

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      <ProductList products={products} storeName={storeName} />
    </div>
  );
}
