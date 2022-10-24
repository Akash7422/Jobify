import dotenv from "dotenv"
dotenv.config({ path: "../config.env" })
import jwt from "jsonwebtoken"
import UnAuthenticatedError from "../errors/unathenticated.js"
const auth = (req, res, next) => {
    const authHeader = req.headers.authorization
    //console.log(process.env.JWT_SECRET)
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        throw new UnAuthenticatedError("Authentication Invalid")
    }
    const token = authHeader.split(" ")[1]
    //console.log(token)
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET)
        // console.log(payload)
        // attach the user request object
        // req.user = payload
        req.user = { userId: payload.userId }
        // console.log(req.user)
        next()
    } catch (error) {
        throw new UnAuthenticatedError("Authentication invalid")
    }
}

export default auth
