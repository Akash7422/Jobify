import mongoose from "mongoose"
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config({ path: "./config.env" })
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide Name"],
        minlength: 3,
        maxlength: 20,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide Email"],
        validate: {
            validator: validator.isEmail,
            message: "Please provide a valid Email",
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minlength: 6,
        select: false,
    },
    lastName: { type: String, maxlength: 20, trim: true, default: "lastname" },
    location: { type: String, maxlength: 20, trim: true, default: "my city" },
})

UserSchema.pre("save", async function () {
    // console.log(this.modifiedPaths())
    //console.log(this.isModified('name'))
    if (!this.isModified("password")) {
        return
    }
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hash(this.password, 12)
    } catch (err) {
        throw new Error("Something went wrong in password encryption")
    }
    this.password = hashedPassword
    //console.log(this.password)
})

UserSchema.methods.createJWT = async function () {
    let token
    try {
        token = await jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_LIFETIME,
        })
    } catch (err) {
        throw new Error("Something went wrong in Token generation")
    }
    return token
    // console.log(this)
}

UserSchema.methods.comparePaasword = async function (candidatePassword) {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}

export default mongoose.model("User", UserSchema)
