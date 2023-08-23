const express = require('express')
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user'); 
const Project = require('../models/project'); 


router.get('/', async (req, res) => {
    try {
        const projects = await Project.find();
        res.render('index', { projects, isAuthenticated: req.isAuthenticated() });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs', { isAuthenticated: req.isAuthenticated() })
})
  
router.post('/login', passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs', { isAuthenticated: req.isAuthenticated() })
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
      return res.redirect('/');
    }
    next();
}

module.exports = router


