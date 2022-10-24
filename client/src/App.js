import React from "react"
import {
    AddJob,
    AllJobs,
    Stats,
    Profile,
    SharedLayout,
    ProtectedRoutes,
} from "./pages/dashboard"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Error, Register, Landing } from "./pages"
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoutes>
                            <SharedLayout />
                        </ProtectedRoutes>
                    }>
                    <Route index element={<Stats />} />
                    <Route path="add-job" element={<AddJob />} />
                    <Route path="all-jobs" element={<AllJobs />} />
                    <Route path="profile" element={<Profile />} />
                </Route>
                <Route path="/register" element={<Register />} />
                <Route path="/landing" element={<Landing />} />
                <Route path="*" element={<Error />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
