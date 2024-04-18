const Listing = require("../models/listing");

// Index Route
module.exports.index = async (req,res) =>
{
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", {allListings});
};

// Show Route
module.exports.show = async (req, res) =>
{
    let {id} = req.params;
    let hotelInfo = await Listing.findById(id).populate("reviews").populate("owner");
    // console.log(hotelInfo); // details of hotel and it's owner
    // console.log(req.user); //  details of the current user logged in.
    // console.log(res.locals.currUser); we can pass res.locals in other ejs files and not the req.user. It is also giving the details of user currently logged in.
    if(!hotelInfo)
    {
        req.flash("error", "Listings doesn't Exists!!");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs", {hotelInfo});
}

// Post request to add new listings in the current webpage:
module.exports.newListing = async (req,res,next) =>
{
        let url = req.file.path;
        let filename = req.file.filename; //Yeah, we've accessed the filename and url of the image file.
        // console.log(url,"....", filename);
        let {title, price, description, country, location, image} = req.body;
        if(!title)
        {
            throw new ExpressError(400, "Title is missing");
            // By this, we created 400(bad request) error for server side. verified from the hoppscotch.io req sent.
        };
        if(!price)
        {
            throw new ExpressError(400,"Price is missing");
        };
        if(!location)
        {
            throw new ExpressError(400, "Location is missing");
        };
        if(!country)
        {
            throw new ExpressError(400, "Country is missing!!");
        };
        if(!description)
        {
            throw new ExpressError(400, "Description is missing!!");
        };

// As we can see, it is very tidious task and very complex code we've got which is inefficient and not recommended.
// We will use joe.api for schema validation
// install joi using "npm install joi"


        let hotel = new Listing({title: title, price: price, description: description, country: country, location: location,
                                 image: {filename: "listingImage", url: image}});
        hotel.owner = req.user._id;
        hotel.image.url = url;
        hotel.image.filename = filename;
        await hotel.save();
        req.flash("success", "Successfully added new listing");
        res.redirect('/listings');
}

// render new form:
module.exports.newListingForm = (req,res) =>
{
    // console.log(req.user);     // It will show me the details of user.
    res.render("./listings/new.ejs");
}

// get request to edit the listing:
module.exports.getEditListing = async (req,res) =>
{
    let {id} = req.params;
    let hotel = await Listing.findById(id);

    let orignalImageUrl = hotel.image.url;
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_300,e_blur:10");
    if(!hotel)
    {
        req.flash("error", "Listings doesn't Exists!!");
        res.redirect("/listings");
    }
    res.render('./listings/edit.ejs', {hotel, orignalImageUrl});
};



// post request to edit the listing
module.exports.editListing = async (req,res) =>
{
    let {id} =req.params;
    if(!req.file)
    {
        req.flash("error", "Please upload the image again");
        return res.redirect(`/listings/${id}`);
    }
    let {title, description, price, image, location, country} = req.body;
    if(!title)
    {
        throw new ExpressError(400, "Title is missing");
        // By this, we created 400(bad request) error for server side. verified from the hoppscotch.io req sent.
    };
    if(!price)
    {
        throw new ExpressError(400,"Price is missing");
    };
    if(!location)
    {
        throw new ExpressError(400, "Location is missing");
    };
    if(!country)
    {
        throw new ExpressError(400, "Country is missing!!");
    };
    if(!description)
    {
        throw new ExpressError(400, "Description is missing!!");
    };

    let url = req.file.path;
    let filename = req.file.filename;

    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error", "You don't have permission to edit the listings!!");
       return  res.redirect(`/listings/${id}`);
    }

    let listings = await Listing.findByIdAndUpdate(id, {$set: {title: title, price: price, location: location, country: country,
                                     image: {filename: "listingImage", url: image}, description: description}}, {new:true});
    listings.owner = req.user._id;
    listings.image.url = url;
    listings.image.filename = filename;
    await listings.save();

    req.flash("success", "Listing Updated successfully!!");
    res.redirect(`/listings/${id}`);
}

module.exports.deleteListing = async (req,res) =>
{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id))
    {
        req.flash("error", "You don't have permission to edit the listings!!");
       return  res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndDelete(id);
    req.flash("success", "Successfully Deleted listing!!");
    res.redirect("/listings");
}