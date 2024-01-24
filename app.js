/* eslint-disable prettier/prettier */
const express = require('express');
const morgan = require('morgan');
const userRouter = require('./routes/user-routes');
const tourRouter = require('./routes/tour-routes');
const e = require('express');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(express.static(`${__dirname}/public`));

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use('/api/v1/users', userRouter);
app.use('/api/v1/tours', tourRouter);

app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
});

app.all('*', (req, res, next)=> {
  next(new AppError(`Can't find the requested ${req.originalUrl} route!`, 404));
});

app.use(globalErrorHandler);

// START SERVER

module.exports = app;