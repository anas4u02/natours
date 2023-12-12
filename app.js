const express = require('express');
const { log } = require("console");
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

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});