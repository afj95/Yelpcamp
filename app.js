const
    express            = require("express"),
    app                = express(),
    seedDB             = require("./seeds"),
    passport           = require("passport"),
    mongoose           = require("mongoose"),
    bodyParser         = require("body-parser"),
    flash              = require("connect-flash"),
    User               = require("./models/user"),
    authRoutes         = require("./routes/auth"),
    localSrategy       = require("passport-local"),
    methodOverride     = require("method-override"),
    Comment            = require("./models/comment"),
    commentRoutes      = require("./routes/comments"),
    Campground         = require("./models/campground"),
    campgropundsRoutes = require("./routes/campgrounds");

      
// seedDB(); // seed the database

// mongoose.connect('mongodb://localhost/yelp_camp', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })
// .then( () => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

mongoose.connect('mongodb+srv://YelpCamp_User:yalpcampPassword@cluster0.zkhdp.mongodb.net/YelpCamp?retryWrites=true&w=majority',
{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})
.then( () => console.log('Connected to DB!'))
.catch(error => console.log(error.message));

app.set('view engine', 'ejs') // For .ejs files

app.use(flash())

// PASSPORT Configuration
passport.use(new localSrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(require("express-session")({
    secret: "Once again I wins",
    resave: false,
    saveUninitialized: false,
}));

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(passport.initialize());
app.use(passport.session());
// A way to path a data to all routes
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next()
})
app.use(authRoutes);
app.use("/campgrounds", campgropundsRoutes) 
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(process.env.PORT || 9999, process.env.IP, () => {
    console.log('server is started')
});