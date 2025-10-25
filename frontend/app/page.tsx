import LoginPage from "./ui/login/page";
import Link from "next/link";

export default function page() {
    return (
        <main>
            <h1>Landing Page</h1>
            <p>
                <Link href="./ui/login">
                    Log In
                </Link>
            </p>
            <p>
                <Link href="./ui/signin">
                    Sign In
                </Link>
            </p>

        </main>
    );
}