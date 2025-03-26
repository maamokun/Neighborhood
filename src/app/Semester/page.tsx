import Link from "next/link";

const terms = ["1年前期", "1年後期", "2年前期", "2年後期"];

export default function SemesterPage() {
    return (
        <div>
            <h1>年度・学期を選択</h1>
            <ul>
                {terms.map((term) => (
                    <li key={term}>
                        <Link href={`/Semester/Lesson?term=${encodeURIComponent(term)}`}>
                            {term}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}
