"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { subjectsByTerm } from "@/lib/Data/subjects";
import { termMap } from "@/lib/Data/terms";
import { lessonCounts } from "@/lib/Data/lessonCounts";

export default function LessonPage() {
    const searchParams = useSearchParams();
    const termDisplay = searchParams.get("term") || "1年前期"; // ユーザー向け学期表示
    const termFolder = termMap[termDisplay] || "1年1期"; // 実際のフォルダ名に変換

    const subjects = subjectsByTerm[termDisplay] || [];

    return (
        <div>
            <h1>{termDisplay} の科目とコマを選択</h1>
            <ul>
                {subjects.map((subject) => {
                    const maxLessons = lessonCounts[subject] || 1;
                    return (
                        <li key={subject}>
                            <strong>{subject}</strong>
                            <ul>
                                {[...Array(maxLessons)].map((_, index) => {
                                    const lessonNumber = (index + 1).toString();
                                    const pdfFileName = `${lessonNumber}.pdf`;
                                    const pdfUrl = `/Notes/${encodeURIComponent(termFolder)}/${encodeURIComponent(subject)}/${encodeURIComponent(pdfFileName)}`;
                                    const commentUrl = `/comments/${encodeURIComponent(termFolder)}/${encodeURIComponent(subject)}/${encodeURIComponent(lessonNumber)}`;

                                    return (
                                        <li key={`${subject}-${lessonNumber}`} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                                                {lessonNumber}コマ目
                                            </a>
                                            <Link href={commentUrl} title="コメントを見る">
                                                💬
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
