import { auth, signOut, signIn } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "../component/navbar/page";

export default async function SignIn() {
  const session = await auth();
  const user = session?.user;

  return user ? (
    <>
      <section className="p-4">
        <div className="flex w-full h-screen justify-start items-center">
          <div className="flex w-80 h-[90%] align-center justify-start flex-col gap-4 items-center bg-white rounded-lg shadow-md">
            <div className="p-7 flex flex-col justify-center items-center gap-2">
              <img
                src={user?.image ?? undefined}
                alt="Profile Image"
                className="w-[7vw] rounded-full"
              />
              <div className="">
                Welcome, <span className="font-bold">{user.name}</span>
              </div>
              <form
                action={async () => {
                  "use server";
                  await signOut();
                }}
              >
                <button
                  type="submit"
                  className="formbtns flex align-middle justify-center px-6 py-2 gap-1 text-[1vw] border border-transparent hover:border-sky-500 duration-300 transition-color ease-in-out"
                >
                  Sign Out
                </button>
              </form>
            </div>

            <div className="w-full">
              <ul>
                <Link href="{}" className="w-full">
                  <li className="p-4 hover:bg-sky-100 hover:text-black w-full text-xl flex flex-row align-center gap-2 duration-300 transition-color ease-in-out text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-file-description"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
                      <path d="M9 17h6" />
                      <path d="M9 13h6" />
                    </svg>
                    Examination
                  </li>
                </Link>
                <Link href="" className="w-full">
                  <li className="p-4 hover:bg-sky-100 hover:text-black duration-300 transition-color ease-in-out w-full text-xl flex flex-row align-center gap-2 text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="icon icon-tabler icons-tabler-outline icon-tabler-table-dashed"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M3 5a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v14a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" />
                      <path d="M3 10h18" />
                      <path d="M10 3v18" />
                    </svg>
                    Results
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    redirect("/")
  );
}
