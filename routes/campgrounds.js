const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware") // automatically will require index.js

router.get('/', (req, res) => {
    // Get all campgrounds from  DB
    Campground.find({}, (err, allCampground) => {
        err ? console.log(err) :
        res.render("campgrounds/index", {campgrounds: allCampground})
    })
    // res.render('campgrounds', {campgrounds: campgrounds})
})

router.post('/', middleware.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const price = req.body.price;
    const image = req.body.image;
    const desc = req.body.desc;

    var author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name: name, price: price, image: image, description: desc, author: author};
    
    // console.log(req.user);

    Campground.create(newCampground, (err, newlyCreated) => {
        if(err) {
            console.log(err)
        } else {
            console.log(newlyCreated);
            res.redirect('/campgrounds')
        }
    })
    // campgrounds.push(newCampground)
})

router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// SHOW - shows more info about one campground
router.get("/:id", (req, res) => {
    // console.log(req.user)
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec((err, foundCampground) => {
        if(err) console.log(err)
        else {
            // console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user})
        }
    })
})

// EDIT campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById({_id: req.params.id}, (err, foundCampground) => {
        res.render("campgrounds/edit", {campground: foundCampground});
    });
})

// UPDATE campground route
router.put("/:id", middleware.checkCampgroundOwnership, (req, res) => {
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {

            res.redirect("/campgrounds")
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

// DESTROY campground route
router.delete("/:id", middleware.checkCampgroundOwnership, middleware.isLoggedIn, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if(err) res.redirect("/campgrounds")
        else res.redirect("/campgrounds")
    })
})

module.exports = router;