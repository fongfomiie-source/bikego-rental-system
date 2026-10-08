"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // หน้า Login สามารถเข้าได้โดยไม่ต้อง Login
    if (pathname === "/admin/login") {
      setChecking(false);
      return;
    }

    const isAdmin =
      sessionStorage.getItem("bikego_admin");

    // ยังไม่ได้ Login
    if (isAdmin !== "true") {
      router.replace("/admin/login");
      return;
    }

    // Login แล้ว
    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-green-50 flex items-center justify-center">
        <p className="text-green-700 font-bold">
          Checking admin access...
        </p>
      </main>
    );
  }

  return <>{children}</>;
}