// Next/React에서 클라이언트 컴포넌트로 동작하게 힌트 (Next.js에서 주로 사용)
"use client";
import React from "react";
// Radix UI의 Label 프리미티브 (접근성 좋은 라벨)
import * as LabelPrimitive from "@radix-ui/react-label";
// 클래스 병합 유틸
import { cn } from "./utils";

// 라벨 컴포넌트
export function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      // 디버깅용 데이터 속성
      data-slot="label"
      // 기본 라벨 스타일 + disabled/peer-disabled 대응 + 추가 className 병합
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      // htmlFor 등 나머지 props 전달
      {...props}
    />
  );
}
