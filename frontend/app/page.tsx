import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { notoSans } from './fonts/fonts';
export default function page() {
    return (
        <section className="px-24 py-4 w-full justify-start flex flex-col items-start gap-[10vw] h-screen">
            <header className='flex items-center gap-4 justify-between w-full'>
                <div className="nav_logo">
                    <Image src="/logo.svg" width={52} height={52} loading='lazy' alt='Logo' />
                </div>
                <nav>
                    <ul>
                        <li className={`${notoSans.className} flex items-center gap-6 text-md justify-center w-full`}>
                            <Link href={"/"}>Home</Link>
                            <Link href={"/"}>About</Link>
                            <Link href={"/"}>Test</Link>
                            <Link href={"/"}>Resources</Link>
                        </li>
                    </ul>
                </nav>
                <div className="nav_cta gap-4 flex">
                    <button className='formbtns-2 border bg-sky-200 hover:border border-sky-200 hover:bg-transparent duration-300 ease-in-out'>Login</button>
                    <button className='formbtns-1 bg-sky-500'>Register</button>
                </div>

            </header>
        </section>
    );
}