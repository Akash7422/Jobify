import { StatusCodes } from "http-status-codes"
const errorHandlerMiddleware = (err, req, res, next) => {
    //console.log(err)
    const defaultError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || "Soething went wrong, Please try again",
    }
    if (err.name === "ValidationError") {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        //defaultError.msg = err.message
        defaultError.msg = Object.values(err.errors)
            .map((item) => item.message)
            .join(",")
    }
    if (err.code && err.code === 11000) {
        defaultError.statusCode = StatusCodes.BAD_REQUEST
        defaultError.msg = `${Object.keys(err.keyValue)} field has to be unique`
    }
    // res.status(defaultError.statusCode || 500).json({
    //     message: err || "An unknown error occurred!",
    // })
    res.status(defaultError.statusCode || 500).json({
        message: defaultError.msg || "An unknown error occurred!",
    })
}

export default errorHandlerMiddleware
