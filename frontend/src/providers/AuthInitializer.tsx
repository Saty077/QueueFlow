"use client";

import { useEffect } from "react";
import api from "@/lib/axios";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCredentials, finishAuthCheck } from "@/store/authSlice";
import { getUserFromStorage, clearUserFromStorage } from "@/lib/authStorage";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector((state) => state.auth.isLoading);

  useEffect(() => {
    const cachedUser = getUserFromStorage();

    api
      .post("/auth/refresh")
      .then((res) => {
        if (cachedUser) {
          dispatch(
            setCredentials({
              user: cachedUser,
              accessToken: res.data.accessToken,
            }),
          );
        } else {
          clearUserFromStorage();
          dispatch(finishAuthCheck());
        }
      })
      .catch(() => {
        clearUserFromStorage();
        dispatch(finishAuthCheck());
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-gray-500">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
