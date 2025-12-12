'use client'

import { useState } from "react";
import '../styles/login.css';
export default function page() {
    const [show, setShow] = useState(false);


    return (
        <>
            <section className="bg-blue-200bg-red-50 align-center">
                <div className="card">
                    <div className="card-contents flex justify-center flex-col">
                        <h1>Login</h1>
                        <h5><label htmlFor="username">Username</label></h5>
                        <input name="username" type="text" placeholder='example.username' />
                        <h5><label htmlFor="username">Password</label></h5>
                        <div className="card-password">
                            <input name="password" type={show ? "text" : "password"} placeholder='examplepassword' />
                            <button type="button" className="showpw" onClick={() => setShow(prev => !prev)}  >
                                {show ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-password"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 10v4" /><path d="M10 13l4 -2" /><path d="M10 11l4 2" /><path d="M5 10v4" /><path d="M3 13l4 -2" /><path d="M3 11l4 2" /><path d="M19 10v4" /><path d="M17 13l4 -2" /><path d="M17 11l4 2" /></svg>
                                    : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-circle-dashed-letter-a"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M10 16v-6a2 2 0 1 1 4 0v6" /><path d="M10 13h4" /><path d="M8.56 3.69a9 9 0 0 0 -2.92 1.95" /><path d="M3.69 8.56a9 9 0 0 0 -.69 3.44" /><path d="M3.69 15.44a9 9 0 0 0 1.95 2.92" /><path d="M8.56 20.31a9 9 0 0 0 3.44 .69" /><path d="M15.44 20.31a9 9 0 0 0 2.92 -1.95" /><path d="M20.31 15.44a9 9 0 0 0 .69 -3.44" /><path d="M20.31 8.56a9 9 0 0 0 -1.95 -2.92" /><path d="M15.44 3.69a9 9 0 0 0 -3.44 -.69" /></svg>}
                            </button>
                        </div>
                        <button className='primary w-100 mt-10 rounded-xl'>Login</button>

                    </div>
                </div>

            </section>
        </>
    );
}
