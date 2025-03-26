"use client";

import { useState } from "react";

export default function SecretPage() {
    const [username, setUsername] = useState("");
    const [hashedPassword, setHashedPassword] = useState("");

    // ハッシュ化関数（Base64 エンコード）
    const generatePassword = (name: string) => {
        return btoa(name); // JavaScript の `btoa()` でエンコード
    };

    // ユーザー名入力時に自動でパスワードを生成
    const handleGenerate = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value;
        setUsername(name);
        setHashedPassword(name ? generatePassword(name) : "");
    };

    // クリップボードにコピーする関数
    const handleCopy = () => {
        navigator.clipboard.writeText(hashedPassword);
        alert("パスワードをコピーしました！");
    };

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>パスワード発行ページ</h1>
            <p>ユーザー名を入力すると、対応するパスワードが生成されます。</p>

            <input
                type="text"
                placeholder="ユーザー名を入力"
                value={username}
                onChange={handleGenerate}
                style={{ padding: "8px", fontSize: "16px", marginBottom: "10px" }}
            />

            {hashedPassword && (
                <div>
                    <p>あなたのパスワード：</p>
                    <strong style={{ fontSize: "18px", backgroundColor: "#eee", padding: "5px" }}>
                        {hashedPassword}
                    </strong>
                    <br />
                    <button onClick={handleCopy} style={{ marginTop: "10px", padding: "5px 10px", fontSize: "16px" }}>
                        コピー
                    </button>
                </div>
            )}
        </div>
    );
}
