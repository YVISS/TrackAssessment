import Navbar from "../component/navbar/page";
import Link from "next/link";
export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className=" h-auto bg-linear-to-b from-sky-100 from-20% via-sky-200 to-sky-700">
      <header className="bg-white">
        <div className="flex items-center justify-start px-4">
          <Link href={"/dashboard"}>
            <img src="/logo.svg" alt="" width={70} />
          </Link>
          <p className="text-xl">Track Assessment</p>
        </div>
      </header>
      {children}
    </section>
  );
}
