"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

// إشعارٌ صغيرٌ فاخر يظهر لحظةً بعد فعلٍ ناجح (إضافةُ عطرٍ إلى السلة)، ثم
// يتلاشى. واحدٌ في كل مرّة: الإشعارُ الجديد يحلّ محلّ سابقه فلا تتراكم.
// `role=status` و`aria-live=polite` كي يُعلَن لمن لا يرى الشاشة.

type ToastValue = { show: (message: string) => void };

const ToastContext = createContext<ToastValue>({ show: () => {} });

const DURATION = 2600;

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [shown, setShown] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  const show = useCallback((m: string) => {
    setMessage(m);
    setShown(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setShown(false), DURATION);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {/* المنطقةُ ثابتةٌ في الشجرة كي يلتقطها القارئُ الآلي، والرسالةُ
          تظهر وتختفي داخلها. تُخفى عن اللمس حتى لا تعترض ما تحتها. */}
      <div className="toast-region" role="status" aria-live="polite">
        {message && (
          <div className={shown ? "toast is-shown" : "toast"}>
            <span className="toast-check" aria-hidden="true">
              ✓
            </span>
            <span>{message}</span>
          </div>
        )}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
