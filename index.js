const express = require('express');
//const compression = require('compression');
const app = express();
const database = require('./config/database');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('passport');
const initialize = require('./config/passport');


// Initialize Passport
initialize(passport);

//app.use(compression());

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(flash());

app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
    res.locals.flash = req.flash();
    next();
  });

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');

app.use('/', adminRoutes);
app.use('/', authRoutes);

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log('Server is running on port ' + PORT);
});





