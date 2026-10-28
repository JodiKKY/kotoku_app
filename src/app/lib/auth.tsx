import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type User = { name: string; email: string };

type AuthValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
};

const AuthContext = createContext<AuthValue | null>(null);

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * PLACEHOLDER AUTH.
 * signIn and signUp accept any valid-looking details and do not talk to a server,
 * and the session is lost when the app reloads. Replace the bodies with real calls
 * to your backend (Firebase, Supabase, your own API...) and keep the session token
 * in expo-secure-store, never in AsyncStorage or plain state.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      async signIn(email) {
        await wait(700);
        // TODO: call your backend and throw an Error with a friendly message on failure.
        setUser({ name: email.split("@")[0], email: email.trim() });
      },
      async signUp(name, email) {
        await wait(900);
        // TODO: create the account on your backend.
        setUser({ name: name.trim(), email: email.trim() });
      },
      signOut() {
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}