var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware/index.js");
//COMMENTS
//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err){
			console.log(err);
		}else{
			res.render("comments/new",{campground:foundCamp});
		}
	})
})
//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
	Campground.findById(req.params.id,function(err,foundCamp){
		if(err){
			console.log(err);
			req.flash("error","Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					req.flash("error","Something went wrong!");
					console.log(err);
				}else{
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					foundCamp.comments.push(comment);
					foundCamp.save();
					req.flash("success","Comment created successfully.");
					res.redirect("/campgrounds/"+foundCamp._id);
				}
			})
		}
	})
})
//EDIT ROUTE
router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id,function(err, foundComment){
		if(err){
			res.redirect("back");
		}else{
			res.render("comments/edit",{comment:foundComment, campground_id:req.params.id});
		}
	})
})
//UPDATE ROUTE
router.put("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("back");
		}else{
			req.flash("success","Comment updated successfully.");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
//DELETE ROUTE
router.delete("/:comment_id",middleware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndRemove(req.params.comment_id,function(err){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("back");
		}else{
			req.flash("success","Comment deleted successfully.");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})


module.exports = router;