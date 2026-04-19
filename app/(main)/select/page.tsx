"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ChevronLeft, ChevronDown, ChevronUp, Store } from "lucide-react";

type DaumWindow = Window & {
  daum: {
    roughmap: {
      Lander: new (opts: { timestamp: string; key: string; mapWidth: string; mapHeight: string }) => { render: () => void };
    };
  };
};

/*** 지점 데이터 - 장곡점/은계점 카카오맵 roughmap 설정 ***/
const stores = [
  {
    id: "jangkok",
    storeParam: 1,
    name: "장곡점",
    containerId: "daumRoughmapContainer1776501781994",
    timestamp: "1776501781994",
    mapKey: "mb4r4vizsss",
  },
  {
    id: "eungye",
    storeParam: 2,
    name: "은계점",
    containerId: "daumRoughmapContainer1776501765266",
    timestamp: "1776501765266",
    mapKey: "mayc4dn26ym",
  },
];

/*** 지점 선택 페이지 ***/
export default function SelectPage() {
  const router = useRouter();
  const [mapVisible, setMapVisible] = useState<Record<string, boolean>>({});
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const initializedMapsRef = useRef<Set<string>>(new Set());

  /*** 지점 선택 → product 페이지로 이동 ***/
  const handleSelectStore = (storeParam: number) => {
    router.push(`/product?store=${storeParam}`);
  };

  /*** roughmap 스크립트 로드 완료 시 state 업데이트 → useEffect 재실행 트리거 ***/
  const handleScriptLoad = () => {
    setScriptLoaded(true);
  };

  /*** 특정 지점 지도 초기화 (DOM 커밋 후 호출됨이 보장된 상황에서만 호출) ***/
  const initializeMap = (storeId: string) => {
    if (initializedMapsRef.current.has(storeId)) return;

    const store = stores.find((s) => s.id === storeId);
    if (!store) return;

    try {
      new (window as unknown as DaumWindow).daum.roughmap.Lander({
        timestamp: store.timestamp,
        key: store.mapKey,
        mapWidth: "640",
        mapHeight: "300",
      }).render();
      initializedMapsRef.current.add(storeId);
    } catch {
      // roughmap 초기화 실패 시 조용히 무시
    }
  };

  /***
   * mapVisible 또는 scriptLoaded 변경 후 DOM 커밋이 완료된 시점에 실행.
   * 이 시점에는 컨테이너가 이미 block 상태이므로 roughmap이 정상 렌더링됨.
   ***/
  useEffect(() => {
    if (!scriptLoaded) return;

    Object.entries(mapVisible).forEach(([storeId, visible]) => {
      if (visible) {
        initializeMap(storeId);
      }
    });
  }, [mapVisible, scriptLoaded]);

  /*** 지도 토글 핸들러 ***/
  const toggleMap = (storeId: string) => {
    setMapVisible((prev) => ({ ...prev, [storeId]: !prev[storeId] }));
  };

  return (
    <div className="pb-10">

      {/*** roughmap 로더 스크립트 - 페이지 당 한 번만 삽입 ***/}
      <Script
        src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"
        strategy="afterInteractive"
        onLoad={handleScriptLoad}
      />

      {/*** 상단 헤더 ***/}
      <div className="bg-gradient-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-10">
        <Link
          href="/"
          className="mb-4 inline-flex items-center gap-1 text-xs text-white/70 transition-colors hover:text-white"
        >
          <ChevronLeft size={14} />
          홈으로
        </Link>
        <h1 className="text-lg font-bold text-white">지점을 선택하세요</h1>
        <p className="mt-1 text-xs text-white/70">
          이용하실 지점을 선택해 서비스를 시작하세요.
        </p>
      </div>

      {/*** 지점 선택 카드 목록 ***/}
      <div className="px-4 -mt-6 space-y-4">
        {stores.map(({ id, storeParam, name, containerId }) => (
          <div key={id} className="rounded-2xl border border-zinc-100 bg-white shadow-sm overflow-hidden">

            {/*** 지점 선택 버튼 ***/}
            <button
              type="button"
              onClick={() => handleSelectStore(storeParam)}
              className="flex w-full items-center gap-4 p-5 text-left transition-colors hover:bg-[#F8F8F8] active:bg-[#693B97]/5"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#693B97]/10">
                <Store size={20} className="text-[#693B97]" />
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-[#1A1A1A]">{name}</p>
                <p className="text-xs text-zinc-400 mt-0.5">탭하여 선택</p>
              </div>
              <div className="rounded-full bg-[#693B97] px-3 py-1.5">
                <span className="text-xs font-semibold text-white">선택</span>
              </div>
            </button>

            {/*** 구분선 ***/}
            <div className="mx-4 border-t border-zinc-100" />

            {/*** 위치보기 토글 버튼 ***/}
            <button
              type="button"
              onClick={() => toggleMap(id)}
              className="flex w-full items-center justify-center gap-1.5 py-3 text-xs font-medium text-zinc-500 transition-colors hover:text-[#693B97]"
            >
              <MapPin size={13} />
              위치보기
              {mapVisible[id] ? (
                <ChevronUp size={13} />
              ) : (
                <ChevronDown size={13} />
              )}
            </button>

            {/*** 카카오 roughmap 지도 컨테이너 ***/}
            <div className={mapVisible[id] ? "block" : "hidden"}>
              <div
                id={containerId}
                className="root_daum_roughmap root_daum_roughmap_landing w-full"
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
