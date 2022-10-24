import User from "../models/User.js"
import { StatusCodes } from "http-status-codes"
import BadRequestError from "../errors/bad-request.js"
import UnAuthenticatedError from "../errors/unathenticated.js"

export const register = async (req, res) => {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
        throw new BadRequestError("Please provide all values")
    }
    let existingUser
    try {
        existingUser = await User.findOne({ email: email })
    } catch (err) {
        throw new BadRequestError("Signing up failed, please try again later.")
    }

    if (existingUser) {
        throw new BadRequestError("User exists already, please login instead.")
    }
    const user = await User.create(req.body)
    //user.save()
    const token = await user.createJWT()
    res.status(StatusCodes.CREATED).json({
        user: { name: user.name, email: user.email, lastname: user.lastName },
        token,
        location: user.location,
    })
}
export const login = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        throw new BadRequestError("Please provide valid credentials")
    }
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }

    const isPasswordCorrect = await user.comparePaasword(password)
    if (!isPasswordCorrect) {
        throw new UnAuthenticatedError("Invalid Credentials")
    }
    const token = await user.createJWT()
    user.password = undefined
    res.status(StatusCodes.OK).json({ user, token, location: user.location })
}
export const update = async (req, res) => {
    // console.log(req.user)
    const { email, name, lastName, location } = req.body

    if (!email || !name || !lastName || !location) {
        throw new BadRequestError("Please provide all values")
    }

    const user = await User.findOne({ _id: req.user.userId })
    if (!user) {
        throw new BadRequestError("Please try again.")
    }
    user.email = email
    user.name = name
    user.lastName = lastName
    user.location = location

    await user.save()

    // various setups
    // in this case only id
    // if other properties included, must re-generate

    const token = await user.createJWT()
    res.status(StatusCodes.OK).json({
        user,
        token,
        location: user.location,
    })
}
