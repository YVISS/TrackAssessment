import Sidebar from "../_components/ui/Sidebar/page";


export default async function DashboardLayout({children}){
    return(
        <div>
            <Sidebar></Sidebar>
            {children}
        </div>
    )
}