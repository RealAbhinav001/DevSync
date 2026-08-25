import {Routes,Route} from "react-router-dom"
import Login from "../pages/Login/login"
import Register from "../pages/Register/register"
import Landing from "../pages/landing/Landing"
import Organization from "../pages/Organization/organization"
import ProtectedRoute from "./ProtectedRoutes"
import OrganizationDetail from "../pages/OrganizationDetails/organizationDetail"
import OrganizationMember from "../pages/Member/Member"
import Invites from "../pages/Invites/invites"
import OrganizationInvites from "../pages/OrganizationInvites/Organization"
import Team from "../pages/Team/Team"
import TeamDetail from "../pages/TeamDetails/TeamDetail"
import Project from "../pages/Project/Project"
import Task from "../pages/Task/task"

const AppRoutes = ()=>{
    return(
        <Routes>
            <Route path="/" element = {<Landing/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/organization" element={
                <ProtectedRoute>
                    <Organization/>
                </ProtectedRoute>
                }/>

            <Route path="/organization/:id" element={
                <ProtectedRoute>
                    <OrganizationDetail/>
                </ProtectedRoute>
            }/>

            <Route path="/organization/:id/members" element={
                <ProtectedRoute>
                    <OrganizationMember/>
                </ProtectedRoute>
            }/>

            <Route path="/invites" element={
                <ProtectedRoute>
                    <Invites/>
                </ProtectedRoute>
            }/>

            <Route path="/organization/:id/invites" element={
                <ProtectedRoute>
                    <OrganizationInvites/>
                </ProtectedRoute>
            }/>

            <Route path="/organization/:id/teams" element={
                <ProtectedRoute>
                    <Team/>
                </ProtectedRoute>
            }/>
            <Route path="/organization/:id/teams/:teamId" element={
                <ProtectedRoute>
                    <TeamDetail/>
                </ProtectedRoute>
            }/>
            <Route path="/organization/:id/teams/:teamId/projects" element={
                <ProtectedRoute>
                    <Project/>
                </ProtectedRoute>
            }/>
            <Route path="/organization/:id/teams/:teamId/projects/:projectId" element={
                <ProtectedRoute>
                    <Task/>
                </ProtectedRoute>
            }/>
        </Routes>
    )
}

export default AppRoutes

