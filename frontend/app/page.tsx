import Link from 'next/link';
import SignIn from './component/signin/page';
import './globals.css';
export default function page() {
    return (
        <section className="w-full justify-center align-center flex flex-col items-center gap-[10vw] bg-linear-to-b from-sky-100 from-20% via-sky-200 to-sky-700 h-screen">
            <h1 className="font-bold text-[3vw]">Track Assessment</h1>
            <div className=''>
                <div className=" w-auto relative flex justify-around align-center h-[250px] rounded-lg shadow-lg flex-col p-6 bg-white ">
                    <p className=''>Please Login using your Google Account</p>
                    <SignIn></SignIn>
                </div>
            </div>

        </section>
    );
}