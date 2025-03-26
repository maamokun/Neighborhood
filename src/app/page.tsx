"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // 🔹 `sessionStorage` からユーザー名を取得（自動ログイン）
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            router.push("/Semester"); // 🔹 すでにログイン済みならリダイレクト
        }
    }, []);

    // 🔹 ユーザー名を Base64 でエンコード（パスワード生成）
    const generatePassword = (name: string) => {
        return btoa(name); // `btoa()` を使って Base64 エンコード
    };

    const handleLogin = () => {
        if (!username.trim() || !password.trim()) {
            setError("ユーザー名とパスワードを入力してください。");
            return;
        }

        const expectedPassword = generatePassword(username);

        if (password !== expectedPassword) {
            setError("パスワードが間違っています。");
            return;
        }

        // 🔹 `sessionStorage` に保存（タブを閉じたら消える）
        sessionStorage.setItem("username", username);
        
        // 🔹 ノート閲覧ページへリダイレクト
        router.push("/Semester");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>ログイン</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ユーザー名を入力"
                style={{ padding: "8px", fontSize: "16px", marginBottom: "10px" }}
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="パスワードを入力"
                style={{ padding: "8px", fontSize: "16px", marginBottom: "10px" }}
            />
            <button onClick={handleLogin} style={{ marginTop: "10px", padding: "5px 10px", fontSize: "16px" }}>
                ログイン
            </button>
        </div>
    );
}
