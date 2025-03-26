"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, where, orderBy, deleteDoc, doc } from "firebase/firestore";

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
            console.log("🔍 Firestore からコメントを取得中…");
            const q = query(
                collection(db, "comments"),
                where("collection", "==", storageKey),
                orderBy("date", "asc")
            );

            try {
                const querySnapshot = await getDocs(q);
                const loadedComments = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                })) as CommentItem[];

                console.log("✅ Firestore から取得したコメント:", loadedComments);
                setComments(loadedComments);
            } catch (error) {
                console.error("⚠️ Firestore のコメント取得中にエラー:", error);
            }
        };

        fetchComments();
    }, [storageKey]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        const newEntry = {
            user: username,
            text: newComment,
            date: new Date().toISOString(),
            collection: storageKey,
        };

        try {
            const docRef = await addDoc(collection(db, "comments"), newEntry);
            setComments(prev => [...prev, { id: docRef.id, ...newEntry }]);
            setNewComment("");
            console.log("✅ コメントを Firestore に追加:", newEntry);
        } catch (error) {
            console.error("⚠️ Firestore へのコメント追加中にエラー:", error);
        }
    };

    const handleDeleteComment = async (id: string) => {
        if (username !== "hirumiya") return;
        try {
            await deleteDoc(doc(db, "comments", id));
            setComments(prev => prev.filter(comment => comment.id !== id));
            console.log(`🗑 コメント（ID: ${id}）を削除`);
        } catch (error) {
            console.error("⚠️ Firestore のコメント削除中にエラー:", error);
        }
    };

    return (
        <div>
            <h1>{decodedTerm} - {decodedSubject} - {decodedLesson} のコメント</h1>

            <ul>
                {comments.map((comment) => (
                    <li key={comment.id} style={{ marginBottom: "10px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                        <strong>{comment.user}</strong> （{new Date(comment.date).toLocaleString()}）
                        <p>{comment.text}</p>
                        {username === "hirumiya" && (
                            <button onClick={() => handleDeleteComment(comment.id)}>削除</button>
                        )}
                    </li>
                ))}
            </ul>

            <div>
                <h2>コメントを追加</h2>
                <textarea
                    placeholder="コメントを入力"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={3}
                    style={{ width: "100%" }}
                />
                <button onClick={handleAddComment}>送信</button>
            </div>
        </div>
    );
}
