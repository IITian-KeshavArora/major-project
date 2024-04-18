// This middleware we're using to check if the user is logged in or not. If not, then we will redirect him to the login page.
// Now, we will use this middleware when user tries to add/delete a listing, edit a listing or comment review.


module.exports.isLoggedIn = (req,res,next) =>
{
    if(!req.isAuthenticated()) // It will check whether the user is logged in or not.
    {
        // if our user was not logged in, we will save the information where user wants to redirect
        // after he logs in.
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to use this function!");
       return  res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next) =>
{
    if(req.session.redirectUrl)
    {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}