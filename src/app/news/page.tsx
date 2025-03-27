"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc,
    query,
    orderBy
} from "firebase/firestore";

type NewsItem = {
    id: string;
    title: string;
    content: string;
    date: string;
    important?: boolean;
    deadline?: boolean;
};

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [username, setUsername] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");
    const [isImportant, setIsImportant] = useState(false);
    const [isDeadline, setIsDeadline] = useState(false);

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        const fetchNews = async () => {
            const q = query(collection(db, "news"), orderBy("date", "desc"));
            const querySnapshot = await getDocs(q);
            const loadedNews = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as NewsItem[];
            setNews(loadedNews);
        };

        fetchNews();
    }, []);

    const handleAddNews = async () => {
        if (username !== "hirumiya") return;
        if (!title.trim() || !content.trim()) return;

        const newEntry = {
            title,
            content,
            date: new Date().toISOString(),
            important: isImportant,
            deadline: isDeadline,
        };

        const docRef = await addDoc(collection(db, "news"), newEntry);
        setNews([{ id: docRef.id, ...newEntry }, ...news]);

        setTitle("");
        setContent("");
        setIsImportant(false);
        setIsDeadline(false);
    };

    const handleDeleteNews = async (id: string) => {
        if (username !== "hirumiya") return;

        await deleteDoc(doc(db, "news", id));
        setNews(news.filter(item => item.id !== id));
    };

    const handleUpdateNews = async () => {
        if (!editingId || username !== "hirumiya") return;
        if (!editTitle.trim() || !editContent.trim()) return;

        await updateDoc(doc(db, "news", editingId), {
            title: editTitle,
            content: editContent,
        });

        setNews(news.map(item =>
            item.id === editingId
                ? { ...item, title: editTitle, content: editContent }
                : item
        ));

        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    };

    return (
            <div className="max-w-2xl mx-auto px-3 py-6">
        <h1 className="text-2xl font-bold mb-6 border-b border-gray-700 pb-2 tracking-wide">
            お知らせ
        </h1>

        {username === "hirumiya" && (
            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 mb-8 shadow-md space-y-3">
                <h2 className="text-lg font-semibold">新しいお知らせを追加</h2>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="タイトル"
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-sm text-white placeholder-gray-500"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="内容（HTML可）"
                    rows={4}
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-sm text-white placeholder-gray-500"
                />
                <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                    <label className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={isImportant}
                            onChange={() => setIsImportant(!isImportant)}
                        />
                        重要
                    </label>
                    <label className="flex items-center gap-1">
                        <input
                            type="checkbox"
                            checked={isDeadline}
                            onChange={() => setIsDeadline(!isDeadline)}
                        />
                        提出期限
                    </label>
                </div>
                <button
                    onClick={handleAddNews}
                    className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm"
                >
                    投稿
                </button>
            </div>
        )}

        <ul className="space-y-6">
            {news.map((item) => (
                <li
                    key={item.id}
                    className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-4 shadow-sm"
                >
                    {editingId === item.id ? (
                        <div className="space-y-2">
                            <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                placeholder="タイトル"
                                className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-sm text-white placeholder-gray-500"
                            />
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                placeholder="内容"
                                rows={4}
                                className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-md text-sm text-white placeholder-gray-500"
                            />
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={handleUpdateNews}
                                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1 rounded-md text-sm"
                                >
                                    更新
                                </button>
                                <button
                                    onClick={() => setEditingId(null)}
                                    className="text-gray-400 hover:text-gray-200 text-sm"
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                {item.important && (
                                    <span className="bg-red-600 text-white text-xs px-2 py-0.5 rounded-full">
                                        重要
                                    </span>
                                )}
                                {item.deadline && (
                                    <span className="bg-yellow-500 text-black text-xs px-2 py-0.5 rounded-full">
                                        提出期限
                                    </span>
                                )}
                                <strong className="text-base sm:text-lg text-white">{item.title}</strong>
                                <span className="text-xs sm:text-sm text-gray-500 ml-auto">
                                    {new Date(item.date).toLocaleString()}
                                </span>
                            </div>
                            <div
                                className="text-gray-200 text-sm mt-1 prose prose-invert max-w-none"
                                dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                            {username === "hirumiya" && (
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            setEditingId(item.id);
                                            setEditTitle(item.title);
                                            setEditContent(item.content);
                                        }}
                                        className="text-emerald-400 hover:text-emerald-300 text-sm"
                                    >
                                        編集
                                    </button>
                                    <button
                                        onClick={() => handleDeleteNews(item.id)}
                                        className="text-red-400 hover:text-red-300 text-sm"
                                    >
                                        削除
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </li>
            ))}
        </ul>
</div>

    );
}
