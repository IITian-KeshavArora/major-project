const User = require("../models/user.js");

// get request for signup page:
module.exports.getSignup = (req,res) =>
{
    res.render("./users/signup.ejs");
};

// post request for signup page:
module.exports.postSignup = async(req,res) =>
{
    try
    {
        let {username, password, email} = req.body;
        username = username.toLowerCase();
        const newUser = new User({username, email});
        const registeredUser = await User.register(newUser, password);
        // now the user is registered, So we will logged in him automatically.
        req.login(registeredUser, (err) =>
        {
            if(err) 
            {
                return next(err);
            }
            let signupHello = username.charAt(0).toUpperCase() + username.slice(1);
            req.flash("success", `Hi ${signupHello}! Welcome to Airbnb!! You're signed up!`);
            res.redirect('/listings');
        });


    }
    catch(err)
    {
        req.flash("error", err.message);
        res.redirect('/signup');
    }
}

// get request for the login page
module.exports.getLogin = (req,res) =>
{
    res.render("./users/login.ejs");
};

// post request for the login page
module.exports.postLogin = async (req,res) =>
{

    let {username} = req.body;
    let loginHello = username.charAt(0).toUpperCase() + username.slice(1);
    req.flash("success", `Hi ${loginHello}! Welcome back to Airbnb!!`);
    // res.redirect("/listings");
    // res.redirect(req.session.redirectUrl); It won't works as when we request to passport
    // and we get a success message, then It will reset the value of req.session.redirectUrl
    // so we have to store the value of redirectUrl in the locals, because it cannot be deleted
    // by passport. So, we will use it in the middleware.js file.
    // res.redirect(res.locals.redirectUrl);
    res.redirect(res.locals.redirectUrl || "/listings");
};

// get request for the logout page
module.exports.getLogout = (req,res) =>
{
    req.logout((err) =>
{
    if(err)
    {
       return next(err);
    }
    req.flash("success", "Logged out successfully!!"); 
    res.redirect('/listings');
})
}