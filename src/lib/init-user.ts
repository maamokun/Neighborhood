import { createUser } from "@/lib/user-management";

const user = await createUser({
	username: "admin",
	password: "password",
	role: "admin",
});

console.log("User created:", user);
