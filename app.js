if(process.env.NODE_ENV !== "production")
{
    require('dotenv').config();
}
// Point of adding this condition: We don't want to use the .env file in the production environment.
// So, we will use this condition to use the .env file only in the development environment.
// Because, we don't want to leak our secret credential details.
// Why are we even storing this information, if it is so secret. Because we are going to upload
// our images/content to the cloudinary server, so we are required to have it's api key, and 
// it's access variables.


// console.log(process.env.SECRET); now we can access our environment variables anywhere in code.
/// We can access any environment variable using process.env.KEY_NAME.


const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 8080;
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require("ejs-mate");
const Review = require('./models/reviews.js'); // review model required.
const cookieParser = require('cookie-parser');
const session = require('express-session');  // This we will use to store the session.
const MongoStore = require('connect-mongo'); // for deployment of our session to online servers.    
const flash = require('connect-flash');  // This we will use to flash the messages.
const passport = require("passport");    // library for storing hashed passwords.
const LocalStrategy = require("passport-local"); // for storing local username and passwords.
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;


app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));


app.use(cookieParser("secretcode"));  // now every req will first pass through the cookieParser.
                                      // passed secretcode along with it, for signed cookies.
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.engine("ejs", ejsMate);

// requiring models
// const sampleListings = require('./init/data.js');
// const { type } = require('os');


main()
    .then(() => console.log("connected to db") )
    .catch((err) => {console.log(err)});

async function main() 
{
    // await mongoose.connect('mongodb://127.0.0.1:27017/airbnb');
    await mongoose.connect(dbUrl);
}

// Using connect-mongo for storing sessions while deployment for production.
const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600, // It will store the user's data for 24 hours in the browser.
})

store.on("error", () =>
{
    console.log("Error in Mongo Session Store", err);
});
// If there is some error in our mongo session store. 

const sessionOptions = 
{
    store:store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie: 
    {
        expires: Date.now() + 3*24*60*60*1000,  // 3 days to expire our cookie;
        maxAge: 3*24*60*60*1000, // 3 days to expire our cookie;
        httpOnly: true,  // We does this for security purposes.
    },
};
// Finally our cookies will be stored for 3 days, as expires:3days touchAfter ke baad likha h.

app.use(session(sessionOptions));  // Now, every req will pass through the sessionOptions.
app.use(flash()); // always declare flash before routes. because we will create flash with the help of routes.

// passport uses session, as we know that for each session of a user, his username, id, password has to be
// logged in. So we will user Passport after declaration of sessionOptions().

app.use(passport.initialize()); // A middleware that initializes passport.
app.use(passport.session());
// A web application needs the ability to identify users as they browse from page to page. This series of
// requests and responses, each associated with the same user, is known as a session. 
passport.use(new LocalStrategy(User.authenticate()));
// This is done for the local authentication of the user using the User model and LocalStrategy of passport.

passport.serializeUser((User.serializeUser()));
passport.deserializeUser((User.deserializeUser()));
// actually, passport serialize and deserialize user. So above is used to do so. Serialize means
// to store user's information in a session and deserialize means to unstore/remove the user's info
// from the session.




app.get("/", (req,res) =>
{
    res.redirect('/listings');
});


// We are now done with the stylish designing error pages also
// now we will make stylish review page forum.

// app.get("/demouser", async (req,res) =>
// {
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "KeshavArora",
//     });

//     let newUser = await User.register(fakeUser, "password"); // This method is used to store the username and it's password.
//     res.send(newUser);
// // what we get is :
// // username, email, hashed form of password, our salt, and id(given by mongoose) in our response.
// })

app.use((req,res,next) =>
{
    res.locals.successMsg = req.flash("success");
    res.locals.Error = req.flash("error");
    res.locals.currUser = req.user; // we cannot directly pass req.user in ejs file. so we will pass it
                                    // through local variables.
    next();
})

app.use("/listings", listingRouter);  // Implies, for routes starting with /listings, router will search for the routes
                                 // in routes/listings.js
app.use("/listings/:id/reviews", reviewRouter); // implies, for routes starting with /listings/:id/reviews, router
                                           // will serach for the routes in /routes/reviews.js
// but here in this case :id will not gets parsed with the reviews.js. ie we cannot acccess id directly 
// by req.params now. we have to parse :id with /routes/reviews.js by adding additional option in the
// express.Router({meregeParams: true}); 
// Now everything will work.

