import { Link } from "react-router-dom"
import errorImg from "../assets/images/not-found.svg"
import Wrapper from "../assets/wrappers/ErrorPage"

export const Error = () => {
    return (
        <Wrapper className="full-page">
            <div>
                <img src={errorImg} alt="not found" />
                <h3>Oops! page not found</h3>
                <p>We can't seem to find the page you're looking for</p>
                <Link to="/landing">back home</Link>
            </div>
        </Wrapper>
    )
}
