"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

const Progress = React.forwardRef(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-5 w-full overflow-hidden rounded-full bg-gray-500",
      className
    )}
    {...props}
  >
    {value < 30 ? (
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-red-600 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    ) : (
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-blue-700 transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    )}
  </ProgressPrimitive.Root>
));
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
