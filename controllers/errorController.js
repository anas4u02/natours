const AppError = require('../utils/appError');

const handleCastErrorDB = err => {
    const message = `Invalid ${err.path}: ${err.value} values`;
    console.log("handleCastErrorDB: ");
    return (new AppError(message, 400));
}

const sendErrorDev = (err, res) => {
    res.status(err.statusCode).json({
        error: err,
        status: err.status,
        message: err.message,
        stack: err.stack
    });
}

const sendErrorProd = (err, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
    } else {
        console.log("ERROR 🌋");
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong, please try again!'
        });
    }

}

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV == 'development') {
        sendErrorDev(err, res);
    } else if (process.env.NODE_ENV == 'production') {
        console.log("Inside Production error handling!");
        let error = { ...err };


        console.log("error OBJ: ", error);
        if (err.name == 'CastError') {
            console.log("INSIDE IF BLOCK");
            error = handleCastErrorDB(error);
        }
        sendErrorProd(error, res);
    }
    next();
}