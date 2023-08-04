const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const User = require('../models/user');


async function getUserByEmail(email) {
    try {
        const user = await User.findOne({ email: email });
        return user;
    } catch (error) {
        throw new Error(error);
    }
}
async function getUserById(id) {
    try {
        const user = await User.findById(id);
        return user;
    } catch (error) {
        throw new Error(error);
    }
}
const authenticate = async (email, password, done) => {
    const user = await User.findOne({ email: email });
    console.log(">>> passport-config User", user);
    if (!user) {
        console.log(">>> !user ")
        return done(null, false, { message: 'No user with that email' })
    }

    try {
        if (await bcrypt.compare(password, user.password)) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Password incorrect' })
        }
    } catch (e) {
        return done(e)
    }
}


function initialize(passport) {


    passport.use('local', new LocalStrategy(
        
        async (username, password, done)=> {
            //console.log(">>> u/p:", username, password)
            // Match user
            const user = await User.findOne({ username: username });
            if (user == null) {
                console.log(">>> !user ")
                return done(null, false, { message: 'No user with that email' })
            }
            // Match password
            try {
                if (await bcrypt.compare(password, user.password)) {
                    return done(null, user)
                } else {
                    return done(null, false, { message: 'Password incorrect' })
                }
            } catch (e) {
                return done(e)
            }
    }))

    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    });

}



module.exports = initialize


