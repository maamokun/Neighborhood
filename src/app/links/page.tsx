"use client";

import Link from "next/link";

export default function LinksPage() {
    return (
        <div style={{ padding: "20px" }}>
            <h1>🔗 リンク集</h1>
            <p>
                <Link 
                    href="https://github.com/Hirumiya-Tower"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline", fontSize: "18px" }}
                >
                    昼水夜塔のGithub
                </Link>
            </p>
        </div>
    );
}
