// clsx: 조건부로 클래스 문자열을 합칠 때 유용한 라이브러리
import { clsx } from "clsx";
// tailwind-merge: Tailwind 클래스가 충돌할 때, 마지막 우선순위로 깔끔히 병합
import { twMerge } from "tailwind-merge";

// 여러 개의 클래스 입력(...inputs)을 받아
export function cn(...inputs) {
  // clsx로 문자열로 만든 뒤 tailwind-merge로 충돌 해결하여 반환
  return twMerge(clsx(inputs));
}
