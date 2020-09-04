// all the middleware goes here
const middlewareObj = {};
const Campground = require("../models/campground")
const Comment = require("../models/comment")

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        // Does user own the campground

        Campground.findById({_id: req.params.id}, (err, foundCampground) => {
            if(err) {
                req.flash("error", "Campground not found")
                res.redirect("back")
            } else {
                if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                if(foundCampground.author.id.equals(req.user._id))
                    next();
                else{
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        // Redirect the user back (previous page)
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

//===============================================================

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if(req.isAuthenticated()) {
        // Does user own the campground

        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect("back")
            } else {
                if(foundComment.author.id.equals(req.user._id))
                    next();
                else {
                    req.flash("error", "You don't have permission to do that")
                    res.redirect("back")
                }
            }
        })
    } else {
        // Redirect the user back (previous page)
        req.flash("error", "You need to be logged in to do that")
        res.redirect("back")
    }
}

//===============================================================

middlewareObj.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in to do that")
    res.redirect("/login")
}



module.exports = middlewareObj;