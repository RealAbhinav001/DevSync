import { Routes, Route } from "react-router-dom"
import Login from "../pages/Login/login"
import Register from "../pages/Register/register"
import Landing from "../pages/landing/Landing"
import Organization from "../pages/Organization/organization"
import ProtectedRoute from "./ProtectedRoutes"
import OrganizationDetail from "../pages/OrganizationDetails/organizationDetail"
import OrganizationMember from "../pages/Member/Member"
import Invites from "../pages/Invites/Invites"
import OrganizationInvites from "../pages/OrganizationInvites/Organization"
import Team from "../pages/Team/Team"
import TeamDetail from "../pages/TeamDetails/TeamDetail"
import Project from "../pages/Project/Project"
import Task from "../pages/Task/Task"
import NotFound from "../pages/NotFound/NotFound"
import OrgLayout from "./orgLayout"

const AppRoutes = () => {
    return (
        <Routes>
            {/* ── public / non-org routes ── */}
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route
                path="/organization"
                element={
                    <ProtectedRoute>
                        <Organization />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/invites"
                element={
                    <ProtectedRoute>
                        <Invites />
                    </ProtectedRoute>
                }
            />

            {/* ── org section (nested under layout: navbar + NotificationProvider + Outlet) ── */}
            <Route
                path="/organization/:id"
                element={
                    <ProtectedRoute>
                        <OrgLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<OrganizationDetail />} />
                <Route path="members" element={<OrganizationMember />} />
                <Route path="invites" element={<OrganizationInvites />} />
                <Route path="teams" element={<Team />} />
                <Route path="teams/:teamId" element={<TeamDetail />} />
                <Route path="teams/:teamId/projects" element={<Project />} />
                <Route path="teams/:teamId/projects/:projectId" element={<Task />} />
            </Route>

            {/* ── catch-all ── */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default AppRoutes