app.use("/", userRouter);


// as if user gets into some other route that doesn't exists. We want to throw error code of 404 page not found.

// app.all("*", (req,res,next) =>
// {
//     next(new ExpressError(404,"Page not found !!"));
// })


app.use((err, req, res, next) =>
{
    // res.send("something went wrong"); But as we know we want to show custom errors, we will create ExpressError
    // Now, it will throw error for every error in our server side.
    let {status = 500 , message = "Something went wrong"} = err;
    // res.status(status).send(message); we want stylish response.
    res.render('error.ejs',{status, message});
});

// Express.router() is used to restructure the code into smaller components, now see that 250 lines code of
// app.js is now reduced to the 70 lines using express.router(); It's good practice to use this and break 
// our code into smaller file components.

// Express Router: Express router is a way to organize your express application such that our primary app.js
//                 does not gets bloated.
// const router = express.Router();  // creates a new object.


// Now, we are with the part of authentication and authorization. Let's do it with passport library package.
// npm i passport.

// first , we will create user model for this to be done.

// now we will connnect our login route to the webpage. We will allow user to create listings after logged
// in only. How can we check that user has logged in...
// req.isAuthenticate()  // Passport method :- This method is used to check whether the user is logged in or not.

// now we will see how can we logout the user from the current session.
// using passport, it is now easy to logout the user.
// req.logout() -> This function of passport is used to logout the user from the current session.



// automatic login after signup:
// passport's login method automatically establishes a login session. We can invoke login to automatic
// login a user. So we will apply this method in /signup route.


// now the issue is, when we login, we are redirected to the /listings page. But we want the user to 
// be on the page, he was trying to open. let say he clicked on "new listing", but was not logged in
// so he was redirected to the login page. Now, after login, he should be redirected to the "new listing"
// not to the /listings page. So we will use req.path & req.orignalUrl to store the path of the page he was
// trying to open. and after login, we will redirect him to that page only.
// req.path -> It is a relative path to the current webpage.
// req.orignalUrl -> It is a full path to the current webpage.

// Now, we will see authorization, ie. we will allow the user to edit/delete his own listings only.
// for this, we have to give each listings it's owner.

// MVC Framework: Media, views, controller -> This is nothing but a clear way to organize our code.
// Model: It is a representation of the data that our application operates on. It is responsible for
//        managing the data of the application. It responds to the request from the view and it also
//        responds to the instructions from the controller to update itself.
// View: It is responsible for displaying the data that is contained in the model. It is the presentation
//      of the data in a particular format. It is the only part of the application that the user interacts
//      with.
// Controller: It is responsible for responding to the user input and perform interactions on the data model
//            objects. The controller receives the input, it validates the input and then performs the
//            business operation that changes the state of the data model.

// Extract: We should store our core files in the model, displaying files in the views directory
//          and core functioning of routes callback in the controller directory.

// Router.route -> It is used to chain multiple routes together. It is used to reduce the code redundancy.
//                 If we are redirecting to the same path with different requests like get, post,
//                 put etc... on the same path, then we can use router.route() see in the models dir

// we will use starability library of github.io to show better reviews on our webpage.


// Uploading image instead of link from websites:
// There are 2 issues, we have to face to upload pictures in our webpage:
// 1. form is not capable of sending files to the backend.
// 2. mongodb file storing format is BSON, so it has some limit to store a particular data, so
//    we cannot store images in the database.

// so we have to use some 3rd party servers to store our data and access it in the link form.
// There are services provided by microsoft azure, amazon aws for production level development.
// but we will use free services for now us.

// bydefault, our form sends data in urlencoded format that we did using app.use(express.urlencoded({extended:true}));
// but to send files, we have to use enctype = "multipart/form-data" in the form tag.

// when we tried to send res.send(req.body) while uploading form with image input
// we can see that {} is the output, it means that our form is not able to send the data in the body.
// our backend is not able to interpret the data, as form has sent data not in the urlencoded form
// but in the multipart-form, so we have to use multer library to interpret the data.

// npm i multer -> It is a middleware for handling multipart/form-data, which is primarily used for
//                 uploading files. It makes file uploading process easier.

