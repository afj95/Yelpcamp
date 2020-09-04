const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground")
const Comment = require("../models/comment")
const middleware = require("../middleware")

// Comments new
router.get("/new", middleware.isLoggedIn, (req, res) => {
    console.log("id:", req.params.id)
    Campground.findById(req.params.id, (err, campground) => {
        if(err) console.log(err)
        else {
            res.render("comments/new", {campground: campground})
        }
    })
})

router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if(err) {
            console.log(err)
            res.redirect("/campgrounds")
        }
        else {
            console.log(req.body.comment);
            Comment.create(req.body.comment, (err, comment) => {
                if(err) {
                    req.flash("error", "Something went wrong");
                    console.log(err)
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;

                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash("success", "Succefully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            })
        }
    })
})

// Comment edit route
router.get("/:comment_id/edit", middleware.checkCommentOwnership,  (req, res) => {
    Comment.findById(req.params.comment_id, (err, founddedComment) => {
        if(err) res.redirect("back")
        else 
            res.render("comments/edit", {campground_id: req.params.id, comment: founddedComment});
    })
})

// Comment update
router.put("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) res.redirect("back")
        else res.redirect("/campgrounds/" + req.params.id);
    })
})

// Comment destroy route
router.delete("/:comment_id", middleware.checkCommentOwnership, (req, res) => {
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if(err) res.redirect("back")
        else {
            req.flash("success", "Comment deleted")
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
})

module.exports = router;
