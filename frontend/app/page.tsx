import './globals.css';
import Link from 'next/link';
import Image from 'next/image';
import { notoSans } from './fonts/fonts';
export default function page() {
    return (
        <section className="w-full justify-start flex flex-col items-start h-auto">
            <header className=' py-4 px-24 flex items-center justify-between w-full mb-12 border-b-1 border-sky-200'>
                <div className="nav_logo">
                    <Image src="/logo.png" width={100} height={100} loading='lazy' alt='Logo' />
                </div>
                <nav className='flex items-center gap-10'>
                    <ul>
                        <li className={`${notoSans.className} flex items-center gap-6 text-md justify-center w-full`}>
                            <Link href={"/"}>Home</Link>
                            <Link href={"/"}>About</Link>
                            <Link href={"/"}>Test</Link>
                            <Link href={"/"}>Resources</Link>
                        </li>
                    </ul>

                    <div className="nav_cta gap-4 flex">
                        
                            <Link href={"/signin"}>
                            <button className='primary'>Log In</button>
                            </Link>
                        <button className='secondary hover:text-white hover:bg-sky-700 transition duration-300 ease-in-out'>Register</button>
                    </div>
                </nav>

            </header>
            <section className='hero flex h-screen items-center justify-center w-full'>
                <div className="hero__card__content text-center m-60 flex items-center justify-center flex-col gap-4">
                    <p className='items-center flex justify-center align-center text-center font-bold text-white txt-md'>Navigate your senior high school journey</p>
                    <p className='text-white'>Discover your true academic potential with our comprehensive track assessment. We help you understand your strengths and find the perfect educational path.</p>
                    <div className="hero__btns flex items-center flex-row gap-4">
                        <button className='primary hover:text-white'>Start Assessment</button>
                        <button className='secondary'>Learn More</button>
                    </div>
                </div>
            </section>
            <section className='features w-full min-h-screen gap-20 flex flex-col bg-sky-200 p-24'>
                <div className="features__text text-center gap-4 flex items-center flex-col">
                    <p className='txt-normal'>Features</p>
                    <p className='txt-lg font-bold'>How it works</p>
                    <p className='txt-sm'>A comprehensive tool designed to map your academic potential and career direction.</p>
                </div>
                <div className="features__cards justify-center flex flex-row gap-8">
                    <div className="cards">
                        <div className="card_text text-white flex flex-col items-start gap-4 bottom-10">
                            <p className='txt-sm font-bold'>Aptitude Test</p>
                            <p className='txt-normal'>Take the national career assessment exam</p>
                            <p className='txt-xs'>Complete a standardized test that evaluates your academic strengths and potential career paths.</p>
                            <a href="">Start Now</a>
                        </div>
                    </div>
                    <div className="cards">
                        <div className="card_text text-white flex flex-col items-start gap-4 bottom-10">
                            <p className='txt-sm font-bold'>Grade upload</p>
                            <p className='txt-normal'>Submit your recent academic records</p>
                            <p className='txt-xs'>Provide your current grades to get a comprehensive analysis of your academic performance.</p>
                            <a href="">Upload grades</a>
                        </div>
                    </div>
                    <div className="cards">
                        <div className="card_text text-white flex flex-col items-start gap-4 bottom-10">
                            <p className='txt-sm font-bold'>Personalized results</p>
                            <p className='txt-normal'>Receive detailed track recommendations</p>
                            <p className='txt-xs'>Get a tailored report comparing your aptitude test results with your academic performance.</p>
                            <a href="/" className=''>View results</a>
                        </div>
                    </div>
                </div>
            </section>
        </section>
    );
}