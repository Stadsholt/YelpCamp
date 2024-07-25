const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { storeReturnTo } = require('../middleware');


router.get('/register', (req, res) => {   // render register page
    res.render('users/register');
});


router.post('/register', catchAsync(async (req, res, next) => {   // try/catch to get errors, flash error. 
    try {
        const {email, username, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {   // logs user in when they register
            if (err) return next(err);
            req.flash('success', 'Registered to Yelp Camp!');
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('register');
    }
}));

router.get('/login', (req, res) => {  // render login page
    res.render('users/login');
})




router.post('/login',storeReturnTo, passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}),    // magic "authenticate" passport middleware. + storereturnto middleware
    (req, res) => {
        req.flash('success', 'Welcome back!');
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
    });



router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/campgrounds');
    });
}); 







module.exports = router;