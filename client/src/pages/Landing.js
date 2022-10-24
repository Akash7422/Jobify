import main from "../assets/images/main-alternative.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import { Logo } from "../components"
import { Link } from "react-router-dom"
export const Landing = () => {
    return (
        <Wrapper>
            <nav>
                <Logo />
            </nav>
            <div className="container page">
                <div className="info">
                    <h1>
                        Job <span>tracking</span> app
                    </h1>
                    <p>
                        Train Control & Management System (TCMS) is a
                        train-borne distributed control system. It comprises
                        computer devices and software, human-machine interfaces,
                        digital and analogue input/ output (I/O) capability and
                        the data networks to connect all these together in a
                        secure and fault-resistant manner.
                    </p>
                    <Link to="/register" className="btn btn-hero">
                        Login/Register
                    </Link>
                </div>
                <div>
                    <img src={main} alt="Job Hunt" className="img main-img" />
                </div>
            </div>
        </Wrapper>
    )
}
