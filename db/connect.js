import mongoose from "mongoose"
import CustomAPIError from "../errors/custom-api.js"

export const connectDB = async (url) => {
    try {
        return mongoose.connect(url, { useNewUrlParser: true })
    } catch (err) {
        return new CustomAPIError("Somethingwent wrong, Please try again later")
    }
}
