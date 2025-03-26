"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Sidebar() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("username"); // ログアウト処理
        router.push("/");
    };

    return (
        <nav style={{ width: "200px", height: "100vh", background: "#eee", padding: "20px", position: "fixed" }}>
            <ul>
                <li><Link href="/Semester">ノート閲覧</Link></li>
                <li><Link href="/news">お知らせ</Link></li>
                <li><button onClick={handleLogout}>ログアウト</button></li>
            </ul>
        </nav>
    );
}
