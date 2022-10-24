import { readFile } from "fs/promises"

import dotenv from "dotenv"
dotenv.config({ path: "./config.env" })

import { connectDB } from "./db/connect.js"
import Job from "./models/Jobs.js"

const PORT = process.env.PORT || 5000
//middleware
const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD
)

const start = async () => {
    try {
        await connectDB(DB)
        await Job.deleteMany()

        const jsonProducts = JSON.parse(
            await readFile(new URL("./mock-data.json", import.meta.url))
        )
        await Job.create(jsonProducts)
        console.log("Success!!!!")
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()
