const Review = require("../models/reviews");
const Listing = require("../models/listing");

// to post a review 
module.exports.postReview = async (req,res) =>
{
    if(req.user)
    {
        let {id} = req.params;
        let hotelinfo = await Listing.findById(id);
        let {review} = req.body;
        let newReview = new Review(review);
        newReview.owner = req.user.username;
        hotelinfo.reviews.push(newReview);
        await newReview.save();
        await hotelinfo.save();
        req.flash("success", "Reviews Added successfully!!");
        res.redirect(`/listings/${hotelinfo._id}`);
    }
    else
    {
        req.flash("error", "You must be logged in to add reviews!!");
        res.redirect('/login');
    }

    
    // let {review[ratings], review[comments]} = req.body;
    // console.log(review[ratings], review[comments]);
};

// route to delete a review
module.exports.deleteReview = async (req,res) =>
{
    let {id, reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId); // we've deleted review from the review list
// But we have to delete our review reference that we created in the listings.id[review]
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}}); // It will do the so.
    req.flash("success", "Review Deleted successfully");
    res.redirect(`/listings/${id}`);
}