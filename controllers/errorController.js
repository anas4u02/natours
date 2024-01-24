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
        sendErrorProd(err, res);
    }
    next();
}