const express = require('express');
const router = express.Router(),
passport     = require('passport'),
User         = require('../models/user');

router.get('/', (req, res) => {
    // res.redirect('campgrounds')
    res.render('landing')
})

// show register form
router.get('/register', (req, res) => {
    res.render('register')
})

// handle sign up logic
router.post('/register', (req, res) => {
    console.log(req.body)
    var newUser = new User({username: req.body.username})
    console.log(newUser);
    User.register(newUser, req.body.password, (err, user) => {
        if(err) {
            req.flash('error', err.message)
            res.redirect('register')
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to YelpCamp  ' + user.username)
            // res.send('done')
            res.redirect('/campgrounds')
        })
    })
})

// show login form
router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}));

// logout route
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds');
})

router.get('/forgot', (req, res) => {
    res.render('forgot')
})


module.exports = router;