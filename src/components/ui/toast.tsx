"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-center justify-between gap-2 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "border bg-background text-foreground",
        destructive:
          "destructive border-destructive bg-destructive text-white",
        success: "border-blue-200 bg-blue-50 text-blue-900",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  onClose?: () => void
}

function Toast({ className, variant, children, onClose, ...props }: ToastProps) {
  return (
    <div className={cn(toastVariants({ variant }), className)} {...props}>
      <div className="flex-1">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-md p-0.5 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

function ToastTitle({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm font-semibold", className)} {...props} />
  )
}

function ToastDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm opacity-90", className)} {...props} />
  )
}

interface ToastItem {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive" | "success"
}

interface ToastContextValue {
  toasts: ToastItem[]
  toast: (item: Omit<ToastItem, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = React.createContext<ToastContextValue>({
  toasts: [],
  toast: () => undefined,
  dismiss: () => undefined,
})

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([])

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = Math.random().toString(36).slice(2)
    setToasts((prev) => [...prev, { ...item, id }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 5000)
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant} onClose={() => dismiss(t.id)}>
            {t.title && <ToastTitle>{t.title}</ToastTitle>}
            {t.description && <ToastDescription>{t.description}</ToastDescription>}
          </Toast>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function useToast() {
  return React.useContext(ToastContext)
}

export {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastProvider,
  useToast,
  toastVariants,
}
