var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");

//INDEX ROUTE
router.get("/",function(req,res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		}else{
			res.render("campgrounds/index",{campgrounds:allCampgrounds});
		}
	})
})
//CREATE ROUTE
router.post("/",middleware.isLoggedIn,function(req,res){
	var name = req.body.name;
	var image = req.body.image;
	var price = req.body.price;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username:req.user.username
	};
	var newCamp = {name:name, image:image, description:desc, author:author, price:price};
	Campground.create(newCamp, function(err,newCamp){
		if(err){
			req.flash("error","Something went wrong!");
			console.log(err);
		}else{
			req.flash("success","Campground created successfully.");
			res.redirect("/campgrounds");
		}
	})
})
//NEW ROUTE
router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
})
//SHOW ROUTE
router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err){
			req.flash("error","Something went wrong!");
			console.log(err);
		}else{
			res.render("campgrounds/show", {campground:foundCamp});
		}
	})
})
//EDIT ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findById(req.params.id,function(err, foundCamp){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			res.render('campgrounds/edit',{campground:foundCamp});
		}
	})
})
//UPDATE ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Updated successfully.");
			res.redirect("/campgrounds/"+req.params.id);
		}
	})
})
//DELETE ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndRemove(req.params.id,function(err){
		if(err){
			req.flash("error","Something went wrong!");
			res.redirect("/campgrounds");
		}else{
			req.flash("success","Updated successfully.");
			res.redirect("/campgrounds");
		}
	})
})

module.exports = router;