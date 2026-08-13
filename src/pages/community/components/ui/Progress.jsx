"use client"; // (이건 Next.js 같은 프레임워크용인데, 일단 둬도 문제는 없을 겁니다)

import * as ProgressPrimitive from "@radix-ui/react-progress";
import * as React from "react";
// 👇 progress.jsx 파일 기준으로 cn 함수 경로가 맞는지 꼭 확인하세요!
// (만약 lib 폴더가 src/pages/community/lib 라면 '../../lib/utils' 가 맞습니다)
import { cn } from "../../lib/utils";

// 👇 <...> 타입 부분을 제거했습니다.
const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };