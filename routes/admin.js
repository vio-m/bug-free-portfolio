const express = require('express');
const cookieParser = require('cookie-parser');
const router = express.Router();
const mongoose = require('mongoose');
const Visitor = require('../models/visitor');


// Middleware function to track unique visitors
router.use(cookieParser());

function generateUniqueVisitorId() {
    return Math.random().toString(36).substring(2);
}

// Middleware function to log IP address and handle visitorId cookie
router.use(async (req, res, next) => {
    const visitorIdCookie = req.cookies.visitorId;
    const visitorIdRequest = req.visitorId;

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

// Route to display unique visitor information
router.get('/admin', checkAuthenticated, async (req, res) => {
    // Fetch unique visitors from the MongoDB collection
    try {
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

        res.render('admin', { uniqueVisitors, formatDateTime, visitorId: req.visitorId });
    } catch (error) {
        console.error('Error fetching visitor data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Delete selected visitors route
router.post('/delete', async (req, res) => {
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




/*


// Middleware function to log IP address and handle visitorId cookie
router.use(async (req, res, next) => {
    const visitorId = req.cookies.visitorId

    if (!visitorId) {
        const newVisitorId = generateUniqueVisitorId();
        res.cookie('visitorId', newVisitorId, { maxAge: 86400000, httpOnly: true });
        req.visitorId = newVisitorId; // Store the generated visitorId in the request object
    } else {
        req.visitorId = req.cookies.visitorId; // Use the existing visitorId from the cookie
    }
  
    const visitor = new Visitor({
        v_id: visitorId,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        referer: req.headers['referer'] || 'Direct visit',
        timestamp: new Date()
    });

    // Save visitor data to the MongoDB collection
    try {
        await visitor.save();
    } catch (error) {
        console.error('Error saving visitor data to MongoDB:', error);
    }
    next();
});





// Route to display unique visitor information
router.get('/admin', checkAuthenticated, async (req, res) => {
    try {
        // Get all unique visitors from the MongoDB collection
        const uniqueVisitors = await Visitor.aggregate([
            // Group by 'v_id' to find the latest visitor for each unique ID
            { $group: { _id: '$v_id', latestVisitor: { $last: '$$ROOT' } } },
            // Project only the required fields
            {
                $project: {
                    _id: '$latestVisitor._id',
                    v_id: '$latestVisitor.v_id',
                    ip: '$latestVisitor.ip',
                    userAgent: '$latestVisitor.userAgent',
                    timestamp: '$latestVisitor.timestamp'
                }
            }
        ]);

        // Delete older unique visitors with the same 'v_id'
        const deletePromises = [];
        uniqueVisitors.forEach((visitor) => {
            const deletePromise = Visitor.deleteMany({ v_id: visitor.v_id, _id: { $ne: visitor._id } });
            deletePromises.push(deletePromise);
        });

        // Wait for all delete operations to complete before rendering the admin page
        await Promise.all(deletePromises);

        res.render('admin', { uniqueVisitors, formatDateTime, visitorId: req.visitorId });
    } catch (error) {
        console.error('Error fetching visitor data from MongoDB:', error);
        res.status(500).send('Internal Server Error');
    }
});



*/