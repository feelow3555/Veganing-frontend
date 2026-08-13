// 리액트 import
import React from "react";
// 클래스 병합 유틸
import { cn } from "./utils";

// 입력 필드 컴포넌트
export function Input({ className, type = "text", ...props }) {
  return (
    <input
      // HTML 기본 type (text, email 등)
      type={type}
      // 디버깅용 data 속성
      data-slot="input"
      // Tailwind 기본 스타일 + 포커스/유효성 + 전달받은 className 병합
      className={cn(
        // 기본 형태: 크기/패딩/테두리/비활성화/파일 인풋 등
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border px-3 py-1 text-base bg-input-background transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        // 포커스 시 외곽선/링 효과
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        // aria-invalid(true)일 때 에러 스타일
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        // 부모에서 추가로 주는 클래스
        className
      )}
      // onChange/value/placeholder 등 나머지 props를 그대로 전달
      {...props}
    />
  );
}
