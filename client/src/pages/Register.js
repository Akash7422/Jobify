import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Logo } from "../components"
import Wrapper from "../assets/wrappers/RegisterPage"
import { FormRow } from "../components"
import { Alert } from "../components"
import { useAppContext } from "../context/appContext"
const initialState = {
    name: "",
    email: "",
    password: "",
    isMember: true,
}

export const Register = () => {
    const [values, setValues] = useState(initialState)
    //global State and use navigate
    const navigate = useNavigate()
    const {
        user,
        token,
        isLoadng,
        showAlert,
        displayAlert,
        hideDisplayAlert,
        registerUser,
        loginUser,
        setupUser,
    } = useAppContext()

    const toggleHandler = () => {
        setValues({ ...values, isMember: !values.isMember })
    }
    const handleChange = (e) => {
        //console.log(event.target.name)
        setValues({ ...values, [e.target.name]: e.target.value })
        hideDisplayAlert()
    }
    const onSubmit = (e) => {
        e.preventDefault()

        const { email, name, password, isMember } = values
        if (!email || !password || (!isMember && !name)) {
            displayAlert()
            return
        }
        const currentUser = { name, email, password }
        if (isMember) {
            // console.log("Already a member")
            setupUser({
                currentUser,
                endPoint: "login",
                alertText: "Login Successfull! Redirecting...",
            })
        } else {
            setupUser({
                currentUser,
                endPoint: "register",
                alertText: "User Created! Redirecting...",
            })
        }
        //console.log(values)
    }
    useEffect(() => {
        if (token) {
            setTimeout(() => {
                navigate("/")
                hideDisplayAlert()
            }, 3000)
        }
    }, [token, navigate])
    return (
        <Wrapper className="full-page">
            <form className="form" onSubmit={onSubmit}>
                <Logo />
                <h3>{values.isMember ? "Login" : "Register"}</h3>

                {showAlert && <Alert />}
                {/* name field */}
                {!values.isMember && (
                    <FormRow
                        type="text"
                        name="name"
                        value={values.name}
                        handleChange={handleChange}
                    />
                )}
                <FormRow
                    type="email"
                    name="email"
                    value={values.email}
                    handleChange={handleChange}
                />
                <FormRow
                    type="password"
                    name="password"
                    value={values.password}
                    handleChange={handleChange}
                />

                <button type="submit" className="btn btn-block">
                    submit
                </button>
                <p>
                    {values.isMember
                        ? "Not a member yet? "
                        : "Already a Member?"}
                    <button
                        type="button"
                        onClick={toggleHandler}
                        className="member-btn">
                        {values.isMember ? "Register" : "Login"}
                    </button>
                </p>
            </form>
        </Wrapper>
    )
}
