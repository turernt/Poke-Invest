"use client";

import { createContext, useContext, useEffect, useState, useCallback, useRef, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

// ─── Auth ───────────────────────────────────────────────────────────────────

interface AuthCtx {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthCtx>({ user: null, loading: true, logout: async () => {} });

export function useAuth() { return useContext(AuthContext); }

// ─── Theme ──────────────────────────────────────────────────────────────────

interface ThemeCtx { dark: boolean; toggle: () => void; }
const ThemeContext = createContext<ThemeCtx>({ dark: false, toggle: () => {} });
export function useTheme() { return useContext(ThemeContext); }

// ─── Toast ──────────────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info";
interface Toast { id: number; message: string; type: ToastType; }
interface ToastCtx { showToast: (msg: string, type?: ToastType) => void; }
const ToastContext = createContext<ToastCtx>({ showToast: () => {} });
export function useToast() { return useContext(ToastContext); }

// ─── Confirm dialog ─────────────────────────────────────────────────────────

interface ConfirmCtx { confirm: (title: string, body: string) => Promise<boolean>; }
const ConfirmContext = createContext<ConfirmCtx>({ confirm: async () => false });
export function useConfirm() { return useContext(ConfirmContext); }

// ─── Root Provider ──────────────────────────────────────────────────────────

export function DashboardProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowser();

  // Auth
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthLoading(false);
      if (!data.user) window.location.replace("/connexion?redirect=/dashboard");
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") window.location.replace("/connexion");
      else setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    window.location.replace("/connexion");
  }, [supabase]);

  // Theme
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = saved ? saved === "dark" : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
  }, []);

  const toggle = useCallback(() => {
    setDark(prev => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
      return next;
    });
  }, []);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastId = useRef(0);
  const showToast = useCallback((message: string, type: ToastType = "success") => {
    const id = ++toastId.current;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);

  // Confirm
  const [confirmState, setConfirmState] = useState<{
    open: boolean; title: string; body: string;
    resolve: ((v: boolean) => void) | null;
  }>({ open: false, title: "", body: "", resolve: null });

  const confirm = useCallback((title: string, body: string): Promise<boolean> =>
    new Promise(resolve => setConfirmState({ open: true, title, body, resolve }))
  , []);

  const handleConfirm = (value: boolean) => {
    confirmState.resolve?.(value);
    setConfirmState(s => ({ ...s, open: false, resolve: null }));
  };

  return (
    <AuthContext.Provider value={{ user, loading: authLoading, logout }}>
      <ThemeContext.Provider value={{ dark, toggle }}>
        <ToastContext.Provider value={{ showToast }}>
          <ConfirmContext.Provider value={{ confirm }}>
            {children}

            {/* Toasts */}
            <div className="toast-container">
              {toasts.map(t => (
                <div key={t.id} className={`toast toast-${t.type}`}>{t.message}</div>
              ))}
            </div>

            {/* Confirm dialog */}
            {confirmState.open && (
              <div className="confirm-overlay active">
                <div className="confirm-dialog">
                  <div className="confirm-title">{confirmState.title}</div>
                  <div className="confirm-body">{confirmState.body}</div>
                  <div className="confirm-actions">
                    <button className="btn-cancel" onClick={() => handleConfirm(false)}>Annuler</button>
                    <button className="btn-submit" style={{ background: "var(--red)" }} onClick={() => handleConfirm(true)}>Supprimer</button>
                  </div>
                </div>
              </div>
            )}
          </ConfirmContext.Provider>
        </ToastContext.Provider>
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
