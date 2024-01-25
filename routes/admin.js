const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const Visitor = require('../models/visitor');
const Project = require('../models/project'); 
const Counter = require('../models/counter');


// Middleware function to track unique visitors
router.use(cookieParser());

function generateUniqueVisitorId() {
    return Math.random().toString(36).substring(2);
}

// Middleware function to log IP address and handle visitorId cookie
router.use(async (req, res, next) => {
    const visitorIdCookie = req.cookies.visitorId;
    const visitorIdRequest = req.visitorId;

    // Check if the request is to the "/alive" route, if so, skip logging
    if (req.originalUrl === '/alive') {
        return next();
    }

    if (!visitorIdCookie && !visitorIdRequest) {
        // If there is no existing visitorId in either cookies or request, it indicates a new visitor
        const newVisitorId = generateUniqueVisitorId();
        res.cookie('visitorId', newVisitorId, { maxAge: 86400000, httpOnly: true });
        req.visitorId = newVisitorId; // Store the generated visitorId in the request object

        // Save the new visitor to the database
        const visitor = new Visitor({
            v_id: newVisitorId,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            method: req.method,
            url: req.url,
            userAgent: req.headers['user-agent'],
            referer: req.headers['referer'] || 'Direct visit',
            timestamp: new Date()
        });

        try {
            await visitor.save();
            // Delete older visitors with the same IP address, keeping only the last 3
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const visitorsToDelete = await Visitor.find({ ip }).sort({ timestamp: -1 }).skip(3);
            const visitorIdsToDelete = visitorsToDelete.map(visitor => visitor._id);
            await Visitor.deleteMany({ _id: { $in: visitorIdsToDelete } });
        } catch (error) {
            console.error('Error saving new visitor data to MongoDB:', error);
        }
    } else {
        // If the visitor exists, update the timestamp only
        try {
            await Visitor.updateOne(
                { v_id: visitorIdCookie || visitorIdRequest }, // Use either cookie or request visitorId
                { $set: { timestamp: new Date() } }
            );
        } catch (error) {
            console.error('Error updating visitor timestamp in MongoDB:', error);
        }

        // If the cookie is not present but the request has a visitorId, set the cookie for future requests
        if (!visitorIdCookie && visitorIdRequest) {
            res.cookie('visitorId', visitorIdRequest, { maxAge: 86400000, httpOnly: true });
        }

        // Set the visitorId to use in the request object
        req.visitorId = visitorIdCookie || visitorIdRequest;
    }
    next();
});


// VISITORS
router.get('/admin', checkAuthenticated, async (req, res) => {
    // Fetch unique visitors from the MongoDB collection
    try {
        const allDownloads = await Counter.find() //Get the counter of CV downloads    
        const allProjects = await Project.find()
        
        const selectedProjectId = req.query.projectId; 
        const selectedProject = allProjects.find(project => project._id.toString() === selectedProjectId);

        const allVisitors = await Visitor.find({}).sort({ timestamp: -1 }); // Get all visitors and sort by timestamp in descending order
        // Group visitors by v_id and retain only the latest 3 for each v_id
        const latestVisitorsMap = new Map();
        allVisitors.forEach((visitor) => {
            if (latestVisitorsMap.has(visitor.v_id)) {
                const currentLatest = latestVisitorsMap.get(visitor.v_id);
                if (currentLatest.length < 3) {
                    currentLatest.push(visitor);
                }
            } else {
                latestVisitorsMap.set(visitor.v_id, [visitor]);
            }
        });

        // Flatten the latest visitors map to an array of uniqueVisitors
        const uniqueVisitors = [];
        latestVisitorsMap.forEach((visitors) => {
            visitors.forEach((visitor) => {
                uniqueVisitors.push({
                    v_id: visitor.v_id,
                    ip: visitor.ip,
                    userAgent: visitor.userAgent,
                    timestamp: visitor.timestamp
                });
            });
        });

        res.render('admin', { isAuthenticated: req.isAuthenticated(), projects: allProjects, downloads: allDownloads[0].count, selectedProject, uniqueVisitors, formatDateTime, visitorId: req.visitorId, projectsJson: JSON.stringify(allProjects) });
    } catch (error) {
        console.error('Error fetching visitor data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/delete-visitors', async (req, res) => {
    let selectedVisitorIds = req.body.selectedVisitors;
    try {
        // Delete selected visitors from the MongoDB collection
        await Visitor.deleteMany({ v_id: { $in: selectedVisitorIds } });
        res.redirect('/admin');
    } catch (error) {
        console.error('Error deleting visitors:', error);
        res.status(500).send('Internal Server Error');
    }
});

// CREATE COUNTER MODEL
router.post('/create-counter', async (req, res) => {
    try {
        const newCounter = new Counter();
        await newCounter.save();
        res.status(201).json({ message: 'Counter created successfully' });
        console.log("this: ", newCounter)
    } catch (error) {
        console.error('Error creating Counter:', error);
        res.status(500).send('Internal Server Error');
    }
});
// RESET the download counter value to default (zero)
router.post('/reset-counter', async (req, res) => {
    try {

        await Counter.updateOne(
            { _id: '65abe9061b8772f81bb0cb59' },
            { $set: { count: 0 } }
        );
        res.redirect('/admin'); 
    } catch (error) {
        console.error('Error resetting download counter:', error);
        res.status(500).send('Internal Server Error');
    }
});




// PROJECTS

router.post('/admin', async (req, res) => {
    try {
        const { title, description, image, technologies, github, demo } = req.body;
        const newProject = new Project({
            title,
            description,
            image,
            technologies,
            github,
            demo
        });
        await newProject.save(); 
        res.redirect('/admin'); 
    } catch (error) {
        console.error('Error creating project:', error);
        res.status(500).send('Internal server error');
    }
});
router.post('/edit', async (req, res) => {
    try {
        const { projectId, title, description, image, technologies, github, demo } = req.body;
        await Project.findByIdAndUpdate(projectId, { title, description, image, technologies, github, demo });
        res.redirect('/admin'); 
    } catch (error) {
        console.error('Error editing project:', error);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/delete-projects', async (req, res) => {
    try {
        const projectId = req.body.projectId;
        await Project.findByIdAndDelete(projectId); 
        res.redirect('/admin'); 
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).send('Internal Server Error');
    }
});



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

function formatDateTime(timestamp) {
    const date = new Date(timestamp);
    const twoDigits = (num) => String(num).padStart(2, '0');
    const month = twoDigits(date.getMonth());
    const day = twoDigits(date.getDate());
    const hours = twoDigits(date.getHours());
    const minutes = twoDigits(date.getMinutes());
    const seconds = twoDigits(date.getSeconds());
    return `${month}/${day} - ${hours}:${minutes}:${seconds}`;
}

module.exports = router;



