"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ChevronLeft, ChevronDown, ChevronUp, Store } from "lucide-react";

type DaumWindow = Window & {
  daum: {
    roughmap: {
      Lander: new (opts: {
        timestamp: string;
        key: string;
        mapWidth: string;
        mapHeight: string;
      }) => { render: () => void };
    };
  };
};

/*** 지점 데이터 - 장현 루벤시아 21단지점/은계 꽃길점 카카오맵 roughmap 설정 ***/
const stores = [
  {
    id: "janghyeon",
    storeParam: 1,
    name: "장현 루벤시아 21단지점",
    containerId: "daumRoughmapContainer1776947231849",
    timestamp: "1776947231849",
    mapKey: "m82qk6n23i5",
  },
  {
    id: "eungye",
    storeParam: 2,
    name: "은계 꽃길점",
    containerId: "daumRoughmapContainer1776947250892",
    timestamp: "1776947250892",
    mapKey: "2arfn5kxzm2v",
  },
];

/*** 지점 선택 페이지 ***/
export default function SelectPage() {
  const router = useRouter();
  const [mapVisible, setMapVisible] = useState<Record<string, boolean>>({});
  const [roughmapReady, setRoughmapReady] = useState(false);
  const initializedMapsRef = useRef<Set<string>>(new Set());
  const pollingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPollingForRoughmap = useCallback(() => {
    if (pollingTimerRef.current) return;
    let attempts = 0;
    pollingTimerRef.current = setInterval(() => {
      attempts++;
      const daumWindow = window as unknown as DaumWindow;
      if (daumWindow.daum?.roughmap?.Lander) {
        clearInterval(pollingTimerRef.current!);
        pollingTimerRef.current = null;
        setRoughmapReady(true);
        return;
      }
      if (attempts >= 50) {
        clearInterval(pollingTimerRef.current!);
        pollingTimerRef.current = null;
      }
    }, 200);
  }, []);

  useEffect(() => {
    return () => {
      if (pollingTimerRef.current) clearInterval(pollingTimerRef.current);
    };
  }, []);

  /***
   * roughmapLoader.js는 document.write()로 roughmapLander.js를 주입하는데,
   * 비동기 로드 환경에서는 document.write()가 브라우저에 의해 차단됨.
   * → document.write를 미리 오버라이드하여 내부 스크립트 URL을 가로채고
   *   createElement로 안전하게 주입하여 이 제약을 우회함.
   ***/
  useEffect(() => {
    const daumWindow = window as unknown as DaumWindow;

    if (daumWindow.daum?.roughmap?.Lander) {
      setRoughmapReady(true);
      return;
    }
    if (document.querySelector("script.daum_roughmap_loader_script")) {
      startPollingForRoughmap();
      return;
    }

    const originalWrite = document.write.bind(document);
    let intercepted = false;

    document.write = (html: string) => {
      if (!intercepted) {
        intercepted = true;
        document.write = originalWrite;

        const srcMatch = html.match(/src=["']([^"']+)["']/);
        if (srcMatch) {
          const landerScript = document.createElement("script");
          landerScript.src = srcMatch[1];
          landerScript.onload = startPollingForRoughmap;
          document.head.appendChild(landerScript);
        }
      }
    };

    const loaderScript = document.createElement("script");
    loaderScript.src = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
    loaderScript.className = "daum_roughmap_loader_script";
    loaderScript.onload = () => {
      document.write = originalWrite;
      startPollingForRoughmap();
    };
    document.head.appendChild(loaderScript);
  }, [startPollingForRoughmap]);

  /*** roughmap 준비 완료 시 모든 지점 지도를 선제 렌더링 ***/
  useEffect(() => {
    if (!roughmapReady) return;

    const daumWindow = window as unknown as DaumWindow;
    stores.forEach((store) => {
      if (initializedMapsRef.current.has(store.id)) return;

      new daumWindow.daum.roughmap.Lander({
        timestamp: store.timestamp,
        key: store.mapKey,
        mapWidth: "360",
        mapHeight: "260",
      }).render();

      initializedMapsRef.current.add(store.id);
    });
  }, [roughmapReady]);

  /*** 지도 토글 핸들러 ***/
  const toggleMap = (storeId: string) => {
    setMapVisible((prev) => ({ ...prev, [storeId]: !prev[storeId] }));
  };

  /*** 지점 선택 → product 페이지로 이동 ***/
  const handleSelectStore = (storeParam: number) => {
    router.push(`/product?store=${storeParam}`);
  };

  return (
    <div className="pb-10">

      {/*** 상단 헤더 ***/}
      <div className="bg-linear-to-br from-[#693B97] to-[#8B5BB8] px-5 pt-6 pb-10">
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
              {mapVisible[id] ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>

            {/*** 카카오 roughmap 지도 컨테이너 ***/}
            <div className={mapVisible[id] ? "block" : "hidden"}>
              <div
                id={containerId}
                className="root_daum_roughmap root_daum_roughmap_landing"
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
