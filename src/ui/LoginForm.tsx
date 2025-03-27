"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

export default function LoginForm() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = async () => {
		if (!username.trim() || !password.trim()) {
			toast.error("ユーザー名とパスワードを入力してください。");
			return;
		}
		signIn("credentials", { username, password, redirectTo: "/Semester" });
	};

	return (
		<div className="h-screen overflow-hidden bg-gradient-to-br from-[#0f3d33] to-[#2d2d2d] text-gray-100 flex items-center justify-center px-4 font-sans">
			<div className="bg-[#1a1a1a] border border-gray-600 rounded-2xl p-6 shadow-lg w-full max-w-md font-serif">
				<h1 className="text-2xl md:text-3xl mb-6 text-center tracking-wider border-b pb-2 border-gray-600">
					Login
				</h1>
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
					placeholder="user name"
					className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm md:text-base"
				/>
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					placeholder="password"
					className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-700 text-sm md:text-base"
				/>
				<button
					onClick={handleLogin}
					className="w-full bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded-md transition-all duration-200 tracking-wide text-sm md:text-base"
				>
					Login
				</button>
			</div>
		</div>
	);
}
