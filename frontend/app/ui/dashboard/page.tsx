import {auth, signOut} from "../../../auth"
import Card from "../../ui/card/page"
import Link from "next/link";

export default async function page() {
    const session = await auth();
    console.log(session);
    const user = session?.user;

    const name = user?.name;
    const profilepic = user?.image;
    
    return user ? (
        <section>
            <h1>Dashboard</h1>
            <img src={profilepic ?? undefined} alt="Profile Image" className="rounded-full" />
            <p>Welcome, {name}!</p>
            <form
                  action={async () => {
                    "use client"
                    await signOut()
                  }}
                >
                  <button type="submit" className="formbtns">Sign Out</button>
                </form>
        </section>
    ):(
        <section>
            <h1>Please Sign In to access the Dashboard</h1>
            <Card></Card>
        </section>
    );
}