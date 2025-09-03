'use client'
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext"
import { useEffect } from "react";

export default function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !token) {
      router.replace("/login")
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, loading]);

  if (loading) return null;

  return token ? <>{children}</> : null;
}