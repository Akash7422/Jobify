import { useAppContext } from "../context/appContext"
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({ children }) => {
    const { token } = useAppContext()
    if (!token) {
        return <Navigate to="/landing" />
    }
    return children
}

export default ProtectedRoute
