const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user'); 


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})
  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

router.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            username: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        });
        await user.save();
        console.log('New user registered:', user);
        res.redirect('/login');
    } catch (error){
        req.flash('error', 'An error occurred during registration. Please try again.');
        console.log('Error creating user:', error);
        res.redirect('/register');
    }
});

router.delete('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});



// 404 Route
router.use((req, res) => {
  res.status(404).send('404: Page not found');
});



function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      console.log(">>> isAuthenticated");
      return res.redirect('/');
    }
    next();
}

module.exports = router


// ------------------------------------------------------------------------
/*
// Array to store visitor IP addresses
const visitors = [];

// Middleware function to track unique visitors
router.use(cookieParser());

router.use((req, res, next) => {
    if (!req.cookies.visitorId) {
      const visitorId = generateUniqueId();
      res.cookie('visitorId', visitorId, { maxAge: 86400000, httpOnly: true });
    }
    next();
});
  
function generateUniqueId() {
    return Math.random().toString(36).substring(2);
}

// Middleware function to log IP address
router.use((req, res, next) => {
    const visitor = {
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'] || 'Direct visit'
    };
    visitors.push(visitor);
    next();
});

// Route to display unique visitor information
router.get('/admin', (req, res) => {
    const uniqueVisitors = [];
    for (const cookie in req.cookies) {
        if (cookie === 'visitorId') {
            uniqueVisitors.push(req.cookies[cookie]);
        }
    }
    res.render('admin', { uniqueVisitors, visitors });
});*/

/* 
// Project routes
router
  .route("/projects")
  .get((req, res)=> {
      res.send('PROJECTS');
  })

router
  .route("/projects/:id")
  .get((req, res)=> {
      res.send(`Get project with ID ${req.params.id}`)
  })
  .put((req, res)=> {
      res.send(`Update project with ID ${req.params.id}`)
  })
  .delete((req, res)=> {
      res.send(`Delete project with ID ${req.params.id}`)
  })
*/
// ------------------------------------------------------------------
