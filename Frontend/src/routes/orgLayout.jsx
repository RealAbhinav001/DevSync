import "./orgLayout.css";
import { NotificationProvider } from "../context/notificationProvider";
import { Outlet } from "react-router-dom"
import DashNav from "../components/layout/Dashboard Navbar/dashNav";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const OrgLayout = ()=>{
    const {user} = useContext(AuthContext)

    return(
        <NotificationProvider>
            <div className="org-navshell">
                <div className="org-navframe">
                    <DashNav user={user?.name}/>
                </div>
            </div>
            <Outlet/>
        </NotificationProvider>
    )
}

export default OrgLayout