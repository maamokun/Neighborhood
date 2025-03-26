"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = sessionStorage.getItem("username");
    if (!storedUsername) {
      router.push("/"); // 🔹 未ログインならログインページへ
    } else {
      setUsername(storedUsername);
    }
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem("username");
    router.push("/");
  };

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div style={{ display: "flex", height: "100vh" }}>
          {/* 🔹 サイドナビ */}
          <nav style={{ width: "250px", background: "#333", color: "white", padding: "20px", display: "flex", flexDirection: "column" }}>
            <h2 className="font-bold text-2xl mb-5">ノート共有アプリ</h2>
            <ul style={{ listStyle: "none", padding: 0 }}>
              <li><Link href="/Semester" style={{ color: "white", textDecoration: "none" }}>📚 ノート閲覧</Link></li>
              <li><Link href="/news" style={{ color: "white", textDecoration: "none" }}>📰 お知らせ</Link></li>
              <li><Link href="/links" style={{ color: "white", textDecoration: "none" }}>🔗 リンク集</Link></li>
            </ul>

            <div style={{ marginTop: "auto", textAlign: "center" }}>
              <p>👤 {username}</p>
              <button onClick={handleLogout} style={{ background: "red", color: "white", border: "none", padding: "10px", cursor: "pointer", width: "100%" }}>
                🚪 ログアウト
              </button>

              {/* 🔹 クレジット */}
              <footer style={{ fontSize: "12px", color: "#aaa", marginTop: "20px" }}>
                Coded by <strong>昼水夜塔</strong>
              </footer>
            </div>
          </nav>

          {/* 🔹 メインコンテンツ */}
          <main style={{ flexGrow: 1, padding: "20px" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}