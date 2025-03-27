"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            router.push("/Semester");
        }
    }, [router]);

    const generatePassword = (name: string) => {
        return btoa(name);
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

        sessionStorage.setItem("username", username);
        router.push("/Semester");
    };

    return (
        <div className="h-screen overflow-hidden bg-gradient-to-br from-[#0f3d33] to-[#2d2d2d] text-gray-100 flex items-center justify-center font-sans">
            <div className="bg-[#1a1a1a] border border-gray-600 rounded-2xl p-6 shadow-lg w-full max-w-md font-serif">
                <h1 className="text-3xl mb-6 text-center tracking-wider border-b pb-2 border-gray-600">Login</h1>

                {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="user name"
                    className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="password"
                    className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
                <button
                    onClick={handleLogin}
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded-md transition-all duration-200 tracking-wide"
                >
                    Login
                </button>
            </div>
        </div>
    );
}
