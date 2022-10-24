import { Outlet, Link } from "react-router-dom"
import Wrapper from "../../assets/wrappers/SharedLayout"
import { Navbar, SmallSidebar, BigSidebar } from "../../components"

const SharedLayout = () => {
    return (
        <Wrapper>
            <nav>
                <main className="dashboard">
                    <SmallSidebar />
                    <BigSidebar />
                    <div>
                        <Navbar />
                        <div className="dashboard-page">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </nav>
        </Wrapper>
    )
}
export default SharedLayout
