const express = require('express')
const path = require('path');
const bcrypt = require('bcrypt')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user'); 
const Project = require('../models/project'); 
const Counter = require('../models/counter');


router.get('/', async (req, res) => {
    try {
        // Render the page without projects
        res.render('index', { projects: [], isAuthenticated: req.isAuthenticated() });
        // Fetch projects asynchronously and update the page
        //const projects = await Project.find();
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send('Internal server error');
    }
});

router.get('/api/projects', async (req, res) => {
    try {
        const projects = await Project.find();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'Internal server error' });
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

router.get('/download', async (req, res) => {
    try {
        // Increment the download counter (store the count in a database)
        await incrementDownloadCounter();
    
        // Send the CV file for download
        const cvPath = path.join(__dirname, '../public/download/', 'MoldovanViorelWebDev.pdf'); 
        res.download(cvPath, 'MoldovanViorelWebDev.pdf');
    } catch (error) {
        console.error('Error handling download:', error);
        res.status(500).send('Internal Server Error');
    }
});

async function incrementDownloadCounter() {
    // Find and update the counter document, or insert if it doesn't exist
    await Counter.updateOne(
      { _id: "65abe9061b8772f81bb0cb59" },
      { $inc: { count: 1 } },
      { upsert: true }
    );
}


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


