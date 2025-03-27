import { auth } from "@/auth";
import { redirect } from "next/navigation";
import UserCreationForm from "@/ui/UserCreationForm";

export default async function LoginPage() {
	const session = await auth();
	if (session?.user.role !== "admin") {
		redirect("/Semester");
	}
	return <UserCreationForm />;
}
