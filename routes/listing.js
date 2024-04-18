const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utilities/wrapAsync.js');
const {listingSchema} = require('../schema.js');
const ExpressError = require('../utilities/ExpressError.js');
const Listing = require('../models/listing.js');
const Review = require("../models/reviews.js");
const {isLoggedIn} = require("../middleware.js");

const listingController = require("../controller/listings.js");

// requiring storage from the cloudConfig.js file.
const {storage} = require('../cloudConfig.js');
// declaring library multer for the image upload.
const multer = require('multer');
const upload = multer({storage}); // This will save the uploaded image file in the upload folder.




// Index route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn , upload.single('listing[image]') , wrapAsync(listingController.newListing));

// upload.single('listing[image]') -> This is a middleware that will upload the image file in the uploads folder.
// uploads folder is created automatically.
// by doing this, we have stored our file in the local storage and accessed it's information.
// now we will store the file in the cloud storage to access it in the web server.
// we will use cloudinary for this purpose. It's free for small scale web development.

// now we can see, that our file is getting uploaded to the cloudinary web server and it is 
// visible there, and it's path is in the req.file.path parametre. Now we have to save this
// file link in the database. So that we can access it to show in webpage.

// Now creating a new route:
router.get("/new", isLoggedIn , listingController.newListingForm);



// Creating, updating and deleting a Show Route
router.route("/:id")
    .get(wrapAsync(listingController.show))
    .put(isLoggedIn , upload.single('listing[image]'), wrapAsync(listingController.editListing))
    .delete(isLoggedIn , wrapAsync (listingController.deleteListing));


// toLocaleString() -> This function is used to put comma's in amount / rs to display it better.
// as every country has it's own way of putting comma's in between the numbers.
// let num = 12345;
// num = num.toLocaleString("en-IN");   -> It will convert Simple numbers to indian standard comma's rs sys.
// now num = 12,345;   


// Now Creating Update Route
router.get("/:id/edit", isLoggedIn , wrapAsync(listingController.getEditListing));




// Till now, we have done with our basic crud operations... including adding a hotel, updaing details
// of a hotel, delete a hotel and viewing the list of all the hotels of our database.

// Now, we will style our webpage to make it look better. 

// EJS MATE: EJS Mate is a package of npm, that helps us to create template better.
//           Basically ejs helps us to create alot of templates and layouts. Like navbar and footer
//           is generally we found in every webpage, so we don't need to write the whole code again
//           and again... we will use EJS mate instead.
// installing ejs mate by "npm i ejs-mate"
// const ejsMate = require('ejs-mate');



// Till now we're able to edit delete update our listings. but now we've to ensure that the data we've 
// entered is correct and follows the schema of collections made in the backend. To ensure this we've to
// check validations of our form.

// FORM VALIDATIONS:
// When we enter the data in the form, the browser and/or the web server will check to see the data is in the
// correct format and within the constraints set by the application.

// one way is to set "required" to all the inputs that are mandatory to fill... but it is not so fancy to see.
// so we will use getbootstrap.com under the section validations>forms to use it's fancy validations.

// So, we have added validations in our frontend... but still we've to add validations in our backend too..
// Why... our backend also requires validations, as if someone post request using hoppscotch.io type websites.
// our frontend won't work, that wrong data may directly enter into our database. so it has to be solved.
// our server data is still vulnerable.
// let's make validations for the backend.

// There are also validations left... as we have not delcared in the frontend, that our inputs should be
// number, string etc... etc... So It has to be solved too. 

// These errors will be from the backend. as we've declared schema in the backend of our database.
// Also that errors would be asynchronous errors, as in deleting, updating or adding new listings, we're using
// asynchronous functions only.
// So we will now add middlewares to solve that errors.



// Now we are also able to send errors with errorCodes and errorMessages. But still, we want our errors
// to be shown in stylish way. so what we can do is: create template error.ejs
// We will show stylish alerts using bootstrap.


module.exports = router;