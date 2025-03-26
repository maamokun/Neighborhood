"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";

type NewsItem = {
    id: string;
    title: string;
    content: string;
    date: string;
};

export default function NewsPage() {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [username, setUsername] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        // 🔹 `sessionStorage` からユーザー名を取得
        const storedUsername = sessionStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
        }

        // 🔹 Firestore からお知らせを取得（新しい順に並ぶ）
        const fetchNews = async () => {
            const q = query(collection(db, "news"), orderBy("date", "desc")); // 🔹 新しいお知らせが上に来る！
            const querySnapshot = await getDocs(q);
            const loadedNews = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as NewsItem[];
            setNews(loadedNews);
        };
        

        fetchNews();
    }, []);

    // 🔹 お知らせを追加（hirumiya だけ）
    const handleAddNews = async () => {
        if (username !== "hirumiya") return; // 権限チェック
        if (!title.trim() || !content.trim()) return;
    
        const newEntry = {
            title,
            content,
            date: new Date().toISOString(), // 🔹 Firestore の時系列管理に適した形式
        };
    
        const docRef = await addDoc(collection(db, "news"), newEntry);
        setNews([{ id: docRef.id, ...newEntry }, ...news]); // 🔹 新しいお知らせをリストの先頭に追加
    
        setTitle("");
        setContent("");
    };
    
    // 🔹 お知らせを削除（hirumiya だけ）
    const handleDeleteNews = async (id: string) => {
        if (username !== "hirumiya") return; // 権限チェック

        await deleteDoc(doc(db, "news", id));
        setNews(news.filter(item => item.id !== id));
    };

    // 🔹 お知らせを編集（hirumiya だけ）
    const handleUpdateNews = async () => {
        if (!editingId || username !== "hirumiya") return; // 権限チェック
        if (!editTitle.trim() || !editContent.trim()) return;

        await updateDoc(doc(db, "news", editingId), {
            title: editTitle,
            content: editContent,
            date: new Date().toISOString(),
        });

        setNews(news.map(item => 
            item.id === editingId ? { ...item, title: editTitle, content: editContent } : item
        ));

        setEditingId(null);
        setEditTitle("");
        setEditContent("");
    };

    return (
        <div>
            <h1>お知らせ</h1>

            {/* 🔹 管理者（hirumiya）のみお知らせを追加可能 */}
            {username === "hirumiya" && (
                <div>
                    <h2>新しいお知らせを追加</h2>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="タイトル"
                    />
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="内容"
                        rows={3}
                        style={{ width: "100%" }}
                    />
                    <button onClick={handleAddNews}>投稿</button>
                </div>
            )}

            <ul>
                {news.map((item) => (
                    <li key={item.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                        {editingId === item.id ? (
                            <div>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="タイトル"
                                />
                                <textarea
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                    placeholder="内容"
                                    rows={3}
                                    style={{ width: "100%" }}
                                />
                                <button onClick={handleUpdateNews}>更新</button>
                                <button onClick={() => setEditingId(null)}>キャンセル</button>
                            </div>
                        ) : (
                            <div>
                                <strong>{item.title}</strong>（{new Date(item.date).toLocaleString()}）
                                {/* 🔹 `dangerouslySetInnerHTML` で HTML を適用 */}
                                <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
                                {username === "hirumiya" && (
                                    <div>
                                        <button onClick={() => {
                                            setEditingId(item.id);
                                            setEditTitle(item.title);
                                            setEditContent(item.content);
                                        }}>編集</button>
                                        <button onClick={() => handleDeleteNews(item.id)}>削除</button>
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
