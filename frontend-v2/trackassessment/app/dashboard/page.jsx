import { createClient } from "../../utils/supabase/server";
import { redirectIfNotAuthenticated } from "../../utils/redirectIfNotAuthenticated";
import LogoutButton from "../_components/LogoutButton";

export default async function Dashboard(){
    await redirectIfNotAuthenticated();
    const supabase = await createClient();
    const {data} = await supabase.auth.getUser();

    return(
        <div className="flex bg-transparent">
            <main className="flex justify-center">
                <h1 className="text-stone-700/70 text-2xl">Dashboard</h1>
            </main>
        </div>
    )
}