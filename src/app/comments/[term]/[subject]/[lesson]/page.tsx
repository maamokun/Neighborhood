"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    orderBy,
    deleteDoc,
    doc,
    type DocumentData,
    type QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

type CommentItem = {
    id: string;
    user: string;
    text: string;
    date: string;
};

export default function CommentsPage() {
    const params = useParams();

    const decodedTerm = decodeURIComponent(Array.isArray(params.term) ? params.term[0] : params.term ?? "");
    const decodedSubject = decodeURIComponent(Array.isArray(params.subject) ? params.subject[0] : params.subject ?? "");
    const decodedLesson = decodeURIComponent(Array.isArray(params.lesson) ? params.lesson[0] : params.lesson ?? "");
    const storageKey = `comments_${decodedTerm}_${decodedSubject}_${decodedLesson}`;

    const [comments, setComments] = useState<CommentItem[]>([]);
    const [newComment, setNewComment] = useState("");
    const [username, setUsername] = useState("");

    useEffect(() => {
        const storedUsername = sessionStorage.getItem("username");
        setUsername(storedUsername ?? "匿名");

        const fetchComments = async () => {
            const q = query(
                collection(db, "comments"),
                where("collection", "==", storageKey),
                orderBy("date", "asc")
            );

            try {
                const querySnapshot = await getDocs(q);
                const loadedComments: CommentItem[] = querySnapshot.docs.map(
                    (d: QueryDocumentSnapshot<DocumentData>) => ({
                        id: d.id,
                        ...(d.data() as Omit<CommentItem, "id">),
                    })
                );

                setComments(loadedComments);
            } catch (error) {
                console.error("⚠️ Firestore のコメント取得中にエラー:", error);
            }
        };

        fetchComments();
    }, [storageKey]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const currentUsername = sessionStorage.getItem("username") ?? "匿名";

        const newEntry = {
            user: currentUsername,
            text: newComment,
            date: new Date().toISOString(),
            collection: storageKey,
        };

        try {
            const docRef = await addDoc(collection(db, "comments"), newEntry);
            setComments((prev) => [...prev, { id: docRef.id, ...newEntry }]);
            setNewComment("");
        } catch (error) {
            console.error("⚠️ Firestore へのコメント追加中にエラー:", error);
        }
    };

    const handleDeleteComment = async (id: string) => {
        if (username !== "hirumiya") return;

        try {
            await deleteDoc(doc(db, "comments", id));
            setComments((prev) => prev.filter((comment) => comment.id !== id));
        } catch (error) {
            console.error("⚠️ Firestore のコメント削除中にエラー:", error);
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8 font-sans">
            <h1 className="text-xl sm:text-2xl font-semibold mb-6 border-b border-gray-700 pb-2 tracking-wide">
                {decodedTerm} - {decodedSubject} - {decodedLesson} のコメント
            </h1>

            <ul className="space-y-4 mb-8">
                {comments.map((comment) => (
                    <li
                        key={comment.id}
                        className="bg-[#1a1a1a] border border-gray-700 p-4 rounded-lg shadow-sm relative"
                    >
                        <div className="text-sm text-gray-400 mb-1">
                            {comment.user}（{new Date(comment.date).toLocaleString()}）
                        </div>
                        <p className="text-sm text-gray-100 whitespace-pre-wrap break-words">
                            {comment.text}
                        </p>
                        {username === "hirumiya" && (
                            <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="absolute top-2 right-3 text-xs text-red-400 hover:text-red-300"
                            >
                                削除
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-5 shadow-md">
                <h2 className="text-lg font-medium mb-3">コメントを追加</h2>
                <textarea
                    placeholder="コメントを入力"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="w-full bg-transparent border border-gray-600 rounded-md px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-700 mb-4 resize-none"
                />
                <button
                    onClick={handleAddComment}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm transition-all w-full sm:w-auto"
                >
                    送信
                </button>
            </div>
        </div>
    );
}
