import Sidebar from "../_components/ui/Sidebar/page";


export default async function DashboardLayout({children}){
    return(
        <div className="dark:bg-transparent">
            <Sidebar></Sidebar>
            {children}
        </div>
    )
}