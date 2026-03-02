import { redirectIfNotAuthenticated } from "../../utils/redirectIfNotAuthenticated";
import DashboardContent from "./_components/DashboardContent";

export default async function Dashboard() {
    await redirectIfNotAuthenticated();
    return (
        <div className="min-h-screen bg-transparent">
            <DashboardContent />
        </div>
    );
}

