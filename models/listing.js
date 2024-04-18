const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");

const listingSchema = new Schema({
    title:
    {
        type: String,
    },
    description:
    {
        type: String,
    },
    image:
    {   
        url: String,
        filename: String,
    },
    price:
    {
        type: Number,
        required: true,
        // min: [100, "Price is too low to rent hotels @ AirBNB"],
        // max: [10000, "Price is too high to rent hotels @ Airbnb"],
    },
    location:
    {
        type:String,
        required: true,
    },
    country:
    {
        type: String,
        required: true,
    },
    reviews: [
        {
            type: mongoose.Types.ObjectId,
            ref: "review",
        }
    ],
    owner:
    {
        type: mongoose.Types.ObjectId,
        ref: "User",
    }

})

// Handling Listing deletion. On the deletion of the list, we will delete all the reviews, related to that listing.
// so to access reviews, require Review here also.

listingSchema.post("findOneAndDelete", async(listing) =>
{
    if(listing)
    {
        await Review.deleteMany({_id: {$in: listing.reviews}}); // It will do so.
    };
});
// now whenever we delete a list by the command "findOneAndDelete", it will call that listingSchema post
// middleware & executes the following to delete the reviews related to that list.
// We are successfully done with it.


const Listing = mongoose.model("Listing" , listingSchema);
module.exports= Listing; // By doing so, we have successfully exported our Listing module.