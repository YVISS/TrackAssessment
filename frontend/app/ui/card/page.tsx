import Link from "next/link";
export default function page() {
    return (
        <section>
            <div className="flex flex-col gap-4 items-center justify-center mt-10 border p-6 rounded-lg border-gray-200">
                <h1 className="font-bold text-2xl">Log In</h1>
                <button className="formbtns w-auto signin hover:bg-blue-100 transition-colors duration-200 ease-in-out">
                    <Link href="./ui/signin" className="p-4 ">
                        Sign In
                    </Link>
                </button>
            </div>
        </section>
    );
}