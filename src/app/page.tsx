import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/ui/LoginForm";

export default async function LoginPage() {
	const session = await auth();
	if (session) {
		redirect("/Semester");
	}
	return <LoginForm />;
}
