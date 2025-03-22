
import * as React from "react"

import { cn } from "@/lib/utils"

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  contentEditable?: boolean;
  dangerouslySetInnerHTML?: { __html: string };
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, contentEditable, dangerouslySetInnerHTML, ...props }, ref) => {
    // Create a local reference if not provided
    const innerRef = React.useRef<HTMLTextAreaElement>(null);
    const resolvedRef = ref || innerRef;

    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={resolvedRef}
        {...props}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
