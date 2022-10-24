import express from "express"
import "express-async-errors"
import morgan from "morgan"
import { connectDB } from "./db/connect.js"
import errorHandlerMiddleware from "./middleware/error-handler.js"
import notFoundMiddleware from "./middleware/not-found.js"
import authenticateUser from "./middleware/auth.js"
import dotenv from "dotenv"
import authRouter from "./routes/authRoutes.js"
import jobsRouter from "./routes/jobsRouter.js"
import { dirname } from "path"
import { fileURLToPath } from "url"
import path from "path"
import helmet from "helmet"
import xss from "xss-clean"
import mongoSanitize from "express-mongo-sanitize"

dotenv.config({ path: "./config.env" })
const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"))
}
const PORT = process.env.PORT || 5000
//middleware
const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
)
app.use(express.json())
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(express.static(path.resolve(__dirname, "./client/build")))

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/jobs", authenticateUser, jobsRouter)

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "../client", "build", "index.html"))
})

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const start = async () => {
    try {
        await connectDB(DB)
        app.listen(PORT, () => {
            console.log("Running server successfully....")
        })
    } catch (error) {
        console.log(error)
    }
}

start()
//some code