// we get API key, API secret and API environment variables with our cloudinary free storage
// account, so to save this, we don't send this with our code. It is private and should be 
// kept secret. So we will store this in the .env file and use dotenv package to access it.
// In .env file, There is format of writting (KEY = value). Using this format, we store
// our API key, secret and environment variables in the .env file. KEY in the capital letters.

// we have to use dotenv package to access the .env file. So we will use require('dotenv').config();
// to access the .env file.
// install it using "npm i dotenv";

// There we have 2 libraries to use to use multer + cloudinary:
// cloudinary and multer-storage-cloudinary
// so get ready to install it... "npm i cloudinary multer-storage-cloudinary"


// Now, we will create preview for the images, The need of it is, let say user has uploaded
// some high quality images, so it is better to show the preview of the images before uploading
// to reduce the quality and decrease the latency rate of our edit page.

// In the documentation of cloudinary, serach image-transformations: https://cloudinary.com/documentation/image_transformations
// we will use the transformations to show the preview of the images. It has some inbuilt
// features to reduce the quality of image. By replacing the orignal url of the image with:
// 'https://res.cloudinary.com/djq8rkaw7/image/upload/v1712996142/Airbnb_DEV/glibk0cigpxuofvqgbae.jpg'
// with 'https://res.cloudinary.com/djq8rkaw7/image/upload/c_fill,h_300,w_400,e_blur:300/v1712996142/Airbnb_DEV/glibk0cigpxuofvqgbae.jpg'
// h_300 -> height : 300px
// w_250 -> width: 250px
// c_fill-> fill the screensize
// e_blur -> blur the image

// Now, we have shown the preview of the image:
// Now we are going to integrate Google Maps in our project.

// We can use google api, but here we're not going to use it, as it requirs credit card.
// we will use mapbox api, as it is free and easy to use.
// But as mapbox is also requiring me debit card, so I will use google maps api instead.

// Geocoding: Geocoding is the process of converting addresses (like a street address) into geographic
//           coordinates (like latitude and longitude), which you can use to place markers on a map,
//           or position the map.
// Google maps and mapbox, both have their own geocoding API.

// We should store coordinates in the geoJson format. Although, we can edit schema and add
// the file geoCodes, but using geoJson format is recommended in professional cases.

// geometry: {
//     type: {
//         type: String,     //Don't do {location: type:String}
//         enum: ['Point'],  // 'location.type' must be a 'Point'.
//         required:true,
//     },
//     coordinates: {
//         type: [Number],
//         required:true,
//     }
// };

// for the proper functioning of the buttons we've created in the nav bar. We have to create
// another parametre category in our listing Schema. 
// category: 
// {
//     type: String,
//     enum: ["mountains", "arctic", "farms", "deserts"],
// }

// Then we will create a request, according to the button clicked by the user. 
// We will check the category request and will show the hotels and findMethods of mongodb 
// to initiate the serch by category.

// Now, we will add Tax switch to our website. For this, we will use switches of bootstrap
// inside the section of checks and radios.



app.listen(port, () =>
{
    console.log(`app is listening to the port ${port}`);
});


// Deployment of our Project:
// Now, we will upload our complete database to cloud services.
// MongoAtlas is the best service we will use for free. good performance, industrial use.

// Now, we will store our session using connect-mongo. previously it was stored in the localhost
// Which may cauase leak of data... so install it using "npm i connect-mongo".

// For deployment, now we have multiple options :
// render
// netlify
// cyclic etc...

// we have to give our node version to the rendering engines... as it may cause errors if not given.
// write it in the package.json file.

// "engines":{
//     "node": "20.11.0"
//   },
// Check node version using "node -v"

// We will have to push our code directly to the github private repo and give render
// access to that repo. So that whenever we have to push some changes in our code, we will
// directly commit it in github and ask render to pickup the new copy of our github code to render.

// Connect render with github account.

// WARNING: we are not going to upload .env file to public platform... not even in the github.
//          as it contains all the sensitive information of our webpage.
// We are not going to upload node modules also, as it can be accessed directly using "npm install"

// uploading our project to github.
// git init
// git status
// now we are not going to push .env and node_modules/ file, so we have to tell github to ignore
// these files. for this create .gitignore file and write names of the files you want to ignore.
// .env 
// node_modules/ (/ is written so that It will ignore the whole folder).
// now in the git status, we won't get ignored files.
