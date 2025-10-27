import { auth, signOut, signIn } from "@/auth";
import { redirect } from "next/navigation";

import Navbar from "../component/navbar/page";

export default async function SignIn() {
  const session = await auth();
  const user = session?.user;

  return user ? (
    <>
      <section>
        <Navbar></Navbar>
        <div className="flex w-full h-screen justify-start items-center">
          <div className="flex w-80 h-[90%] align-center justify-start flex-col gap-4 items-center p-7 bg-white rounded-lg shadow-md">
            <img
              src={user?.image ?? undefined}
              alt="Profile Image"
              className="w-[7vw] rounded-full"
            />
            <div>Welcome, {user.name}!</div>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="formbtns flex align-middle justify-center px-6 py-2 gap-1 text-[1vw] border-1 border-transparent hover:border-sky-500 duration-300 transition-color ease-in-out"
              >
                Sign Out
              </button>
            </form>
            <div className="border-1 w-full">
              <p>TEST</p>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    redirect("/")
  );
}
