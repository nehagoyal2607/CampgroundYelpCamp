var express = require("express"),
	app = express(),
	bodyParse = require("body-parser"),
	mongoose = require("mongoose"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	methodOverride = require("method-override"),
	flash = require("connect-flash"),
	Campground = require("./models/campground"),
	Comment = require("./models/comment"),
	User = require("./models/user"),
	seedDB = require("./seeds");

var indexRoutes = require("./routes/index"),
	campgroundRoutes = require("./routes/campgrounds"),
	commentRoutes = require("./routes/comments");

// mongoose.connect('mongodb://localhost:27017/yelp_camp', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));
var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp";

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));



// Campground.create(
// 	{name:"Ibn Whitehouse", 
// 	 image:"https://r-cf.bstatic.com/xdata/images/hotel/270x200/239141264.webp?k=6e75400e45f93067e0389cf13bcd8ef2eda2a9b9311bbd379f3a22d6b96e3c56&o=",
// 	description:"Ibn Whitehouse is a great campground. No water. No electricity. You must definitely visit it."},function(err,camp){
// 		 if(err){
// 			 console.log(err);
// 		 }else{
// 			 console.log("CAMP ADDED");
// 			 console.log(camp);
// 		 }
// 	 })


app.set("view engine","ejs");
app.use(bodyParse.urlencoded({extended:true}));
app.use(express.static(__dirname+"/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB(); //seed database

app.use(require("express-session")({
	secret:"I love web development",
	resave:false,
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})
app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
	console.log("Now serving the YELPCAMP app.");
})