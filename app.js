const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user-routes');
const tourRouter = require('./routes/tour-routes');

const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

// START SERVER

module.exports = app;