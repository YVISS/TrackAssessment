import { redirectIfNotAuthenticated } from "../../utils/redirectIfNotAuthenticated";
export default async function Dashboard() {
    const user = await redirectIfNotAuthenticated();
    return (
        <div className="flex bg-transparent">
            <main className="flex justify-center">
                
            </main>
        </div>
    )
}