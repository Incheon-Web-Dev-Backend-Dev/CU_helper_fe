"use client";

import { useState, useRef, ChangeEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ImagePlus, X, Loader2 } from "lucide-react";
import { createProduct } from "@/lib/api/productApi";

/*** 상품 등록 폼 상태 타입 ***/
interface ProductForm {
  barcode: string;
  name: string;
  consumerPrice: string;
  isEvent: boolean;
  eventType: "1" | "2" | "";
  quantity: string;
  description: string;
}

const INITIAL_FORM: ProductForm = {
  barcode: "",
  name: "",
  consumerPrice: "",
  isEvent: false,
  eventType: "",
  quantity: "",
  description: "",
};

const DESCRIPTION_MAX = 50;

/*** 상품 등록 페이지 ***/
export default function ProductNewPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductForm>(INITIAL_FORM);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ProductForm, string>>>({});

  /*** 텍스트/숫자 입력 핸들러 ***/
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  /*** 상세설명 입력 핸들러 - 50자 제한 ***/
  const handleDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, DESCRIPTION_MAX);
    setForm((prev) => ({ ...prev, description: value }));
    setErrors((prev) => ({ ...prev, description: "" }));
  };

  /*** 행사여부 토글 핸들러 ***/
  const handleEventToggle = (checked: boolean) => {
    setForm((prev) => ({
      ...prev,
      isEvent: checked,
      eventType: checked ? prev.eventType : "",
    }));
    if (!checked) setErrors((prev) => ({ ...prev, eventType: "" }));
  };

  /*** 이미지 파일 선택 핸들러 ***/
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  /*** 이미지 제거 핸들러 ***/
  const handleImageRemove = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /*** 폼 유효성 검사 ***/
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ProductForm, string>> = {};

    if (!form.barcode) {
      newErrors.barcode = "바코드 번호를 입력해 주세요.";
    } else if (isNaN(Number(form.barcode)) || Number(form.barcode) <= 0) {
      newErrors.barcode = "올바른 바코드 번호를 입력해 주세요.";
    }
    if (!form.name.trim()) newErrors.name = "상품 이름을 입력해 주세요.";
    if (!form.consumerPrice) {
      newErrors.consumerPrice = "소비자 가격을 입력해 주세요.";
    } else if (Number(form.consumerPrice) <= 0) {
      newErrors.consumerPrice = "0보다 큰 금액을 입력해 주세요.";
    }
    if (!form.quantity) {
      newErrors.quantity = "재고 수량을 입력해 주세요.";
    } else if (Number(form.quantity) < 0) {
      newErrors.quantity = "0 이상의 수량을 입력해 주세요.";
    }
    if (!form.description.trim()) newErrors.description = "상세 설명을 입력해 주세요.";
    if (form.isEvent && !form.eventType) newErrors.eventType = "행사 타입을 선택해 주세요.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /*** 상품 등록 제출 핸들러 ***/
  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const payload = {
      barcode: Number(form.barcode),
      name: form.name.trim(),
      consumerPrice: Number(form.consumerPrice),
      isEvent: form.isEvent,
      eventType: form.isEvent ? Number(form.eventType) : null,
      quantity: Number(form.quantity),
      description: form.description.trim(),
      image: imageFile,
    };
    console.log("[상품 등록] 전송 데이터:", payload);
    try {
      await createProduct({
        barcode: Number(form.barcode),
        name: form.name.trim(),
        consumerPrice: Number(form.consumerPrice),
        isEvent: form.isEvent,
        eventType: form.isEvent ? Number(form.eventType) : null,
        quantity: Number(form.quantity),
        description: form.description.trim(),
        image: imageFile,
      });
      router.push("/admin/products");
    } catch (error) {
      console.error("[상품 등록] 실패:", error);
      alert("상품 등록에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-10">

      {/*** 상단 헤더 ***/}
      <div className="bg-linear-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-10">
        <Link
          href="/admin"
          className="mb-4 inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
        >
          <ChevronLeft size={14} />
          관리자 홈
        </Link>
        <h1 className="text-lg font-bold text-white">상품 등록</h1>
        <p className="mt-1 text-xs text-white/70">새 상품 정보를 입력하세요.</p>
      </div>

      {/*** 등록 폼 ***/}
      <form onSubmit={handleSubmit} className="px-4 -mt-6 space-y-3">

        {/*** 바코드 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">
            바코드 번호 <span className="text-[#693B97]">*</span>
          </label>
          <input
            type="number"
            name="barcode"
            value={form.barcode}
            onChange={handleChange}
            placeholder="바코드 번호를 입력하세요"
            min={1}
            className="w-full rounded-xl border border-zinc-200 bg-[#F8F8F8] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-colors focus:border-[#693B97] focus:bg-white"
          />
          {errors.barcode && <p className="mt-1.5 text-xs text-red-500">{errors.barcode}</p>}
        </div>

        {/*** 상품 이름 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">
            상품 이름 <span className="text-[#693B97]">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="상품 이름을 입력하세요"
            className="w-full rounded-xl border border-zinc-200 bg-[#F8F8F8] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-colors focus:border-[#693B97] focus:bg-white"
          />
          {errors.name && <p className="mt-1.5 text-xs text-red-500">{errors.name}</p>}
        </div>

        {/*** 소비자 가격 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">
            소비자 가격 <span className="text-[#693B97]">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="consumerPrice"
              value={form.consumerPrice}
              onChange={handleChange}
              placeholder="0"
              min={1}
              className="w-full rounded-xl border border-zinc-200 bg-[#F8F8F8] px-3.5 py-2.5 pr-8 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-colors focus:border-[#693B97] focus:bg-white"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">원</span>
          </div>
          {errors.consumerPrice && <p className="mt-1.5 text-xs text-red-500">{errors.consumerPrice}</p>}
        </div>

        {/*** 행사 여부 + 행사 타입 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          {/*** 행사 여부 토글 ***/}
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#1A1A1A]">행사 여부</span>
            <button
              type="button"
              role="switch"
              aria-checked={form.isEvent}
              onClick={() => handleEventToggle(!form.isEvent)}
              className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
                form.isEvent ? "bg-[#693B97]" : "bg-zinc-200"
              }`}
            >
              {/*** 토글 내부 원 - left 포지셔닝으로 이탈 방지 ***/}
              <span
                className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200 ${
                  form.isEvent ? "left-5.5" : "left-0.5"
                }`}
              />
            </button>
          </div>

          {/*** 행사 타입 라디오 버튼 (행사 여부 ON 시 표시) ***/}
          {form.isEvent && (
            <div className="mt-4 border-t border-zinc-100 pt-4">
              <p className="mb-3 text-sm font-semibold text-[#1A1A1A]">
                행사 타입 <span className="text-[#693B97]">*</span>
              </p>
              <div className="flex gap-3">
                {(["1", "2"] as const).map((type) => (
                  <label
                    key={type}
                    className={`flex flex-1 cursor-pointer items-center justify-center rounded-xl border py-3 text-sm font-medium transition-colors ${
                      form.eventType === type
                        ? "border-[#693B97] bg-[#693B97]/10 text-[#693B97]"
                        : "border-zinc-200 bg-[#F8F8F8] text-zinc-500"
                    }`}
                  >
                    <input
                      type="radio"
                      name="eventType"
                      value={type}
                      checked={form.eventType === type}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    {type === "1" ? "1+1" : "2+1"}
                  </label>
                ))}
              </div>
              {errors.eventType && <p className="mt-1.5 text-xs text-red-500">{errors.eventType}</p>}
            </div>
          )}
        </div>

        {/*** 재고 수량 ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <label className="mb-1.5 block text-sm font-semibold text-[#1A1A1A]">
            재고 수량 <span className="text-[#693B97]">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              placeholder="0"
              min={0}
              className="w-full rounded-xl border border-zinc-200 bg-[#F8F8F8] px-3.5 py-2.5 pr-8 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-colors focus:border-[#693B97] focus:bg-white"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-zinc-400">개</span>
          </div>
          {errors.quantity && <p className="mt-1.5 text-xs text-red-500">{errors.quantity}</p>}
        </div>

        {/*** 이미지 첨부 (선택) ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="mb-1.5 text-sm font-semibold text-[#1A1A1A]">
            상품 이미지
            <span className="ml-1.5 text-xs font-normal text-zinc-400">(선택)</span>
          </p>
          {imagePreview ? (
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imagePreview}
                alt="상품 이미지 미리보기"
                className="h-40 w-full rounded-xl object-cover"
              />
              <button
                type="button"
                onClick={handleImageRemove}
                className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-200 bg-[#F8F8F8] transition-colors hover:border-[#693B97] hover:bg-[#693B97]/5"
            >
              <ImagePlus size={24} className="text-zinc-400" />
              <span className="text-xs text-zinc-400">이미지를 선택하세요</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="sr-only"
          />
        </div>

        {/*** 상세 설명 (최대 50자) ***/}
        <div className="rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-semibold text-[#1A1A1A]">
              상세 설명 <span className="text-[#693B97]">*</span>
            </label>
            <span className={`text-xs ${form.description.length >= DESCRIPTION_MAX ? "text-red-500" : "text-zinc-400"}`}>
              {form.description.length}/{DESCRIPTION_MAX}
            </span>
          </div>
          <textarea
            name="description"
            value={form.description}
            onChange={handleDescriptionChange}
            placeholder="상품에 대한 상세 설명을 입력하세요 (최대 50자)"
            rows={3}
            className="w-full resize-none rounded-xl border border-zinc-200 bg-[#F8F8F8] px-3.5 py-2.5 text-sm text-[#1A1A1A] placeholder-zinc-400 outline-none transition-colors focus:border-[#693B97] focus:bg-white"
          />
          {errors.description && <p className="mt-1.5 text-xs text-red-500">{errors.description}</p>}
        </div>

        {/*** 등록 버튼 ***/}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#693B97] text-sm font-semibold text-white transition-all duration-200 hover:bg-[#4E2C72] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              등록 중...
            </>
          ) : (
            "상품 등록"
          )}
        </button>

      </form>
    </div>
  );
}
