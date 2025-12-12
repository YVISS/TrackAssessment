import Link from "next/link";
export default function Page() {
  return (
    <section className="bg-white w-full h-auto p-2 rounded-lg ">
      <div className="flex items-center justify-start px-4">
        <Link href={"/dashboard"}>
          <img src="/logo.png" alt="" width={150}   /> 
        </Link>
        <p className="text-xl"></p>
      </div>
    </section>
  );
}
