import { createClient } from "../../utils/supabase/server";
import { redirectIfNotAuthenticated } from "../../utils/redirectIfNotAuthenticated";

export default async function Dashboard(){
    const user = await redirectIfNotAuthenticated();
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