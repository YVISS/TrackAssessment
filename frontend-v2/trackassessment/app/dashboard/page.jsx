import { createClient } from "../../utils/supabase/server";
import { redirectIfNotAuthenticated } from "../../utils/redirectIfNotAuthenticated";
import LogoutButton from "../_components/LogoutButton";

export default async function Dashboard(){
    await redirectIfNotAuthenticated();
    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    return(
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <h1 className="text-5xl">Welcome to your Dashboard, {data.user.email}</h1>
            </main>
        </div>
    )
}