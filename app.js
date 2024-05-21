//Loads the express module
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const hbsConfig = require('./controllers/hbsConfig');
const path = require('path');
const fileUpload = require('express-fileupload');

// This library used to read global variables from .env file in the root of the application
var dotenv = require('dotenv');
const { debug } = require('console');
dotenv.config({ path: './.env' });

//Creates express server
const app = express();

// init cookies
app.use(cookieParser());

//Serves static files (we need it to import a css file)
app.use(express.static(path.join(__dirname, './public')));
// Other node Modules

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// enable files upload
app.use(fileUpload({
    createParentPath: true
}));

// Register View Engine Handlebars
const hbs = exphbs.create(hbsConfig.Configuration);

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Enable Cache
if (process.env.NODE_ENV === "development") {
    app.disable('view cache');
} else {
    app.enable('view cache');
}

// Define routes
app.use(require('./controllers/routeConfig'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development / production
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('./home/error');
});

module.exports = app;
