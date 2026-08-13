// 리액트 사용을 위해 import
import React from "react";
// Slot: asChild 모드에서 다른 태그에 동일한 스타일을 주기 위해 사용
import { Slot } from "@radix-ui/react-slot";
// cva: class-variance-authority, 변형(variant)과 사이즈(size)를 선언적으로 관리
import { cva } from "class-variance-authority";
// cn: 우리가 만든 유틸(클래스 병합)
import { cn } from "./utils";

// 버튼의 기본 클래스와 변형 옵션을 선언
const buttonVariants = cva(
  // 공통으로 항상 들어가는 Tailwind 클래스 세트
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    // 변형 옵션 정의
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      // 크기 종류
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-md", // 정사각 아이콘 버튼
      },
    },
    // 변형의 기본값 (아무것도 안주면 default로)
    defaultVariants: { variant: "default", size: "default" },
  }
);

// 재사용 가능한 Button 컴포넌트
export function Button({ className, variant, size, asChild = false, ...props }) {
  // asChild가 true면 Slot을 사용해 a/div 등 다른 태그에 스타일만 입혀줌
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      // data-* 속성은 디버깅이나 스타일링에 활용 가능
      data-slot="button"
      // cva로 variant/size를 전달해 클래스 생성 → cn으로 병합
      className={cn(buttonVariants({ variant, size, className }))}
      // 나머지 모든 props (onClick, type 등) 전달
      {...props}
    />
  );
}

// 필요 시 외부에서 변형 정의를 재사용하려면 export
export { buttonVariants };
