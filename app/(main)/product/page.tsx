/*** 상품 페이지 - 지점 파라미터를 받아 표시 ***/
export default async function ProductPage({
  searchParams,
}: {
  searchParams: Promise<{ store?: string }>;
}) {
  const { store } = await searchParams;

  return (
    <div className="px-5 py-8">
      <p>product(파라미터: {store ?? "없음"})</p>
    </div>
  );
}
