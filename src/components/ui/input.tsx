import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, onFocus, ...props }, forwardedRef) => {
    const innerRef = React.useRef<HTMLInputElement | null>(null)

    const setRef = React.useCallback(
      (node: HTMLInputElement | null) => {
        innerRef.current = node
        if (typeof forwardedRef === "function") forwardedRef(node)
        else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLInputElement | null>).current = node
      },
      [forwardedRef]
    )

    const handleFocus = React.useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        onFocus?.(e)

        // On mobile keyboards, ensure the active field scrolls above the keyboard.
        // We run this only on touch/hover-none devices to avoid unexpected jumps on desktop.
        const isTouchDevice =
          typeof window !== "undefined" &&
          ((navigator?.maxTouchPoints ?? 0) > 0 || window.matchMedia?.("(hover: none)")?.matches)

        if (!isTouchDevice) return

        const el = e.currentTarget
        const scroll = () => {
          try {
            // "nearest" avoids jumping the field too high; it just ensures it's visible.
            el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" })
          } catch {
            // no-op
          }
        }

        // Run twice: immediately, then after the keyboard has finished animating.
        setTimeout(scroll, 50)
        setTimeout(scroll, 350)
      },
      [onFocus]
    )

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm file:border-0 file:bg-transparent file:text-sm file:text-foreground placeholder:text-slate-500 focus-visible:border-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-500 md:text-sm",
          className
        )}
        ref={setRef}
        onFocus={handleFocus}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
