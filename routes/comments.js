var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comments");
var middleware = require("../middleware");

//NEW ROUTE
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res) {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            //find the new.ejs file inside comments folder
            res.render("comments/new", {campground: campground});
        }
    });
});

//POST ROUTE
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res)
{
   //lookup camground using id
   Campground.findById(req.params.id, function(err, campground) {
      if(err)
      {
          console.log(err);
          res.redirect("/campgrounds");
      }
      else
      {
          Comment.create(req.body.comment, function(err, comment)
          {
              if(err)
              {
                  req.flash("error", "Something went wrong");
                  console.log(err);
              }
              else
              {
                  //add username and id to comment
                  comment.author.id = req.user
                  comment.author.username = req.user.username;
                  //save comment
                  comment.save();
                  campground.comments.push(comment);
                  campground.save();
                  req.flash("success", "Successfully added comment");
                  res.redirect("/campgrounds/" + campground._id);
              }
          })
      }
   });
   //create new comment
   
   //connect new comment to campground
   
   //redirect to campground show page
});

//COMMENTS EDIT ROUTE
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentsOwnership , function(req, res)
{
    Comment.findById(req.params.comment_id, function(err, foundComment)
    {
       if(err)
       {
           res.redirect("back");
       }
       else
       {
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
       }
    });
});

//COMMENTS UPDATE ROUTE
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentsOwnership , function(req, res)
{
   Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment)
   {
       if(err)
       {
           res.redirect("back");
       }
       else
       {
            res.redirect("/campgrounds/" + req.params.id);   
       }
   }) ;
});

//COMMENTS DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentsOwnership , function(req, res)
{
   Comment.findByIdAndRemove(req.params.comment_id, function(err)
   {
       if(err)
       {
           res.redirect("back");
       }
       else
       {
           req.flash("success", "Comment deleted");
           res.redirect("/campgrounds/" + req.params.id);
       }
   })
});

module.exports = router;