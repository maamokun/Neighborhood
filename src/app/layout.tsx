"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import "../ui/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname(); // ← 現在のURLパスを取得
  const [username, setUsername] = useState("");

  useEffect(() => {
      const storedUsername = sessionStorage.getItem("username");

      // 🔓 未ログインでも許可するパス
      const allowlist = ["/secret"];

      if (!storedUsername && !allowlist.includes(pathname)) {
          router.push("/");
      } else {
          setUsername(storedUsername ?? "");
      }
  }, [router, pathname]);

  const handleLogout = () => {
      sessionStorage.removeItem("username");
      router.push("/");
  };

  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f3d33] text-gray-100`}>
        <div className="flex h-screen overflow-hidden">
          {/* 🔹 サイドバー */}
          <nav className="w-60 bg-[#1b1b1b] border-r border-gray-700 p-4 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 tracking-wider border-b border-gray-700 pb-2 font-serif">Neighbourhood</h2>

  <ul className="flex flex-col gap-4 mt-4 font-serif">
  <li>
    <Link
      href="/Semester"
      className="block px-3 py-2 rounded-lg hover:bg-emerald-900 hover:text-emerald-200 transition-all text-base tracking-wide"
    >
      NOTE
    </Link>
  </li>
  <li>
    <Link
      href="/news"
      className="block px-3 py-2 rounded-lg hover:bg-emerald-900 hover:text-emerald-200 transition-all text-base tracking-wide"
    >
      NEWS
    </Link>
  </li>
  <li>
    <Link
      href="/links"
      className="block px-3 py-2 rounded-lg hover:bg-emerald-900 hover:text-emerald-200 transition-all text-base tracking-wide"
    >
      LINK
    </Link>
  </li>
</ul>


            <div className="mt-auto text-sm text-center">
              <p className="text-gray-300 mt-6 font-serif">user: {username}</p>
              <button
                onClick={handleLogout}
                className="mt-2 w-full bg-red-700 hover:bg-red-600 text-white py-2 rounded-md transition-all font-serif"
              >
                Logout
              </button>
              <footer className="text-xs text-gray-500 mt-4">
                Coded by <strong>昼水夜塔</strong>
              </footer>
            </div>
          </nav>

          {/* 🔹 メインコンテンツ */}
          <main className="flex-grow p-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
