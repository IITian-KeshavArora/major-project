const express = require("express");
const router = express.Router({mergeParams:true}); // mergeParams will merge all the parametres coming from app.js
const wrapAsync = require('../utilities/wrapAsync.js'); // required to handle server side errors.
const ExpressError = require('../utilities/ExpressError.js');  // class created for custom error code and msgs.
const {reviewSchema} = require('../schema.js');  // This is used for server side validation made by joi.api
const Review = require('../models/reviews.js'); // review model required.
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js");

// adding controller to this route from controller directory for functioning:
const reviewController = require("../controller/reviews.js");



// to validate review
const validateReview = (req,res,next) =>
{
    let {error} = reviewSchema.validate(req.body);
    if(error)
    {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw next(new ExpressError(400,errMsg));   
    }
    else
    {
        next();
    };
}

// Reviews Route

router.post("/" , validateReview, wrapAsync(reviewController.postReview));

// Now, we are able to add reviews to our webpage. Now we will see how we can delete them.

// Deleting Reviews: Mongo $pull operator.
// $pull: The $pull operator removes from an existing array all instances of a value or values that matches
//        a specified condition.

// Creating a DELETE request to remove the reviews:

// Delete Review Route
router.delete("/:reviewId",isLoggedIn , wrapAsync(reviewController.deleteReview));

// Handling Listings delete: Let say we have deleted the whole listing, so now, we have to delete reviews 
//                           and reviewId related to that listing.
// so we will use pre/post again here to do so in the listing.js in models directory.

// let say our request is at link /listings/:id/reviews, it will be replaced as /
// as now our main common part is /listings/:id/reviews,
// for /listings/:id/reviews/:reviewId -> Link will be replaced by /:reviewId


module.exports = router;